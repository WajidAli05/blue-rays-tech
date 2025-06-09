import AnnouncementBar from '../models/announcementBarModel.js';

// Create announcement: add one message per request, append to array
const createAnnouncement = (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      status: false,
      message: "Message field is required and cannot be empty."
    });
  }

  // Find existing announcement doc (assume only one)
  AnnouncementBar.findOne()
    .then(announcement => {
      const newMessage = { text: message.trim(), isActive: true };

      if (!announcement) {
        // Create new doc with messages array
        const newAnnouncement = new AnnouncementBar({ messages: [newMessage] });
        return newAnnouncement.save();
      } else {
        // Append new message to existing messages array
        announcement.messages.push(newMessage);
        return announcement.save();
      }
    })
    .then(saved => {
      return res.status(201).json({
        status: true,
        message: "Message added successfully.",
        data: saved
      });
    })
    .catch(err => {
      console.error('Failed to add announcement message:', err);
      if (!res.headersSent) {
        return res.status(500).json({
          status: false,
          message: "Failed to add announcement message.",
          error: err.message
        });
      }
    });
};

// Get active messages only
const getAnnouncements = (req, res) => {
  AnnouncementBar.findOne()
    .then(announcement => {
      if (!announcement) {
        return res.status(404).json({
          status: false,
          message: "No announcements found."
        });
      }

      // Filter only active messages
      const activeMessages = announcement.messages.filter(msg => msg.isActive);

      return res.status(200).json({
        status: true,
        message: "Active announcements retrieved successfully.",
        data: activeMessages
      });
    })
    .catch(err => {
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve announcements.",
        error: err.message
      });
    });
};

export {
  createAnnouncement,
  getAnnouncements
};