const express = require("express");
const router = express.Router({ mergeParams: true });
const middleware = require("../lib/middelware");
var MQService = require('../lib/MQService');
router
	.route("/")
		.post(middleware.authenticate.user,async (req, res) => {
      let {payload} = req.body;
      await MQService.publishToQueue(JSON.stringify(payload));
      res.json({msg:"ok",payload});
    })
module.exports = router;
