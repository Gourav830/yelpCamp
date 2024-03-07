const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/capmgroung');
const methodOverride = require('method-override');
const cathcAsync = require('./utils/catchAsunc')
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema}=require('./schemas');


const { status } = require('init');
const { error } = require('console');
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp123');
      console.log("CONNECTION OPEN to mongoose");

}
  main().catch(err => console.log("Error occuredd"));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.engine('ejs',ejsMate);

const validateCampground= (req,res,next)=>{


        const {error} =campgroundSchema.validate(req.body)
        if(error){
            const msg =error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
        }else{
            next();
        }
        // console.log(error)

}


app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/campgrounds',cathcAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});

}))

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})


app.get('/campgrounds/:id',cathcAsync(async (req,res)=>{
   const campground = await Campground.findById(req.params.id);

    res.render('campgrounds/show',{campground});
}))
app.get('/campgrounds/:id/edit',cathcAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))


// app.get('/makeCampground', async (req,res) => {
// const camp = new Campground({ title : 'MY BACKYARD',description: 'sasta version'});
// await camp.save();
// res.send(camp);

// })
app.post('/campgrounds',validateCampground,cathcAsync(async (req,res,next)=>{
// if(!req.body.campground)throw new ExpressError('Invalid camp DATA',400)
const campground = new Campground(req.body.campground);
await campground.save();
res.redirect(`/campgrounds/${campground._id}`);

})
)
app.put('/campgrounds/:id',validateCampground,cathcAsync(async (req,res,next)=>{

    const { id } = req.params;

  const campground132 =  await Campground.findByIdAndUpdate(id, { ...req.body.campground},{new :true});
  res.redirect(`/campgrounds/${campground132._id}`);

    next(e)
}));

app.delete('/campgrounds/:id',cathcAsync(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*',(req,res,next)=>{
        next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
// console.log(err);
const{statusCode = 404} =err;
if(!err.message) err.message = 'oh! No something went wrong!!';
res.status(statusCode).render('error',{err})
// next();

})

app.listen('1323',(req,res)=>{
    console.log("Listning On 1323 !#@#");
})
