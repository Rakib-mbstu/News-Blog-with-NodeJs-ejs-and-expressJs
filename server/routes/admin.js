const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require('../models/User')

//admin login

const adminLayout = '../views/layouts/admin';

router.get("/admin", async (req, res) => {
    try {
      const locals = {
        title: "Admin",
        description: "NodeJs bloging site",
      };
      res.render('admin/index',{locals, layout:adminLayout})
    } catch (error) {
      console.log(error);
    }
  });

  router.post('/signIn',async(req,res)=>{
    try{
      const {userName,password} = req.body;
      if(req.body.userName==="admin" && req.body.password==='123'){
        res.redirect('./admin');  
      }
      else{
        res.send("wowo wrong!!!");
      }
    }
    catch(error){
      console.log(error);
    }
  })

  router.post('/register',async(req,res)=>{
    try{
      const {userName,password} = req.body;
      if(req.body.userName==="admin" && req.body.password==='123'){
        res.redirect('./admin');  
      }
      else{
        res.send("wowo wrong!!!");
      }
    }
    catch(error){
      console.log(error);
    }
  })

module.exports = router