import User from "../models/userModel.js";
import fs from 'fs';
import { OAuth2Client } from "google-auth-library";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config(); 

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base directory for user uploads
const userUploadDir = path.join(__dirname, '../uploads/users');

//create instance of Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signupUser = (req, res) => {
  const { name, email, password, phone, job, country } = req.body;
  const file = req.file;

  // Validate required fields
  if (!name || !email || !password || !phone || !country) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  // Optional: validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Please provide a valid email",
    });
  }

  // Handle image validation
  let image = "";
  if (file) {
    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: false,
        message: "Only image files are allowed",
      });
    }
    image = `/uploads/users/${file.filename}`; 
  }


  // Check for existing user
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        if (existingUser.googleId) {
          return res.status(400).json({
            status: false,
            message: "Email is registered with Google. Please sign in with Google.",
          });
        }

        return res.status(400).json({
          status: false,
          message: "A user with this email already exists",
        });
      }

      return bcrypt.hash(password, 10);
    })
    .then(hashedPassword => {
      if (!hashedPassword) return;

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        job,
        country,
        image,
        role: "customer",
      });

      return newUser.save();
    })
    .then(savedUser => {
      if (savedUser) {
        res.status(201).json({
          status: true,
          message: "User signed up successfully",
          data: {
            userId: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            phone: savedUser.phone,
            image: savedUser.image,
            country: savedUser.country,
            job: savedUser.job,
            role: savedUser.role,
          },
        });
      }
    })
    .catch(err => {
      console.error("Signup error:", err);
      if (!res.headersSent) {
        res.status(500).json({
          status: false,
          message: "Internal server error",
          error: err.message,
        });
      }
    });
};

//add a new user
// const signupUser = (req, res) => {
//   const { name, email, password, phone, country, job } = req.body;
//   const file = req.file;

//   // Validate required fields
//   if (!name || !email || !password) {
//     return res.status(400).json({
//       status: false,
//       message: "Please provide name, email, and password!",
//     });
//   }

//   let image = '';
//   if (file) {
//     if (!file.mimetype.startsWith('image/')) {
//       return res.status(400).json({
//         status: false,
//         message: "Only image files are allowed",
//       });
//     }
//     image = `/uploads/users/${file.filename}`;
//   }

//   // Check for existing user by email
//   User.findOne({ email })
//     .then(existingUser => {
//       if (existingUser) {
//         return res.status(400).json({
//           status: false,
//           message: "A user with this email already exists",
//         });
//       }

//       //check if user is signing up with Google
//       if (existingUser && existingUser.googleId) {
//         return res.status(400).json({
//           status: false,
//           message: "Email is registered with Google. Please sign in with Google.",
//         });
//       }

//       // Validate email format
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({
//           status: false,
//           message: "Please provide a valid email",
//         });
//       }

//       //hash password before saving
//       const hashedPassword = bcrypt.hashSync(password, 10);

//       // Create new user
//       const newUser = new User({
//         name,
//         email,
//         password: hashedPassword,
//         phone,
//         image,
//         country,
//         job,
//         role: "customer"
//       });

//       newUser.save()
//         .then(() => {
//           res.status(201).json({
//             status: true,
//             message: "User added successfully",
//           });
//         })
//         .catch(error => {
//           res.status(500).json({
//             status: false,
//             message: "Error saving user to database",
//             error,
//           });
//         });
//     })
//     .catch(error => {
//       res.status(500).json({
//         status: false,
//         message: "Error checking existing user",
//         error,
//       });
//     });
// };

//login user



//manual login user
const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide email and password",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Please provide a valid email",
    });
  }

  // Find user
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // If user signed up using Google, block manual login
      if (user.googleId) {
        return res.status(400).json({
          status: false,
          message: "This account is registered with Google. Please log in using Google.",
        });
      }

      // Compare password
      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({
              status: false,
              message: "Invalid password",
            });
          }

          // Generate token
          const token = jwt.sign(
            {
              id: user._id,
              role: user.role,
              email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );

          // Return cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000, // 1 hour
          });

          res.status(200).json({
            status: true,
            message: "User logged in successfully",
            data: {
              userId: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              image: user.image,
              country: user.country,
              job: user.job,
              role: user.role,
            },
          });
        });
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json({
        status: false,
        message: "Internal server error",
        error: err.message,
      });
    });
};

//get all users
const getUsers = (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json({
        status: true,
        message: "Users retrieved successfully",
        data: users,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error retrieving users",
        error,
      });
    });
}

