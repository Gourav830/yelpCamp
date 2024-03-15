const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsunc')
const User = require('../models/user');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');


router.get('/register',(req,res)=>{
res.render('user/register')

})
router.post('/register',async (req,res)=>{
// res.send(req.body)
try{
const {email,username,password} = req.body;
const user = new User({email,username})
    const registerUser = await User.register(user,password);
    // console.log(registerUser);
    req.flash('success','Welcome to YELPCAMP')
    res.redirect('/campgrounds')
}catch(e){
req.flash('error',e.message);
res.redirect('/register')
}
})
router.get('/login',(req,res)=>{
    res.render('user/login')
})
const passCheck = (req,res,next)=>{
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true })
    next();
}
router.post('/login',passCheck,(req,res,next)=>{
    req.flash('success','Welcome back to YELPCAMP')
    res.redirect('/campgrounds')
})

module.exports = router;