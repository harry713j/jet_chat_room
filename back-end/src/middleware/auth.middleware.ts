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
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401).json({
        message: "Unauthorized access",
        statusCode: 401,
      });
      return;
    }

    try {
      const decodedToken = jwt.verify(
        token!,
        process.env.ACCESS_TOKEN_SECRET!
      ) as jwt.JwtPayload;

      if (typeof decodedToken === "string") {
        res.status(401).json({
          message: "Invalid token format",
          statusCode: 401,
        });
        return;
      }

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        res.json({
          message: "Invalid access token",
          statusCode: 401,
        });
        return;
      }

      req.user = user;
      next();
      return;
    } catch (err) {
      if ((err as Error).name !== "TokenExpiredError") {
        res.status(401).json({
          message: "Invalid access token",
          statusCode: 401,
        });
        return;
      }
    }

    // if access token is expired then, renew it using refresh token
    const refreshToken = req.cookies?.refrehToken;

    if (!refreshToken) {
      res.status(401).json({
        message: "Unauthorized - refresh token missing",
        statusCode: 401,
      });
      return;
    }

    let refreshDecoded;
    try {
      refreshDecoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as jwt.JwtPayload;
    } catch {
      res.status(403).json({
        message: "Invalid refresh token",
        statusCode: 403,
      });
      return;
    }

    const user = await User.findById(refreshDecoded?._id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({
        message: "Refresh token not recognized",
        statusCode: 403,
      });
      return;
    }

    const newAccessToken = user.generateAccessToken();

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("accessToken", newAccessToken, options);
    req.user = user;
    next();
  } catch (err) {
    const error = err as Error;
    serverLogger(error);
    res.status(500).json({
      message: "Something went wrong " + error.message,
      statusCode: 500,
    });
    return;
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
