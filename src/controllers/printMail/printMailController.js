const {
  sendPostGridLetter,
  createPostGridWebHook,
  sendPostGridPostCard,
  cancelPostGridMail
} = require('../../services/postgridServices');
const {
  SEND_MAIL_LETTER_TYPE,
  SEND_MAIL_POSTCARD_TYPE
} = require('../../constant/constants');
const {
  savePrintMailData,
  fetchPrintMailById,
  fetchPrintMailByUserId
} = require('../../helper/printMail');

const sendNewPrintMail = async (req, res) => {
  const payload = req.body;
  const mailType = req.params.mailType;
  const userId = req.userId;
  try {
    let response;
    switch (mailType) {
      case SEND_MAIL_LETTER_TYPE:
        response = await sendPostGridLetter(payload, userId);
        break;
      case SEND_MAIL_POSTCARD_TYPE:
        response = await sendPostGridPostCard(payload, userId);
        break;
      default:
        return res.status(500).json({ message: 'Something went wrong.' });
    }
    if (response.data) {
      let printData = {
        userId: userId,
        mailType: mailType,
        mailId: response.data.id,
        mailData: response.data
      }
      const printmail = await savePrintMailData(printData)
      if (printmail) {
        return res.status(200).json({ data: printmail })
      }
    } else {
      return res.status(500).json({ message: `Failed to send ${printType}` });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
};

const cancelMail = async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  try {
    const mailData = await fetchPrintMailById(id)
    if (!mailData) {
      return res.status(400).json({ message: 'Mail data not found' });
    }
    const cancelledMail = await cancelPostGridMail(payload, mailData)
    mailData.mailData = cancelledMail.data
    mailData.save()
    return res.status(200).json({ data: mailData })
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
};

const createWebHook = async (req, res) => {
  const payload = req.body;
  const userId = req.userId;
  try {
    const response = await createPostGridWebHook(payload, userId);
    if (response.data) {
      return res.status(200).json({ data: response.data })
    } else {
      return res.status(500).json({ message: `Failed to send ${printType}` });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
}

const listenWebhookevents = async (req, res) => {
  try {
    console.log(req, '11111111111111111111111111111111111')
    return res.status(200).json({ data: req.body })
  } catch (error) {
    return res.status(500).json({ message: error?.response?.data?.error || error?.response?.data });
  }
}

const fetchUserPrintMail = async (req, res) => {
  const userId = req.userId;
  const mailType = req.query.mailType;
  try {
    const data = await fetchPrintMailByUserId(userId, mailType);
    res.status(200).json({ data: data })
  } catch (error) {
    res.status(error.status || 500).json({ message: error });
  }
}

module.exports = {
  sendNewPrintMail,
  cancelMail,
  createWebHook,
  fetchUserPrintMail,
  listenWebhookevents
};
