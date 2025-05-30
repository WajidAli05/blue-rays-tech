import Categories from "../models/categoryModel.js";

const getCategories = async (req, res) => { 
    Categories.find()
    .then((categories) => {
        if(!categories){
            res.status(404).json({
                status: false,
                message: "No categories found"
            })
        }
        res.status(200).json({
            status: true,
            message: "Categories fetched successfully",
            data: categories
        })
    })
    .catch((error) => {
        res.status(500).json({
            status: false,
            message: "Error fetching categories",
            error
        })
    });
}

//get total number of categories
const getTotalCategories = async (req, res) => {
    Categories.countDocuments()
    .then((count) => {
        if(!count){
            res.status(404).json({
                status: false,
                message: "No categories found"
            })
        }
        res.status(200).json({
            status: true,
            message: "Total categories fetched successfully",
            data: count
        })
    })
    .catch((error) => {
        res.status(500).json({
            status: false,
            message: "Error fetching total categories",
            error
        })
    });
}

export { getCategories,
         getTotalCategories,
 };