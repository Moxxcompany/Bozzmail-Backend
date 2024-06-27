const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {
  fetchUserById,
  updateUserPassword,
} = require('../helper/user')
const {
  uploadFile,
  deleteFile,
  getObjectSignedUrl
} = require('../utils/s3')

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
    if (!user || !user.is_active) {
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
  const file = req.file
  try {
    if (!file) {
      return res.status(400).json({ message: { error: '' } });
    }
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: { error: 'User Not found. Check again' } });
    }
    if (user.profile_img) {
      const parsedUrl = new URL(user.profile_img);
      const pathname = parsedUrl.pathname;
      const filename = pathname.split('/').pop();
      await deleteFile(`user-profile/${filename}`)
    }
    const imageName = crypto.randomBytes(32).toString('hex')
    await uploadFile(file.buffer, `user-profile/${imageName}`, file.mimetype)
    const url = await getObjectSignedUrl(`user-profile/${imageName}`)
    user.profile_img = url;
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
