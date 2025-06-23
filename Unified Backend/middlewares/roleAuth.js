import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';

/**
 * Middleware to validate user/admin role and optionally restrict to allowed roles.
 * @param {Array} allowedRoles - Optional array of roles allowed to proceed.
 */
const validateRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const email = req.user?.email;

    if (!email) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: No email found in token!",
        data: null
      });
    }

    Admin.findOne({ email })
      .then(admin => {
        if (admin) {
          if (!admin.isActive) {
            return res.status(403).json({
              status: false,
              message: 'Admin is inactive',
              data: null
            });
          }

          if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
            return res.status(403).json({
              status: false,
              message: 'Access denied: Role not authorized',
              data: null
            });
          }

          req.user = admin;
          req.user.role = admin.role;
          return next(); // ✅ Early return, stops execution here
        }

        // Only proceed to User check if not found in Admins
        return User.findOne({ email }).then(user => {
          if (!user) {
            return res.status(404).json({
              status: false,
              message: 'User not found',
              data: null
            });
          }

          req.user = user;
          req.user.role = user.role || 'customer';

          if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
              status: false,
              message: 'Access denied: Role not authorized',
              data: null
            });
          }

          return next();
        });
      })
      .catch(err => {
        return res.status(500).json({
          status: false,
          message: 'Internal server error: ' + err.message,
          data: null
        });
      });
  };
};

export { validateRole };