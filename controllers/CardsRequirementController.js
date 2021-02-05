const fs = require('fs')
const express = require("express");
const router = express.Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const middleware = require('../lib/middelware');
const utils = require("../lib/utils");
const userdb = JSON.parse(fs.readFileSync('./config/fake-data/users.json', 'UTF-8'))

router
	.route("/login")
		.post(async (req, res) => {
      console.log(req.body)
      console.log("login endpoint called; request body:");
      if(!req.body.email || !req.body.password) return utils.sendErrorStatus(res, "We've encountered an issue. Please try again.");
      
      const {email, password} = req.body;
      if (isAuthenticated({email, password}) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({status, message})
        return
      }
      const access_token = createToken({email, password})
      console.log("Access Token:" + access_token);
      res.status(200).json({access_token})
    })
  // Check if the user exists in database
    const isAuthenticated=async({email, password})=>{
      return await userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
    }	
  // Verify the token 
  const verifyToken =  (token)=>{
  return  jwt.verify(token, config.secret, (err, decode) => decode !== undefined ?  decode : err)
    }
  // Create a token from a payload 
  const createToken=  (payload) =>{
    return  jwt.sign(payload, config.secret, {expiresIn:config.expiresIn})
  }
module.exports = router;
