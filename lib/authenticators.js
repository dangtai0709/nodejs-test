const utils = require('./utils');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.user = async (req, res, next) => {
  try {
    const token = req.headers['x-auth'] || '';
    if (!token) return utils.sendErrorStatus(res, 'unauthenticated');

    jwt.verify(token, config.secret, function(err, data) {
      if(err) {
        return utils.sendErrorStatus(res, 'Invalid token');
      }
      
      // Users.get(data.info.user_id).then((user)=>{
      //   if(!user) {
      //     return utils.sendErrorStatus(res, 'unauthenticated');
      //   }

      //   if(user.archived === "1" || user.is_deleted === "1") {
      //     return utils.sendErrorStatus(res, 'unauthenticated');
      //   }
      //   req.body.user_id = data.info.user_id;
      //   return next();
      // }).catch((error)=>{
      //   return utils.sendErrorStatus(res, 'unauthenticated');
      // });
      
    });

  } catch (error) {
    return utils.sendErrorStatus(res, error);
  }
  
};

exports.admin = (req, res, next) => {
  if (!req.cookies["__session"]) return res.redirect("/admin/login");
  const token = req.cookies["__session"];
  jwt.verify(token, config.secret, function(err, data) {
    if(err) {
      return utils.sendErrorStatus(res, 'Invalid token');
    }
      Users.get(data.info.user_id).then((user)=>{
        if(!user) {
          return utils.sendErrorStatus(res, 'unauthenticated');
        }
        if(user.archived === "1" || user.is_deleted === "1" || user.user_role !== "1") {
          return utils.sendErrorStatus(res, 'unauthenticated');
        }
        return next();
      }).catch((error)=>{
        return utils.sendErrorStatus(res, 'unauthenticated');
      });
  });
}