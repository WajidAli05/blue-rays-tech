import FileType from "../models/fileTypeModel.js";

const getFileTypes = async (req, res) => {
  await FileType.find()
    .then((fileTypes) => {
      if (!fileTypes || fileTypes.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No file types found",
        });
      }
      res.status(200).json({
        status: true,
        message: "File types retrieved successfully",
        data: fileTypes,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: "Error retrieving file types",
        error,
      });
    });
};

export { getFileTypes };