//udpate user
const updateUser = (req , res) => {
  const userId = req.params.userId;
  const { name, email, phone } = req.body;

  // Validate userId param
  !userId && res.status(400).json({
    status: false,
    message: "Please provide userId",
  });

  // Validate required fields
  !name || !email || !phone && res.status(400).json({
    status: false,
    message: "Please provide name, email, and phone",
  });

  //find user by id
  User.findByIdAndUpdate(userId, {
    name,
    email,
    phone,
  })
  .then((updatedUser) => {
    !updatedUser && res.status(404).json({
      status: false,
      message: "User not found",
    });
  })
  .then(() => {
    res.status(200).json({
      status: true,
      message: "User updated successfully",
    });
  })
  .catch((error) => {
    res.status(500).json({
      status: false,
      message: "Error updating user",
      error,
    });
  });
}

//get user by id
const getUser = (req, res) => {
  const userId = req.params.userId;

  // Validate userId param
  !userId && res.status(400).json({
    status: false,
    message: "Please provide userId",
  });

  //find user by id
  User.findById(userId)
    .then(user => {
      !user && res.status(404).json({
        status: false,
        message: "User not found",
      });
      res.status(200).json({
        status: true,
        message: "User retrieved successfully",
        data: user,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error retrieving user",
        error,
      });
    });
}

//delete user by id
const deleteUser = (req, res) => {
  const { userId } = req.params || req.body;
  if (!userId) {
    return res.status(400).json({
      status: false,
      message: "Please provide userId",
    });
  }

  User.findByIdAndDelete(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      // Successfully deleted
      return res.status(200).json({
        status: true,
        message: "User deleted successfully",
        user,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: 'Error deleting user!',
        error,
      });
    });
};

//get total number of users
const getTotalUsers = (req, res) => {
  User.countDocuments()
    .then(count => {
      res.status(200).json({
        status: true,
        message: "Total users retrieved successfully",
        data: count,
      });
    })
    .catch(error => {
      res.status(500).json({
        status: false,
        message: "Error retrieving total users",
        error,
      });
    });
}

//signup with google
// const signupWithGoogle = (req, res) => {
//   const { googleToken } = req.body;
//   if (!googleToken) {
//     return res.status(400).json({
//       status: false,
//       message: "Could not be signed up with Google.",
//     });
//   }

//   //decode the token
//   const decoded= jwt.decode(googleToken, {complete: true})
//   if(!decoded){
//     res.status(400).json({
//       status: false,
//       message: "Invalid Google token",
//     });
//   }

//   //check if user already exists
//   User.findOne({ email: decoded.payload.email })
//     .then(existingUser => {
//       if (existingUser && existingUser.googleId) {
//         return res.status(200).json({
//           status: true,
//           message: "Already registered. Signing in instead.",
//         });
//       }

//       return new User({
//           name: `${decoded.payload.given_name} ${decoded.payload.family_name}`,
//           email: decoded.payload.email,
//           password,
//           phone,
//           image: decoded.payload.picture,
//           country,
//           job,
//           role: "customer"
//         })
//     })
//   .then((newUser)=>{
//     res.status(200).json({
//     status: true,
//     message: "Google token decoded successfully",
//     data: newUser,
//   });
//   })
//   .catch((error)=>{
//     res.status(500).json({
//       status: false,
//       message: "Error decoding Google token",
//       error,
//     });
//   })
// };
const signupWithGoogle = (req, res) => {
  const { googleToken } = req.body;

  if (!googleToken) {
    return res.status(400).json({ status: false, message: "Google token is missing." });
  }

  let decoded;
  try {
    decoded = jwt.decode(googleToken);
    if (!decoded) throw new Error("Invalid Google token");
  } catch (err) {
    return res.status(400).json({ status: false, message: "Invalid Google token." });
  }

  const { email, given_name, family_name, picture, sub } = decoded;

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        if (!existingUser.googleId) {
          return res.status(400).json({
            status: false,
            message: "Email is already registered manually. Please login with email and password.",
          });
        }

        return res.status(200).json({
          status: true,
          message: "Signed in successfully",
          user: existingUser,
        });
      }

      const newUser = new User({
        name: `${given_name} ${family_name}`,
        email,
        image: picture,
        googleId: sub,
        role: "customer",
      });

      return newUser.save().then(savedUser => {
        res.status(201).json({
          status: true,
          message: "Signed up successfully with Google",
          user: savedUser,
        });
      });
    })
    .catch(err => {
      console.error("Google signup error:", err);
      if (!res.headersSent) {
        res.status(500).json({ status: false, message: "Internal server error", error: err.message });
      }
    });
};

const validateUser = (req, res) => {
  res.status(200).json({
    status: true,
    message: "Token is valid",
    user: req.user, // optional: return basic user info
  });
}

export { signupUser,
         loginUser,
         getUsers,
         updateUser,
         getUser,
         deleteUser,
         getTotalUsers,
         signupWithGoogle,
         validateUser
 };