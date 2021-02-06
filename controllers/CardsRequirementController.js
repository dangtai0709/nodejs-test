const express = require("express");
const router = express.Router({ mergeParams: true });
const sql = require("../lib/DB");
const middleware = require("../lib/middelware");

router
	.route("/")
		.get(middleware.authenticate.user,async (req, res) => {
        let pool= await sql;
        let data = req.query;
        try{
          let result1 = await new pool.Request()
          .input('FromDate', sql.DateTime, data.FromDate)
          .input('ToDate', sql.DateTime, data.ToDate)
          .input('OrganizationCode', sql.VarChar(50), data.OrganizationCode)
          .input('Ma', sql.Int, data.Ma)
          .input('LoaiDichVu', sql.VarChar(50), data.LoaiDichVu)
          .input('PageNumber', sql.Int, data.PageNumber ?data.PageNumber :1)
          .input('RowsPerPage', sql.Int, data.RowsPerPage ? data.RowsPerPage : 10)
          .execute('DanhSachPhieuYeuCau_ECP');
        res.status(200).json({ status: 1, data: result1.recordsets })
        }catch(err){
          err.status = 0;
          res.status(400).json(err)
        }
    })
module.exports = router;
