import Admin from '../models/adminModel.js'

const validateAdmin = (req, res, next)=>{
    //user is added to req object in token handler
    const email= req.user.email;

    Admin.findOne({email})
    .then((admin)=>{
    if(!admin || admin.isActive === false){
        return res.status(404).json({
            status: false,
            message: 'Admin not found',
            data: null
        })
    }
    else if(!["admin", "superadmin"].includes(admin.role)){
            return res.status(404).json({
            status: false,
            message: 'You are not authorized!',
            data: null
    })
    }
    req.user= admin;
    next();
    })
    .catch((err)=>{
        res.status(500).json({
            status: false,
            message: 'Internal server error:' + err.message,
            data: null
        })
    })

}

export { validateAdmin }