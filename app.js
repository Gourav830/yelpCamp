const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/capmgroung');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema,reviewSchema}=require('./schemas');
const Review =require('./models/review');
const { status } = require('init');
const { error } = require('console');
const catchAsunc = require('./utils/catchAsunc');
const campgroun = require('./routes/campgorunds');
const reviews = require('./routes/review');
const session = require('express-session');
const flash=require('connect-flash')
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp123');
      console.log("CONNECTION OPEN to mongoose");
}  main().catch(err => console.log("Error occuredd"));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


const sessionConfig = {
secret :'thisshouldbeabettersecret',
resave:false,
saveUninitialized:true,
cookie:{
httpOnly:true,
expires:Date.now()+1000*60*60*24*7,
maxAge:1000*60*60*24*7
}
}
app.use(session(sessionConfig))
app.use(flash())

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('ejs',ejsMate);

app.use((req,res,next) =>{
    res.locals.success = req.flash('success');
    res.locals.error =  req.flash('error')
    next()
})

app.use('/campgrounds',campgroun);
app.use('/campgrounds/:id/reviews',reviews);
app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
        next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
const{statusCode = 404} =err;
if(!err.message) err.message = 'oh! No something went wrong!!';
res.status(statusCode).render('error',{err})

})

app.listen('1323',(req,res)=>{
    console.log("Listning On 1323 !#@#");
})
