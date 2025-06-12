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

// Get messages
const getAnnouncements = (req, res) => {
  AnnouncementBar.findOne()
    .then(announcement => {
      if (!announcement) {
        return res.status(404).json({
          status: false,
          message: "No announcements found."
        });
      }

      return res.status(200).json({
        status: true,
        message: "Announcements retrieved successfully.",
        data: announcement
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

// Edit a specific message inside an announcement document
const editAnnouncement = (req, res) => {
  const { announcementId, messageId } = req.params;
  const { message, isActive } = req.body;

  // Validate message input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      status: false,
      message: "Message field is required and cannot be empty."
    });
  }

  AnnouncementBar.findOneAndUpdate(
    { _id: announcementId },
    {
      $set: {
        "messages.$[elem].text": message.trim(),
        "messages.$[elem].isActive": isActive
      }
    },
    {
      arrayFilters: [{ "elem._id": messageId }],
      new: true
    }
  )
    .then(updatedAnnouncement => {
      if (!updatedAnnouncement) {
        return res.status(404).json({
          status: false,
          message: "Announcement or message not found."
        });
      }

      return res.status(200).json({
        status: true,
        message: "Message updated successfully.",
        data: updatedAnnouncement
      });
    })
    .catch(err => {
      console.error("Failed to update message:", err);
      if (!res.headersSent) {
        return res.status(500).json({
          status: false,
          message: "Server error while updating message.",
          error: err.message
        });
      }
    });
};


// Delete a specific message inside an announcement
const deleteAnnouncement = (req, res) => {
  const { announcementId, messageId } = req.params;

  // Validate IDs
  if (!announcementId || !messageId) {
    return res.status(400).json({
      status: false,
      message: "Announcement ID and Message ID are required."
    });
  }

  // Use $pull to remove the message from the array
  AnnouncementBar.findByIdAndUpdate(
    announcementId,
    { $pull: { messages: { _id: messageId } } },
    { new: true }
  )
  .then(updatedDoc => {
    if (!updatedDoc) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found."
      });
    }

    return res.status(200).json({
      status: true,
      message: "Message deleted successfully.",
      data: updatedDoc
    });
  })
  .catch(error => {
    console.error("Delete failed:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        status: false,
        message: "Failed to delete message.",
        error: error.message
      });
    }
  });
};

export {
  createAnnouncement,
  getAnnouncements,
  editAnnouncement,
  deleteAnnouncement
};