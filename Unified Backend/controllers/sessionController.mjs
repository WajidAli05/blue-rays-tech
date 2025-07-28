import SessionDuration from '../models/sessionDurationModel.js';

const trackSessionDuration = (req, res) => {
//express.text() is a pre-requisite for handling text/plain content type
  const parsed = JSON.parse(req.body);
  const { duration } = parsed;
  const userAgent = req.headers['user-agent'];
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  SessionDuration.create({
    durationSeconds: duration,
    userAgent,
    ipAddress: ip,
  })
    .then(() => {
      res.status(200).json({ success: true, message: 'Session duration recorded' });
    })
    .catch((err) => {
      console.error('Error recording session duration:', err);
      res.status(500).json({ success: false, message: 'Error recording session duration' });
    });
};

// GET: Session duration stats (max, min, average)
const getSessionDurationStats = (req, res) => {
  SessionDuration.aggregate([
    {
      $group: {
        _id: null,
        max: { $max: "$durationSeconds" },
        min: { $min: "$durationSeconds" },
        avg: { $avg: "$durationSeconds" },
      }
    }
  ])
    .then(result => {
      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          data: { max: 0, min: 0, avg: 0 },
          message: "No session data available"
        });
      }

      const { max, min, avg } = result[0];
      res.status(200).json({
        success: true,
        data: {
          max,
          min,
          avg: Number(avg.toFixed(2))  // Optional: round avg to 2 decimal places
        }
      });
    })
    .catch(err => {
      console.error("Error fetching session stats:", err);
      res.status(500).json({ success: false, message: "Error fetching session stats" });
    });
};

export { trackSessionDuration, getSessionDurationStats };
