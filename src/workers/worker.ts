import { NestFactory } from '@nestjs/core';
import { workerData } from 'worker_threads';
import { AppModule } from '../app.module';

import {multiply, transpose, sqrt, abs} from "mathjs";
import fs from "fs"
import path from 'path';

function reduceMatrices(matrix, rank) {
  const R = JSON.parse(JSON.stringify(matrix));
  const reducedU = [];

  for(let i = 0; i < R.length; i++) {
      reducedU.push([])
      for(let j = 0; j < rank; j++) {
          reducedU[i].push(R[i][j]);
      }
  }

  const reducedV = [];

  for(let i = 0; i < rank; i++) {
      reducedV.push(R[i]);
  }
  return {reducedU, reducedV};
}

function calculateNonZero(matrix, nonZeroIndexes, zeroIndexes) {
  let nonZero = 0;

  for(let i = 0; i < matrix.length; i++) {
      for(let j = 0; j < matrix[i].length; j++) {
          if(matrix[i][j] === 0) {
              zeroIndexes.push([i, j]);
          } else {
              nonZeroIndexes.push([i,j]);
              nonZero++;
          }
      }
  }
  return nonZero; 
}

function calculateAverage(matrix, nonZeroCells) {
  let sum = 0;
  for(let i = 0; i < matrix.length; i++) {
      for(let j = 0; j < matrix[i].length; j++) {
          if(matrix[i][j] !== 0) {
              sum+=matrix[i][j];
          }
      }
  }
  return sum / nonZeroCells;
}

function fillUV(reducedU, reducedV, average) {
  for(let i = 0; i < reducedU.length; i++) {
      for(let j = 0; j < reducedU[i].length; j++) {
          reducedU[i][j] = average;
      }
  }

  for(let i = 0; i < reducedV.length; i++) {
      for(let j = 0; j < reducedV[i].length; j++) {
          reducedV[i][j] = average;
      }
  }

  return {reducedU, reducedV};
}

function createMatrix(goods, users) {
    const matrix = [];

    for(let i = 0; i < users.length; i++) {
        matrix.push([]);
        for(let j = 0; j < goods.length; j++) {
            let flag = true;
            if(users[i].grades) {
                for(let k = 0; k < users[i].grades.length; k++) {
                    if(users[i].grades[k].productId === String(goods[j]._id)) {
                        flag = false;
                        matrix[i].push(users[i].grades[k].grade);
                        break;
                    } 
                }
            }
            if(flag) {
                matrix[i].push(0);
            }
        }
    }
    return matrix;
}

function calculateUV(R) {
   
  const nonZeroIndexes = [];
  const zeroIndexes = []
  const nonZero = calculateNonZero(R, nonZeroIndexes, zeroIndexes);
  const average = calculateAverage(R, nonZero);
  const rank = 3;
  const {reducedU, reducedV} = reduceMatrices(R, rank);
  
  fillUV(reducedU, reducedV, average);

  const min = 0;
  const max = nonZeroIndexes.length;
  const lambda_reg = 0.02;
  let step = 0.01;
  let rmse: any = 0;
  let oldRmse = 0;
  let iters = 0;
  do{
      oldRmse = rmse;
      rmse = 0;

      let choice = Math.floor(Math.random() * (max - min) + min);
      let ij = nonZeroIndexes[choice];
      for(let k = 0; k < rank; k++) {
        reducedU[ij[0]][k] = reducedU[ij[0]][k] + step * (
            ((R[ij[0]][ij[1]] - multiply(reducedU[ij[0]], transpose(reducedV)[ij[1]])) * reducedV[k][ij[1]]) - lambda_reg * reducedU[ij[0]][k]
        )
        
        reducedV[k][ij[1]] = reducedV[k][ij[1]] + step * (
            ((R[ij[0]][ij[1]] - multiply(reducedU[ij[0]], transpose(reducedV)[ij[1]])) * reducedU[ij[0]][k]) - lambda_reg * reducedV[k][ij[1]]
        )
      }
      
      for(let l = 0; l < nonZeroIndexes.length; l++) {
          const i = nonZeroIndexes[l][0];
          const j = nonZeroIndexes[l][1];
          rmse += Math.pow(R[i][j] - multiply(reducedU[i], transpose(reducedV)[j]), 2);
      }
      rmse /= nonZero;
      rmse = sqrt(rmse);
      iters++;
  } while(abs(oldRmse - rmse) > 0.000001 && rmse > 0.5 && iters < 100000)
  const filePath = path.join(process.cwd(), 'st.json');
  fs.writeFileSync(filePath, JSON.stringify({U: reducedU, V: reducedV}));
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const {users, goods} = JSON.parse(workerData);
  console.log("WORKER");
  const matrix = (createMatrix(goods, users));
  calculateUV(matrix);
  app.close();
}

run();