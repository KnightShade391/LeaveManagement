create database LeaveMan;
use LeaveMan;

-- create table Department(
--   DName varchar(10) primary key,
--   HOD varchar(30)
-- );

create table User(
  id int primary key,
  email varchar(30) collate latin1_general_cs,
  password varchar(20) collate latin1_general_cs,
  name varchar(35) collate latin1_general_cs,
  DName varchar(10),
  Desgn varchar(30),
  cl int,
  el int
);

create table Leaves(
  lid int primary key,
  uid int,
  sdate date,
  ltype varchar(5),
  status varchar(20) default "applied",
  tdate date,
  duration varchar(20),
  foreign key(uid) references User(id) on delete cascade on update cascade
);
