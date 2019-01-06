var mysql = require('mysql');
const con = require('../../db');

module.exports = (req, res) => {
    var str = "select l.*,u.name,u.DName from leaves l,user u where u.id=l.uid and u.DName=" + mysql.escape(req.user.DName) + " order by lid desc";
    con.query(str, (err, result) => {
      result.forEach(function(leve){
        var sdate = leve.sdate.getDate() + "/" + (parseInt(leve.sdate.getMonth()) + 1) + "/" + leve.sdate.getFullYear();
        leve.sdate = sdate;
        if(leve.ltype == "EL"){
          var tdate = leve.tdate.getDate() + "/" + (parseInt(leve.tdate.getMonth()) + 1) + "/" + leve.tdate.getFullYear();
          leve.tdate = tdate;
        }
      });
      res.render("hod", {leaves: result});
    });
}