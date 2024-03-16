const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsunc')
const User = require('../models/user');
const session = require('express-session')
// const flash = require('connect-flash')
const passport = require('passport');
const { isloggedin } = require('./middleware');


router.get('/register',(req,res)=>{
res.render('user/register')
})
router.post('/register',catchAsync(async (req,res,next)=>{
// res.send(req.body)
try{
const {email,username,password} = req.body;
const user = new User({email,username})
    const registerUser = await User.register(user,password);
    req.login(registerUser,err=>{
if(err){return next(err)}
req.flash('success','Welcome to YELPCAMP')
res.redirect('/campgrounds')
    })
    // console.log(registerUser);

}catch(e){
req.flash('error',e.message);
res.redirect('/register')
}
}))
router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout',isloggedin,(req,res,next)=>{
    req.logout((err)=>{
if(err){return next(err)}
    });
    req.flash('success','logged you out')
    res.redirect('/campgrounds')
})
module.exports = router;