import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers["token"];
  jwt.verify(token, "mennaalyfahmy", function (err, decoded) {
    if (err) {
      res.json({ message: "error", err });
    } else {
      req.userID = decoded.userID;
      next();
    }
  });
};
