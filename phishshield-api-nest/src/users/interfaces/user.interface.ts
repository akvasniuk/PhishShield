import {Types} from "mongoose";

export interface UserInterface {
  _id: Types.ObjectId | string,
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  isUserActivated: boolean;
  deleted: boolean;
  deletedAt: Date;
  isGoogleAuth: boolean;
  updated?: Date;
  updatedAt?: Date;
  avatarPhotos?: string[];
}