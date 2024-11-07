// src/score/score.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score } from './score.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel('Score') private readonly scoreModel: Model<Score>,
  ) { }

  // Lấy tất cả điểm số
  async findAll(): Promise<Score[]> {
    return this.scoreModel.find().exec();
  }

  // Lấy điểm số theo ID
  async findOne({
    _id,
    studentId,
  }: {
    _id?: string;
    studentId?: string;
  }): Promise<Score> {
    return this.scoreModel
      .findOne({
        ...(studentId && { studentId }),
        ...(_id && { _id: new ObjectId(_id) }),
      })
      .exec();
  }
}
