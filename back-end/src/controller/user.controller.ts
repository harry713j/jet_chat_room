import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { serverLogger } from "../utils/logger.js";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { SignupRequest, LoginRequest } from "../types/controller.js";
import { Chatgroup } from "../models/chatgroup.model.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const { fullName, username, email, password }: SignupRequest = req.body;

    // if something is missing
    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    // check of existance
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // hashed the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // register the user in db
    const user = await User.create({
      fullName: fullName,
      username: username,
      email: email,
      password: hashedPassword,
      groups: [],
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      res.status(500).json({
        message: "Failed creating the user",
      });
    }

    res.status(201).json({
      message: "User created successfully",
      user: createdUser,
    });
  } catch (error) {
    serverLogger(error as Error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { identifier, password }: LoginRequest = req.body;

    // if something is missing
    if (!identifier.trim() || !password.trim()) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    // check of existance
    const existedUser = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!existedUser) {
      res.status(404).json({
        message: "User not found",
      });
    }

    // check the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existedUser?.password!
    );

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Password Incorrect",
      });
    }

    // generate refresh and access token and assign
    const tokens = await generateTokens(
      res,
      existedUser?._id as Types.ObjectId
    );

    if (typeof tokens === "string") {
      res.status(500).json({
        message: tokens,
      });
      return;
    }

    const { accessToken, refreshToken } = tokens;

    // assign the tokens
    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUser = await User.findById(existedUser?._id).select(
      "-password -refreshToken"
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Successfully login the user",
        user: loggedInUser,
        refreshToken,
        accessToken,
      });
  } catch (error) {
    serverLogger(error as Error);
    res.status(500).json({
      message: "Something went wrong while login",
    });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "Successfully log out the user",
      });
  } catch (error) {
    serverLogger(error as Error);
    res.status(500).json({
      message: "Something went wrong while logout",
    });
  }
}

async function generateTokens(
  res: Response,
  userId: Types.ObjectId
): Promise<string | { accessToken: string; refreshToken: string }> {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return "Failed to find the user";
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      refreshToken,
      accessToken,
    };
  } catch (error) {
    serverLogger(error as Error);
    return "Something went wrong while generating the tokens";
  }
}

export async function refreshAccessToken(req: Request, res: Response) {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401).json({
      message: "Unauthorized request",
    });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as jwt.JwtPayload;

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      res.status(400).json({
        message: "Invalid refresh token",
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      res.status(400).json({
        message: "Refresh token is expired or used",
      });
    }

    const tokens = await generateTokens(res, user?._id as Types.ObjectId);

    if (typeof tokens === "string") {
      res.status(500).json({
        message: tokens,
      });
      return;
    }

    const { accessToken, refreshToken } = tokens;

    // assign the tokens
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Successfully refresh the tokens",
        refreshToken,
        accessToken,
      });
  } catch (error) {
    serverLogger(error as Error);
    res.status(500).json({
      message: "Something went wrong while refreshing access token",
    });
  }
}

export async function changeCurrentPassword(req: Request, res: Response) {
  try {
    const {
      oldpassword,
      newpassword,
    }: { oldpassword: string; newpassword: string } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordValid = await bcrypt.compare(oldpassword, user?.password!);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await User.findByIdAndUpdate(user?._id, {
      $set: {
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    const error = err as Error;
    serverLogger(error);
    res.status(500).json({
      message:
        "Something went wrong while changing the password" + error.message,
    });
  }
}

export async function updateUserFullName(req: Request, res: Response) {
  try {
    const { fullName }: { fullName: string } = req.body;

    if (!fullName) {
      res.status(401).json({
        message: "Full name is required",
      });
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        fullName: fullName,
      },
    }).select("-password -refreshToken");

    res.status(201).json({
      message: "Full name updated successfully",
      user: user,
    });
  } catch (error) {
    const err = error as Error;
    serverLogger(err);
    res.status(500).json({
      message:
        "Something went wrong while updating the user full name " + err.message,
    });
  }
}

export async function updateUserEmail(req: Request, res: Response) {
  try {
    const { email }: { email: string } = req.body;

    if (!email) {
      res.status(401).json({
        message: "Email is required",
      });
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
      $set: {
        email: email,
      },
    }).select("-password -refreshToken");

    res.status(201).json({
      message: "Email updated successfully",
      user: user,
    });
  } catch (error) {
    const err = error as Error;
    serverLogger(err);
    res.status(500).json({
      message:
        "Something went wrong while updating the user email " + err.message,
    });
  }
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = await User.findById(req.user?._id)
      .select("-password -refrehToken")
      .populate("groups");

    res.status(200).json({
      message: "Fetched user successfully",
      user,
    });
  } catch (error) {
    const err = error as Error;
    serverLogger(err);
    res.status(500).json({
      message: "Something went wrong while fetching the user " + err.message,
    });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const { query } = req.query;

    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("_id username fullName");

    res.status(200).json({
      message: "Users fetched successfully",
      users: users.map((user) => ({
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
      })),
    });
  } catch (error) {
    const err = error as Error;
    serverLogger(err);
    res.status(500).json({
      message:
        "Something went wrong while fetching all the user " + err.message,
    });
  }
}

export async function getRooms(req: Request, res: Response) {
  try {
    const { q } = req.query;

    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(401).json({
        message: "Unauthorized access",
      });
    }

    const groups = user?.groups;

    const users = await User.find({
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    }).select("_id username fullName");

    res.status(200).json({
      message: "Successfully get the groups and users",
      rooms: {
        users: users,
        groups:
          groups && groups?.length > 0
            ? groups
                ?.filter((group) =>
                  group.groupName
                    .toLowerCase()
                    .includes((q as string).toLowerCase())
                )
                .map((group) => ({
                  groupName: group.groupName,
                  groupId: group.groupId,
                }))
            : [],
      },
    });
  } catch (error) {
    const err = error as Error;
    serverLogger(err);
    res.status(500).json({
      message:
        "Something went wrong while fetching all the rooms " + err.message,
    });
  }
}

export async function getActiveChats(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const chatgroups = await Chatgroup.find({
      members: userId,
    })
      .populate("members", "fullName username onlineStatus")
      .populate("admin", "fullName username")
      .select("isGroup groupName groupId members admin");

    const activeChats = chatgroups.map((group) => {
      if (group.isGroup) {
        return {
          type: "group",
          groupId: group.groupId,
          groupName: group.groupName,
          memberCount: group.members.length,
        };
      } else {
        // Private chat: show the other participant
        const otherUser = group.members.find(
          (member: any) => member._id.toString() !== userId.toString()
        );

        return {
          type: "private",
          recieverId: otherUser?.id,
          fullName: otherUser?.fullName,
          username: otherUser?.username,
          onlineStatus: otherUser?.onlineStatus,
        };
      }
    });

    res.status(200).json({
      message: "Fetched active chats",
      activeChats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch active chats",
    });
  }
}

export async function getAccessToken(req: Request, res: Response) {
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

    res.status(200).json({
      message: "Token extracted successfully",
      token,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
