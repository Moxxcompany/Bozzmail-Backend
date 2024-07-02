const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {
  fetchUserById,
  updateUserPassword,
} = require('../../helper/user')
const {
  uploadFile,
  deleteFile,
  getObjectSignedUrl
} = require('../../utils/s3')

const getUserById = async (req, res) => {
  const id = req.params.userId;
  try {
    const user = await fetchUserById(id);
    if (!user) {
      return res.status(400).json({ message: 'User not found. Check again' });
    }
    res.status(200).json({ data: user })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

const changeUserPassword = async (req, res) => {
  const id = req.userId;
  const { currentPassword, newPassword } = req.body
  try {
    const user = await fetchUserById(id, true);
    if (!user || !user.is_active) {
      return res.status(400).json({ message: 'User not found. Check again' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'Your signin method is different.' });
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    await updateUserPassword(user._id, newPassword)
    await sendMail({
      to: user.email,
      subject: 'Account Password reset successfuly',
      text: `You have successfully changed your password`,
      heading: 'Password successfully changed',
      content: `<p>Your password for your account has been changed successfully.</p>`
    })
    res.status(200).json({ message: 'Password Changed Successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.userId;
  const { fullName, phoneNumber, address } = req.body
  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found. Check again' });
    }
    user.fullName = fullName ? fullName : user.fullName;
    user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber
    user.address = address ? address : user.address
    await user.save();
    if (user.telegramId) {
      await sendTelegramSms({
        id: user.telegramId,
        message: `Your details for your account has been updated successfully`
      })
    } else {
      await sendMail({
        to: user.email,
        subject: 'Updated Account Details',
        text: `You have successfully updated your account details`,
        heading: 'Account detail successfully updated',
        content: `<p>Your details for your account has been updated successfully.</p>`
      })
    }
    res.status(200).json({ message: 'User details updated Successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found. Check again' });
    }
    user.is_active = false
    await user.save();
    if (user.telegramId) {
      await sendTelegramSms({
        id: user.telegramId,
        message: `Your account has been deactivated successfully.`
      })
    } else {
      await sendMail({
        to: user.email,
        subject: 'Bozzmail account deactivation',
        text: `Your bozzmail account has been deactivated successfully.`,
        heading: 'Boozmail Account deactivated',
        content: `<p>Your bozzmail account has been deactivated.</p>`
      })
    }
    res.status(200).json({ message: 'User data Deleted Successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

const updateUserProfileImg = async (req, res) => {
  const userId = req.userId;
  const file = req.file
  try {
    if (!file || !file.mimetype.startsWith('image')) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found. Check again' });
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
    if (user.telegramId) {
      await sendTelegramSms({
        id: user.telegramId,
        message: `Your profile picture for your account has been updated successfully`
      })
    } else {
      await sendMail({
        to: user.email,
        subject: 'Updated Account Details',
        text: `You have successfully updated your account profile picture`,
        heading: 'Account profile picture successfully updated',
        content: `<p>Your profile picture for your account has been updated successfully.</p>`
      })
    }
    res.status(200).json({ message: 'Profile Pic updated', data: user })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
};

module.exports = {
  getUserById,
  changeUserPassword,
  updateUserDetails,
  deleteUser,
  updateUserProfileImg
};
