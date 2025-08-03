const { messageService } = require('../services/message.service');

const postMessages = async (req, res) => {
  try {
    const { message, day, time } = req.body;
    console.log("🚀 ~ postMessages ~ message, day, time:", message, day, time)

    if (!message || !day || !time) {
      return res.status(400).json({ status: false, message: 'Missing message, day, or time' });
    }

    const datetimeStr = `${day}T${time}`;
    const scheduleAt = new Date(datetimeStr);
    console.log("🚀 ~ postMessages ~ scheduleAt:", scheduleAt)

    if (isNaN(scheduleAt)) {
        throw new Error('Invalid day or time');
    }

    const savedMessage = await messageService.create({ message, scheduledAt: scheduleAt });

    return res.status(200).json({ status: true, message: 'Message scheduled successfully', data: savedMessage });

  } catch (error) {
    console.error('Error scheduling message:', error.message);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
}

module.exports = {
    postMessages
};