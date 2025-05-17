import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    res.json({ message: "user already in use" });
  } else {
    bcrypt.hash(password, 8, async function (err, hash) {
      await userModel.insertMany({ name, email, password: hash });
    });
    res.json({ message: "Account created successfully!" });
  }
};
export const signin = async (req, res) => {
  const { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      let token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          role: user.role,
          userId: user._id,
        },
        "mennaalyfahmy"
      );
      res.json({ message: "Welcome to Post App", token });
    } else {
      res.json({ message: "incorrect password" });
    }
  } else {
    res.json({ message: "user not found" });
  }
};
