const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Verify the token
const verifyToken = (token) => {
  return jwt.verify(token, config.secret, (err, decode) =>
    decode !== undefined ? decode : err
  );
};
// Verify the token
exports.verifyreFreshToken = (token) => {
  return jwt.verify(token, config.refreshToken, (err, decode) =>
    decode !== undefined ? decode : err
  );
};
exports.user = async (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    const status = 401;
    const message = "Error in authorization format";
    return res.status(status).json({ status, message });
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(" ")[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401;
      const message = "Access token not provided";
      return res.status(status).json({ status, message });
    }
    next();
  } catch (err) {
    const status = 401;
    const message = "Error access_token is revoked";
    res.status(status).json({ status, message });
  }
};
