import Categories from "../models/categorySchema.js";

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

export { getCategories };