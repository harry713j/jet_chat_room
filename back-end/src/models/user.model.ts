import { Schema, model } from "mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserDocument } from "../types/schema";

const userSchema = new Schema<UserDocument>(
  {
    fullName: {
      type: String,
      maxlength: 30,
      trim: true,
      required: [true, "Fullname is required"],
      index: true,
    },
    username: {
      type: String,
      unique: true,
      maxlength: 20,
      minlength: 4,
      trim: true,
      required: [true, "Username is required"],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    onlineStatus: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chatgroup",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// generate the access token and refresh Token with the help of document instance method
userSchema.methods.generateAccessToken = function () {
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const expiry = parseInt(process.env.ACCESS_TOKEN_EXPIRY!);

  const payload = {
    _id: this._id,
    username: this.username,
    email: this.email,
    fullName: this.fullName,
  };

  const options: SignOptions = {
    expiresIn: expiry,
  };

  return jwt.sign(payload, secret, options);
};

userSchema.methods.generateRefreshToken = function () {
  const secret = process.env.REFRESH_TOKEN_SECRET!;
  const expiry = parseInt(process.env.REFRESH_TOKEN_EXPIRY!);

  const options: SignOptions = {
    expiresIn: expiry,
  };

  return jwt.sign({ _id: this._id }, secret, options);
};

export const User = model<UserDocument>("User", userSchema);
