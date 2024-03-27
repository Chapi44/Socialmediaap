const User = require("../model/user");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

require("dotenv").config();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await User.findByIdAndDelete({ _id: id });
    if (!findUser) {
      throw new CustomError.BadRequestError("No such user found");
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const jwt = require('jsonwebtoken');

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const token = req.headers.authorization; // Get the token from the Authorization header

  if (!token) {
    // Handle the case where the token is not provided
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the token and extract the payload (which contains user ID)
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    
    // Extract the user ID from the decoded token
    const userId = decodedToken.userId;

    // Get the user by userId
    const user = await User.findOne({ _id: userId });

    // Check if at least one property is provided in the request body
    if (!(email || name)) {
      throw new CustomError.BadRequestError("Please provide at least one value to update");
    }

    // Update user properties if provided in the request body
    if (email) user.email = email;
    if (name) user.name = name;

    // Save the updated user
    await user.save();

    // Create a new tokenUser with the updated user information
    const tokenUser = createTokenUser(user);

    // Attach cookies to the response
    attachCookiesToResponse({ res, user: tokenUser });

    // Respond with the updated user information
    res.status(200).json({ user: tokenUser });
  } catch (error) {
    // Handle errors such as invalid token or user not found
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(200).json({ msg: "Success! Password Updated." });
};

const showCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
};
