const fs = require("fs");
const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const middleware = require("../lib/middelware");
const userdb = require("../config/fake-data/users")
const tokenList = {};
router.route("/auth/login").post(async (req, res) => {
  console.log("login endpoint called; request body:");
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ status: 0, message: "Required email and password" });
  }
  const { email, password } = req.body;
  if (isAuthenticated({ email, password }) === false) {
   return res.status(401).json({ status:0, message:"Incorrect email or password" });
  }
  const accessToken = createToken({ email, password });
  const refreshToken = createreFreshToken({ email, password });
  tokenList[refreshToken] = { email, password };
  return res.status(200).json({ accessToken,refreshToken });
});
// Check if the user exists in database
const isAuthenticated = ({ email, password }) => {
  return (
    userdb.users.findIndex(
      (user) => user.email === email && user.password === password
    ) !== -1
  );
};
// Create a token from a payload
const createToken = (payload) => {
  return jwt.sign(payload, config.secret, { expiresIn: config.expiresIn });
};
// Create a token from a payload
const createreFreshToken = (payload) => {
  return jwt.sign(payload, config.refreshToken, { expiresIn: config.refreshTokenExpiresIn });
};
router.post("/auth/refreshToken",(req, res) => {
  const { refreshToken } = req.body;
  if ((refreshToken) && (refreshToken in tokenList)) {
    try {
     let verifyTokenResult = middleware.authenticate.verifyreFreshToken(refreshToken)
      if (verifyTokenResult instanceof Error) {
        const status = 401;
        const message = "Access token not provided";
        return res.status(status).json({ status, message });
      }
      const user = tokenList[refreshToken];
      delete tokenList[refreshToken];
      const accessToken = createToken(user);
      const newRefreshToken = createreFreshToken(user);
      tokenList[newRefreshToken] = user;
      return res.status(200).json({ accessToken,newRefreshToken });
    } catch (err) {
      console.error(err);
     return res.status(403).json({
        message: 'Invalid refresh token',
      });
    }
  } else {
    return res.status(400).json({
      message: 'Invalid request',
    });
  }
});
module.exports = router;
