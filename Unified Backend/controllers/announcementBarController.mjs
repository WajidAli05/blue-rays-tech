import AnnouncementBar from '../models/announcementBarModel.js';

// Create announcement: add one message per request, append to array
const createAnnouncement = (req, res) => {
  let { message } = req.body;

  // Input validation
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      status: false,
      message: 'Message field is required and cannot be empty.',
    });
  }

  message = message.trim();

  // Find the existing announcement document
  AnnouncementBar.findOne()
    .then((announcementDoc) => {
      if (!announcementDoc) {
        // No document exists — create one with first message
        const newDoc = new AnnouncementBar({
          announcement: [{ message }],
        });

        return newDoc.save().then((saved) => {
          return res.status(201).json({
            status: true,
            message: 'First announcement created successfully.',
            data: saved,
          });
        });
      }

      // Check if message already exists (case-insensitive)
      const exists = announcementDoc.announcement.some(
        (ann) => ann.message.toLowerCase() === message.toLowerCase()
      );

      if (exists) {
        return res.status(400).json({
          status: false,
          message: 'This announcement already exists.',
        });
      }

      // Add new message and save
      announcementDoc.announcement.push({ message });
      return announcementDoc.save().then((updated) => {
        return res.status(201).json({
          status: true,
          message: 'Announcement added successfully.',
          data: updated,
        });
      });
    })
    .catch((err) => {
      console.error('Failed to create announcement:', err);
      return res.status(500).json({
        status: false,
        message: 'Failed to create announcement.',
        error: err.message,
      });
    });
};

// Get messages
const getAnnouncements = (req, res) => {
  AnnouncementBar.findOne()
    .then((announcement) => {
      if (!announcement) {
        return res.status(404).json({
          status: false,
          message: 'No announcements found.',
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

const editAnnouncement = (req, res) => {
  const { messageId } = req.params;
  const { message, isActive } = req.body;

  // Validate
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      status: false,
      message: "Message field is required and cannot be empty.",
    });
  }

  AnnouncementBar.findOneAndUpdate(
    { "announcement._id": messageId },
    {
      $set: {
        "announcement.$.message": message.trim(),
        "announcement.$.isActive": isActive,
      },
    },
    { new: true }
  )
    .then(updatedDoc => {
      if (!updatedDoc) {
        return res.status(404).json({
          status: false,
          message: "Announcement message not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Announcement message updated successfully.",
        data: updatedDoc,
      });
    })
    .catch(error => {
      console.error("Edit failed:", error);
      return res.status(500).json({
        status: false,
        message: "Server error while updating message.",
        error: error.message,
      });
    });
};


const deleteAnnouncement = (req, res) => {
  const { messageId } = req.params;

  if (!messageId) {
    return res.status(400).json({
      status: false,
      message: "Message ID is required.",
    });
  }

  AnnouncementBar.findOneAndUpdate(
    { "announcement._id": messageId },
    { $pull: { announcement: { _id: messageId } } },
    { new: true }
  )
    .then(updatedDoc => {
      if (!updatedDoc) {
        return res.status(404).json({
          status: false,
          message: "Message not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Message deleted successfully.",
        data: updatedDoc,
      });
    })
    .catch(error => {
      console.error("Delete failed:", error);
      return res.status(500).json({
        status: false,
        message: "Failed to delete message.",
        error: error.message,
      });
    });
};


export {
  createAnnouncement,
  getAnnouncements,
  editAnnouncement,
  deleteAnnouncement
};