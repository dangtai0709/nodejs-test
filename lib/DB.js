const config = require("../config/config")
const sql = require("mssql");
//connectDB
sql.on('error', err => {
	console.log("DB ERROR: "+err);
  })
sql.connect(config.configDB);
module.exports = sql;
