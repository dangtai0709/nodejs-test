const fs = require('fs');

const sendErrorStatus = (res, error) => {
	res.json({ status: 0, errors: [{ message: error, error: error, exception: {} }] });
}

exports.sendErrorStatus = function (res, error) {
	sendErrorStatus(res, error)
}

