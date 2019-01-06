var mysql = require('mysql');
const con = require('../../db');

generateDate = (result) => {
    result.forEach(function(leve){
      var sdate = leve.sdate.getFullYear() + "-" + (parseInt(leve.sdate.getMonth()) + 1) + "-" + leve.sdate.getDate();
      leve.sdate = sdate;
      if(leve.ltype == "EL"){
        var tdate = leve.tdate.getFullYear() + "-" + (parseInt(leve.tdate.getMonth()) + 1) + "-" + leve.tdate.getDate();
        leve.tdate = tdate;
      }
    });
    return result;
}

module.exports = (req, res) => {
  // con.query("select * from leaves where uid=" + req.user.id, (err, result) => {
  //   result.forEach(function(leve){
  //     var sdate = leve.sdate.getFullYear() + "-" + (parseInt(leve.sdate.getMonth()) + 1) + "-" + leve.sdate.getDate();
  //     leve.sdate = sdate;
  //   });
  //   res.render("status", {leaves: result});
  // });
  var str1 = "select * from user u, leaves l where u.id=l.uid and u.id=" + req.user.id + " and status in(select status from leaves where status='declined' or status='granted')";
  var str2 = "select * from user u, leaves l where u.id=l.uid and u.id=" + req.user.id + " and status in(select status from leaves where status='applied' or status='approved')";
  con.query(str1, (err, result1) => {
    GrtDcl = generateDate(result1);
    con.query(str2, (err, result2) => {
      AplAprv = generateDate(result2);
      res.render("status", {GrtDcl: GrtDcl.slice(0, 3), AplAprv: AplAprv});
    });
  });
}