const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');
const {
  fetchUserById,
  updateUserPassword,
} = require('../helper/user')

const fetchUserDetails = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    res.status(200).json({ data: user })
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const changeUserPassword = async (req, res) => {
  const id = req.userId;
  const { currentPassword, newPassword } = req.body
  try {
    const user = await fetchUserById(id, true);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: { error: 'Password is incorrect' } });
    }
    await updateUserPassword(user._id, newPassword)
    res.status(200).json({ message: 'Password Changed Successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.params.userId;
  const { fullName, phoneNumber, address } = req.body
  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    user.fullName = fullName,
      user.phoneNumber = phoneNumber,
      user.address = address
    await user.save();
    res.status(200).json({ message: 'User details updated Successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    user.is_active = false,
    await user.save();
    res.status(200).json({ message: 'User data Deleted Successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

const updateUserProfileImg = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!req.file) {
      return res.status(400).json({ message: { error: '' } });
    }
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    if (user.profile_img) {
      try {
        const oldPicPath = path.join(__dirname, '..', user.profile_img);
        await fs.unlink(oldPicPath);
        console.log('Old profile pic deleted successfully');
      } catch (err) {
        console.error('Failed to delete old profile pic:', err);
      }
    }
    user.profile_img = path.join('uploads', req.file.filename);
    await user.save();
    res.status(200).json({ message: 'Profile Pic updated', data: user })
  } catch (error) {
    res.status(error.status || 500).json({ error });
  }
};

module.exports = {
  fetchUserDetails,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg
};
