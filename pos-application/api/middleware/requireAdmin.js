const verifyToken = require("./verifyToken");

const requireAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "superadmin") {
      next();
    } else {
      return res.status(403).json({ message: "Bu işlem için yönetici yetkisi gereklidir." });
    }
  });
};

module.exports = requireAdmin;
