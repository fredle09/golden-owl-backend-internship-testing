// src/score/score.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Score } from './score.schema';
import { ObjectId } from 'mongodb';
import { SCORE_RANGES, SUBJECTS } from 'src/common/dto/constants';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel('Score') private readonly scoreModel: Model<Score>,
  ) { }

  // Lấy tất cả điểm số
  async findAll(params?: { page?: number, limit?: number }): Promise<Score[]> {
    const { page = 1, limit = 100 } = params ?? {};
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

  async getRangeCounts({ subject }: { subject: string }): Promise<any> {
    const filter: any = {};

    // Use constants to filter by subject
    if (subject && SUBJECTS.includes(subject)) {
      filter[subject] = { $exists: true };
    }

    // Build the aggregation pipeline
    const rangeProjection = SUBJECTS.reduce((acc, sub) => {
      acc[`${sub}-ranges`] = {
        [SCORE_RANGES.LESS_THAN_4]: { $cond: [{ $lt: [`$${sub}`, 4] }, 1, 0] },
        [SCORE_RANGES.BETWEEN_4_AND_6]: { $cond: [{ $and: [{ $gte: [`$${sub}`, 4] }, { $lt: [`$${sub}`, 6] }] }, 1, 0] },
        [SCORE_RANGES.BETWEEN_6_AND_8]: { $cond: [{ $and: [{ $gte: [`$${sub}`, 6] }, { $lt: [`$${sub}`, 8] }] }, 1, 0] },
        [SCORE_RANGES.GREATER_THAN_OR_EQUAL_8]: { $cond: [{ $gte: [`$${sub}`, 8] }, 1, 0] },
      };
      return acc;
    }, {});

    // Apply the filter stage if any filters exist
    const matchStage = Object.keys(filter).length > 0 ? [{ $match: filter }] : [];

    const result = await this.scoreModel.aggregate([
      ...matchStage,
      { $project: rangeProjection },
      {
        $group: {
          _id: null,
          ...SUBJECTS.reduce((acc, sub) => {
            acc[`${sub}-range-${SCORE_RANGES.LESS_THAN_4}-count`] = { $sum: `$${sub}-ranges.${SCORE_RANGES.LESS_THAN_4}` };
            acc[`${sub}-range-${SCORE_RANGES.BETWEEN_4_AND_6}-count`] = { $sum: `$${sub}-ranges.${SCORE_RANGES.BETWEEN_4_AND_6}` };
            acc[`${sub}-range-${SCORE_RANGES.BETWEEN_6_AND_8}-count`] = { $sum: `$${sub}-ranges.${SCORE_RANGES.BETWEEN_6_AND_8}` };
            acc[`${sub}-range-${SCORE_RANGES.GREATER_THAN_OR_EQUAL_8}-count`] = { $sum: `$${sub}-ranges.${SCORE_RANGES.GREATER_THAN_OR_EQUAL_8}` };
            return acc;
          }, {}),
        },
      },
      {
        $project: {
          _id: 0,
          ...SUBJECTS.reduce((acc, sub) => {
            acc[sub] = {
              [SCORE_RANGES.LESS_THAN_4]: `$${sub}-range-${SCORE_RANGES.LESS_THAN_4}-count`,
              [SCORE_RANGES.BETWEEN_4_AND_6]: `$${sub}-range-${SCORE_RANGES.BETWEEN_4_AND_6}-count`,
              [SCORE_RANGES.BETWEEN_6_AND_8]: `$${sub}-range-${SCORE_RANGES.BETWEEN_6_AND_8}-count`,
              [SCORE_RANGES.GREATER_THAN_OR_EQUAL_8]: `$${sub}-range-${SCORE_RANGES.GREATER_THAN_OR_EQUAL_8}-count`,
            };
            return acc;
          }, {}),
        },
      },
    ]);

    return result.length ? Object.entries(result[0])
      .map(([subject, values]) => ({
        subject,
        ...values as Record<string, number>,
      })) : []; // Return the result or an empty object
  }
}