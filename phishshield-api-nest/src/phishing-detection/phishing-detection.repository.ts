import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PhishingDetection, PhishingDetectionDocument } from './phishing-detection.schema';

@Injectable()
export class PhishingDetectionRepository {
  constructor(
    @InjectModel(PhishingDetection.name)
    private readonly phishingModel: Model<PhishingDetectionDocument>,
  ) {}

  async findPhishingItems(phishingParam: any, selected: any = {}): Promise<PhishingDetection[]> {
    return this.phishingModel.find(phishingParam).select(selected).exec();
  }

  async countPhishing(userId: Types.ObjectId, searchType?: string): Promise<number> {
    const searchCondition = searchType
      ? {
        $and: [{ userId }, { type: { $regex: new RegExp(searchType, 'i') } }],
      }
      : { userId };

    return this.phishingModel.countDocuments(searchCondition).exec();
  }

  async getPhishingItems(
    userId: Types.ObjectId,
    page: number,
    perPage: number,
    searchType?: string,
  ): Promise<PhishingDetection[]> {
    const searchCondition = searchType
      ? {
        $and: [{ userId }, { type: { $regex: new RegExp(searchType, 'i') } }],
      }
      : { userId };

    return this.phishingModel
      .find(searchCondition)
      .limit(perPage)
      .skip(perPage * (page - 1))
      .sort({ createdAt: 'desc' })
      .select({ __v: 0, apiPath: 0 })
      .exec();
  }

  async createPhishingRecord(phishingItem: Partial<PhishingDetection>): Promise<PhishingDetection> {
    return this.phishingModel.create(phishingItem);
  }

  async getWeeklyDetectionStatistic(
    startOfWeek: Date,
    endOfWeek: Date,
    prediction: number[],
  ): Promise<{ _id: { day: number }; total: number }[]> {
    return this.phishingModel
      .aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: startOfWeek, $lte: endOfWeek } },
              { 'predictions.prediction': { $in: prediction } },
            ],
          },
        },
        { $group: { _id: { day: { $dayOfWeek: '$createdAt' } }, total: { $sum: 1 } } },
        { $sort: { '_id.day': 1 } },
      ])
      .exec();
  }

  async getPhishingByType(): Promise<{ type: string; count: number }[]> {
    return this.phishingModel
      .aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ])
      .exec();
  }

  async getMonthlyPredictionStatistic(currentYear: Date): Promise<{ _id: { month: number }; total: number }[]> {
    return this.phishingModel
      .aggregate([
        { $match: { createdAt: { $gte: currentYear } } },
        { $group: { _id: { month: { $month: '$createdAt' } }, total: { $sum: 1 } } },
        { $sort: { '_id.month': 1 } },
      ])
      .exec();
  }
}
