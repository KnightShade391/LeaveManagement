const router = require('express').Router();
var mysql = require('mysql');
const con = require('../db');
const applyCL = require("./functions/applyCL");
const applyEL = require("./functions/applyEL");
const getStatus = require("./functions/getStatus");
const getRequests = require("./functions/getRequests");
const getLeaveInfo = require("./functions/getLeaveInfo");

var d = new Date();
var curDate = d.getFullYear() + "-";
if(!(d.getMonth() + 1 > 9)){
  curDate += "0" + (d.getMonth() + 1) + "-" + d.getDate();
}

const authCheck = (req,res,next) => {
  if(!req.user){
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req,res) => {
  res.render("profile", {user: req.user});
});

router.get("/leave", authCheck, function(req,res){
  res.render("leave", {user: req.user, leaveValue: 0});
});


//for applying cl
router.post("/apply/cl", authCheck, applyCL);

//for applying el
router.post("/apply/el", authCheck, applyEL);

router.get("/status", authCheck, getStatus);

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


router.get("/requests", authCheck, getRequests);

router.get("/leaveDetails/:id", authCheck, getLeaveInfo);

router.get("/accept/:id", (req,res) => {
  const lid = req.params.id;
  var str = "update leaves set status = 'approved' where lid = " + lid;
  con.query(str, (err, result, fields) => {
    res.redirect("/profile/requests");
  });
});

router.get("/decline/:id", (req,res) => {
  const lid = req.params.id;
  var str = "update leaves set status = 'declined' where lid = " + lid;
  con.query(str, (err, result, fields) => {
    str = "select * from leaves where lid=" + lid;
    con.query(str, (err, result1) => {
      if(result1[0].ltype == "CL"){
        var amt = 0;
        if(result1[0].duration == "full-day")
          amt = 1;
        else
          amt = 0.5;
        str = "update user set cl=cl+" + amt + " where id=" + result1[0].uid;
      } else {
        var sdate = result1[0].sdate.getDate() + "-" + (parseInt(result1[0].sdate.getMonth()) + 1) + "-" + result1[0].sdate.getFullYear();
        result1[0].sdate = sdate;
        var tdate = result1[0].tdate.getDate() + "-" + (parseInt(result1[0].tdate.getMonth()) + 1) + "-" + result1[0].tdate.getFullYear();
        result1[0].tdate = tdate;
        console.log(result1[0]);
        d1 = result1[0].sdate.split("-");
        d2 = result1[0].tdate.split("-");
        diff = Number(d2[2]) - Number(d1[2]) + 1;
        str = "update user set el=el+" + diff + " where id=" + result1[0].uid;
      }
      con.query(str, (err, result2, fields) => {
        res.redirect("/profile/requests");
      });
    });
  });
});



module.exports = router;
