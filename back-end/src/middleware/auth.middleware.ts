import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { serverLogger } from "../utils/logger.js";
import { Socket } from "socket.io";

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        message: "Unauthorized access",
        statusCode: 401,
      });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    if (typeof decodedToken === "string") {
      res.status(401).json({
        message: "Invalid token format",
        statusCode: 401,
      });
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      res.json({
        message: "Invalid access token",
        statusCode: 401,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    const error = err as Error;
    serverLogger(error);
    res.status(500).json({
      message: "Something went wrong " + error.message,
      statusCode: 500,
    });
  }
}

export async function socketAuthMiddleware(socket: Socket, next: any) {
  try {
    // Extract from query or auth payload
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error("Unauthorized: No token provided"));
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    if (typeof decoded === "string" || !decoded?._id) {
      return next(new Error("Invalid token format"));
    }

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new Error("Unauthorized: User not found"));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error: " + (err as Error).message));
  }
}
