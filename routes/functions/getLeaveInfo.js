var mysql = require('mysql');
const con = require('../../db');

module.exports = (req, res) => {
    var lid = req.params.id;
    var str = "select l.*,u.name,u.DName,u.Desgn from leaves l,user u where u.id=l.uid and u.DName=" + mysql.escape(req.user.DName) + " and l.lid=" + lid;
    con.query(str, (err, result) => {
      var sdate = result[0].sdate.getDate() + "-" + (parseInt(result[0].sdate.getMonth()) + 1) + "-" + result[0].sdate.getFullYear();
      result[0].sdate = sdate;
      if(result[0].ltype == "EL"){
        var tdate = result[0].tdate.getDate() + "-" + (parseInt(result[0].tdate.getMonth()) + 1) + "-" + result[0].tdate.getFullYear();
        result[0].tdate = tdate;
      }
      res.render("leaveInfo", {leave: result[0]});
    });
}