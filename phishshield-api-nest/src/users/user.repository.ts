import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name)
              private readonly userModel: Model<User>) {
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments({ deleted: false });
  }

  async getUsers(page: number, perPage: number) {
    return this.userModel
      .find({ deleted: false })
      .skip((page - 1) * perPage)
      .sort({ createdAt: 'desc' })
      .select({ __v: 0, apiPath: 0 });
  }

  async getAllUsersByParam(userId: string, isAdmin: boolean) {
    return this.userModel
      .find({
        _id: { $ne: userId },
        role: isAdmin ? 'USER' : 'ADMIN',
        deleted: false,
      }).select([
        'firstname',
        'lastname',
        'avatar',
        '_id',
      ]);
  }

  async findUser(userParam: Partial<UserInterface>) {
    return this.userModel
      .findOne({ ...userParam, deleted: false });
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email, deleted: false }).select('+password').exec();
  }

  async findUserById(_id: string): Promise<(User & Record<string, any>) | null> {
    return this.userModel.findOne({ _id, deleted: false }).lean().exec();
  }

  async insertUser(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async updateUser(userId: Types.ObjectId, updatedUser: Partial<UserInterface>) {
    await this.userModel.findByIdAndUpdate(userId, updatedUser);
  }

  async deleteUser(user: User): Promise<Partial<UserInterface>> {
    return {
      ...user.toObject(),
      deleted: true,
      deletedAt: new Date(),
    };
  }

  async getUsersFromYear(lastYearDate: Date) {
    return this.userModel.aggregate([
      { $match: { createdAt: { $lte: lastYearDate } } },
      { $group: { _id: null, totalUsers: { $sum: 1 } } },
    ]);
  }

  async getNumberOfUsers() {
    return this.userModel.countDocuments();
  }

  async getMonthlyUserStatistic(currentYear: Date) {
    return this.userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: currentYear },
          deleted: false,
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          total: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);
  }

  async getWeeklyUserStatistic(currentWeek: Date) {
    return this.userModel.aggregate([
      { $match: { createdAt: { $gte: new Date(currentWeek) } } },
      {
        $group: {
          _id: {
            week: { $week: '$createdAt' },
            day: { $dayOfWeek: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getUsersByAuth() {
    return this.userModel.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: '$isGoogleAuth',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);
  }

  async verifyToChangePassword(user: User): Promise<void> {
    await this.userModel.updateOne({ _id: user._id }, { isUserActivated: true });
  }
}