var mysql = require('mysql');
const con = require('../../db');

module.exports = (req, res) => {
    con.query("select max(lid) as id from leaves", function(err, result){
        var id = result[0].id + 1;
        var str = "select sdate from leaves where sdate=" + mysql.escape(req.body.sdate) + " and uid=" + req.user.id;
        con.query(str, function(err, result1){
          if(result1.length !== 0){
            res.render("leave", {user: req.user, leaveValue: -1});
          } else {
            var str1 = "";
            str = "insert into leaves(lid, uid, sdate, ltype, status, duration) values(" + id + "," + req.user.id + "," + mysql.escape(req.body.sdate) + "," + mysql.escape(req.body.ltype) + ", 'applied'," + mysql.escape(req.body.duration) + ")";
            var amt = 0;
            if(req.body.duration == "full-day")
              amt = 1;
            else
              amt = 0.5;
            str1 = "update user set cl=" + (req.user.cl - amt) + " where id=" + req.user.id;
            con.query(str, function(err, result2, fields){
              con.query(str1, (err, result3, fields) => {
                res.redirect("/profile/status");
              })
            });
          }
        });
    });
}