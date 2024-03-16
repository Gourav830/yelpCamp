const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsunc')
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/capmgroung');
const {campgroundSchema}=require('../schemas');
const {isloggedin} = require('./middleware');

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

router.get('/',catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});

}))

router.get('/new',isloggedin,(req,res)=>{

    res.render('campgrounds/new')
})


router.get('/:id',catchAsync(async (req,res)=>{
   const campground = await Campground.findById(req.params.id).populate('reviews');

        if(!campground){
            req.flash('error','an error found check the url not found')
           return res.redirect('/campgrounds')
        }
    res.render('campgrounds/show',{campground});
}))
router.get('/:id/edit',catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','an error found check the url not found')
       return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
}))


// router.get('/makeCampground', async (req,res) => {
// const camp = new Campground({ title : 'MY BACKYARD',description: 'sasta version'});
// await camp.save();
// res.send(camp);

// })
router.post('/',isloggedin,validateCampground,catchAsync(async (req,res,next)=>{
// if(!req.body.campground)throw new ExpressError('Invalid camp DATA',400)
const campground = new Campground(req.body.campground);
await campground.save();
req.flash('success','successfully created a new campground')
res.redirect(`/campgrounds/${campground._id}`);

})
)
router.put('/:id',isloggedin,validateCampground,catchAsync(async (req,res,next)=>{

    const { id } = req.params;

  const campground132 =  await Campground.findByIdAndUpdate(id, { ...req.body.campground},{new :true});
  req.flash('success',`successfully edited the ${campground132.title} campground`)

  res.redirect(`/campgrounds/${campground132._id}`);

    // next(e)
}));

router.delete('/:id',isloggedin,catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success',`successfully deleted the  campground`)
    res.redirect('/campgrounds');
}))
module.exports = router;