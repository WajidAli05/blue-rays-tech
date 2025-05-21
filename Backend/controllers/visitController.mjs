import Visit from "../models/visitModel.js";

//increase visit count
// Increase visit count
const increaseVisitCount = (req, res) => {
  Visit.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true })
    .then((visit) => {
      res.status(200).json({
        success: true,
        message: "Visit count increased",
        data: visit.count, // Only return the count number
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Error increasing visit count",
        error: error.message,
      });
    });
};


//get total visits so far
const getVisitCount = (req, res) => {
  Visit.findOne({})
    .then((visit) => {
      const count = visit?.count || 0;
      res.status(200).json({
        success: true,
        data: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Error fetching visit count",
        error: error.message,
      });
    });
};

export { 
         getVisitCount,
         increaseVisitCount
 }