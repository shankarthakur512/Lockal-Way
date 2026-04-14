import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const getAccessTokenFromRequest = (req) => {
  const authorizationHeader = req.header("Authorization") || "";

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length).trim();
  }

  return req.cookies?.accessToken || "";
};

export const requireAuth = async (req, res, next) => {
  try {
    const accessToken = getAccessTokenFromRequest(req);

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The authenticated user could not be found.",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired.",
    });
  }
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required.",
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to perform this action.",
    });
  }

  return next();
};
