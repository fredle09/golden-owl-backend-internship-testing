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
  async findAll(params?: { page?: number, limit?: number }): Promise<Score[]> {
    const { page = 1, limit = 100 } = params;
    return this.scoreModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit).exec();
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
        ...(_id && { _id: new ObjectId(_id) }),
        ...(studentId && { studentId }),
      })
      .exec();
  }
}
