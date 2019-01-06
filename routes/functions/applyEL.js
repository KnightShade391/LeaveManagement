var mysql = require('mysql');
const con = require('../../db');

module.exports = (req, res) => {
    con.query("select max(lid) as id from leaves", function(err, result){
        var id = result[0].id + 1;
        str = "insert into leaves(lid, uid, sdate, ltype, status, tdate) values(" + id + "," + req.user.id + "," + mysql.escape(req.body.fdate) + "," + mysql.escape(req.body.ltype) + ", 'applied'," + mysql.escape(req.body.tdate) + ")";
        d1 = req.body.fdate.split("-");
        d2 = req.body.tdate.split("-");
        diff = Number(d2[2]) - Number(d1[2]) + 1;
        str1 = "update user set el=" + (req.user.el - diff) + " where id=" + req.user.id;
        con.query(str, function(err, result2, fields){
          con.query(str1, (err, result3, fields) => {
            res.redirect("/profile/status");
          })
        });
    });
}