import { NestFactory } from '@nestjs/core';
import { workerData } from 'worker_threads';
import { AppModule } from '../app.module';

import * as math from "mathjs";
import * as fs from "fs"
function reduceMatrices(matrix) {
  let rank = 3
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
    console.log(matrix);
    return matrix;
}

function calculateUV(R) {
   

  const nonZeroIndexes = [];
  const zeroIndexes = []
  const nonZero = calculateNonZero(R, nonZeroIndexes, zeroIndexes);
  const average = calculateAverage(R, nonZero);
  
  const {reducedU, reducedV} = reduceMatrices(R);
  
  fillUV(reducedU, reducedV, average);

  const min = 0;
  const max = nonZeroIndexes.length;
  const lambda_reg = 0.02;
  let step = 0.01;
  let rmse: any = 0;
  let oldRmse = 0;
  let threshols = 0.0001;
  let iters = 0;
  do{
      oldRmse = rmse;
      rmse = 0;
      console.log(reducedU);
      console.log(reducedV);
      //for(let p = 0; p < 500; p++){
        let choice = Math.floor(Math.random() * (max - min) + min);
        let ij = nonZeroIndexes[choice];
        for(let k = 0; k < 3; k++) {
            reducedU[ij[0]][k] = reducedU[ij[0]][k] + step * (
                ((R[ij[0]][ij[1]] - math.multiply(reducedU[ij[0]], math.transpose(reducedV)[ij[1]])) * reducedV[k][ij[1]]) - lambda_reg * reducedU[ij[0]][k]
            )
            
            reducedV[k][ij[1]] = reducedV[k][ij[1]] + step * (
                ((R[ij[0]][ij[1]] - math.multiply(reducedU[ij[0]], math.transpose(reducedV)[ij[1]])) * reducedU[ij[0]][k]) - lambda_reg * reducedV[k][ij[1]]
            )
        }
      //}
      
      for(let l = 0; l < nonZeroIndexes.length; l++) {
          let i = nonZeroIndexes[l][0];
          let j = nonZeroIndexes[l][1];
          rmse += Math.pow(R[i][j] - math.multiply(reducedU[i], math.transpose(reducedV)[j]), 2);
      }
      rmse /= nonZero;
      rmse = math.sqrt(rmse);

      if(rmse > oldRmse - threshols) {
          step *= 0.66;
          threshols *= 0.5;
      }
      iters++;
  } while(math.abs(oldRmse - rmse) > 0.00001 && rmse > 0.7 && iters < 10000)
  console.log(math.multiply(reducedU, reducedV));
  fs.writeFileSync("./st.json", JSON.stringify({U: reducedU, V: reducedV}));
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const {users, goods} = JSON.parse(workerData);

  const matrix = (createMatrix(goods, users));
  calculateUV(matrix);
  app.close();
}

run();