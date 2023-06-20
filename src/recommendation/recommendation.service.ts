import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import workerThreadFilePath from '../workers/config';
import { Worker } from 'worker_threads';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import * as fs from "fs";
import * as math from "mathjs";
import * as path from "path";
import { Product, ProductDocument } from "../schemas/product.schema";
@Injectable()
export class RecommendationService {
    constructor(
      @InjectModel(Product.name) private badgeModel: Model<ProductDocument>,
      @InjectModel(User.name) private userModel: Model<UserDocument>,

    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async calcUV() {
      const goods = await this.badgeModel.find({}, {_id: true});
      const users = await this.userModel.find({role: 'user'}, {grades: true});
      const data = JSON.stringify({goods, users});

      new Worker(workerThreadFilePath, {workerData: data});
    }

    async getRecomendation(userEmail: string) {
      const fileDirectory = path.join(process.cwd(), 'st.json');
      let {U, V} = JSON.parse(String(fs.readFileSync(fileDirectory)));
      const users = await this.userModel.find({role: 'user'});
      let userIndex = -1;
      for(let i = 0; i < users.length; i++) {
        if(users[i].email === userEmail) {
          userIndex = i;
          break;
        }
      }
      const badges = await this.badgeModel.find({}, {_id: true});
      let grades = math.multiply(U, V)[userIndex];
      const user = users[userIndex];
      grades = grades.map((item, index) => {
        return(
          {
            id: String(badges[index]._id),
            grade: item
          }
        )
      }).sort((a, b) => b.grade - a.grade)
      
      const recommendations = [];
   
      for(let i = 0; i < grades.length; i++) {
        if(!user.grades.find(item => item.productId === grades[i].id)) {
          recommendations.push(grades[i].id);
        }
      }

      return recommendations.slice(0, 5);
    }

}