import AffiliateProgram from "../models/affiliateProgramModel.js";

const getAffiliatePrograms = async (req, res) => {
    await AffiliateProgram.find()
    .then((programs) => {
        if(!programs || programs.length === 0) {
            return res.status(404).json({ status: false, message: "No affiliate programs found" });
        }
        res.status(200).json({
            status: true,
            message: "Affiliate programs retrieved successfully",
            data: programs
        });
    })
    .catch((error) => {
        res.status(500).json({
            status: false,
            message: "Error retrieving affiliate programs",
            error
        });
    })
}

export { getAffiliatePrograms  };