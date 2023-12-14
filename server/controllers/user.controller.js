import User from '../models/user.model.js';
import extend from 'lodash/extend.js';
import errorHandler from './error.controller.js';

//VanNguyen added firstName, lastName companyName
//VanNguyen add updatePassword, resetPassword  
//Van Nguyen added successful message for update, and remove function

const create = async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: 'Successfully signed up!',
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      // Duplicate username error
      return res.status(400).json({
        error: 'Username is already taken.',
      });
    } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Duplicate email error
      return res.status(400).json({
        error: 'Email is already taken.',
      });
    } else {
      // Other validation errors
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }
};

const list = async (req, res) => {
  try {
    let users = await User.find().select('username firstName lastName email companyName updated created');
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: 'User not found',
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user',
    });
  }
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({
      message: 'Your Account is Updated Successfully',
      user,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.deleteOne();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json({
      message: 'Your Account has been successfully removed',
      user: deletedUser,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const updatePassword = async (req, res) => {
	try {
	  const { oldPassword, newPassword, newPasswordConfirm } = req.body;
	  const user = req.profile;
  
	  if (!user.authenticate(oldPassword)) {
		return res.status(401).json({
		  error: "Incorrect old password",
		});
	  }
    if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: "New password and confirmation do not match." });
    }
	  user.password = newPassword; 
	  user.updated = Date.now();
  
	  await user.save();
  
	  user.hashed_password = undefined;
	  user.salt = undefined;
  
	  res.json({ message: "Password updated successfully.", user });
    
	} catch (err) {
	  return res.status(400).json({
		error: errorHandler.getErrorMessage(err),
	  });
	}
};
  
const resetPassword = async (req, res) => {
	try {
    console.log(req.body);
	  const { username, email, newPassword, newPasswordConfirm } = req.body;
  
	  // Check if username and email match
	  const user = await User.findOne({ username, email });
	  if (!user) {
		return res.status(401).json({ error: "Username and email do not match." });
	  }
  
	  // Check if newPassword and newPasswordConfirm are equal
	  if (newPassword !== newPasswordConfirm) {
		return res.status(400).json({ error: "New password and confirmation do not match." });
	  }
  
	  // Set the new password and update the user
	  user.password = newPassword;
	  user.updated = Date.now();
	  await user.save();
  
	  // Clear sensitive information before sending the response
	  user.hashed_password = undefined;
	  user.salt = undefined;
  
	  res.json({ message: "Password reset successfully.", user });
	} catch (err) {
	  return res.status(400).json({
		error: errorHandler.getErrorMessage(err),
	  });
	}
  };
  const checkEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.json({ error: 'Email is already taken.' });
      }
  
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const checkUsername = async (req, res) => {
    const { username } = req.params;
  
    try {
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.json({ error: 'Username is already taken.' });
      }
  
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  const pass = async (req, res, next, id) => {
    try {
      next();
    } catch (err) {
      return res.status(400).json({
        error: 'Could not retrieve user',
      });
    }
  };
export default { create, userByID, read, list, remove, update, updatePassword, resetPassword, checkEmail, checkUsername, pass };
