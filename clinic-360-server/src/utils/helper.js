import jwt from "jsonwebtoken";

export const generateAuthToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
  });
};
