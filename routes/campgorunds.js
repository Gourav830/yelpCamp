const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsunc')
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/capmgroung');

const {isloggedin,validateCampground,isAuthor} = require('../middleware');



router.get('/',catchAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});

}))

router.get('/new',isloggedin,(req,res)=>{

    res.render('campgrounds/new')
})


router.get('/:id',catchAsync(async (req,res)=>{
   const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
        path:'author'
        }
   }).populate('author');

        if(!campground){
            req.flash('error','an error found check the url not found')
           return res.redirect('/campgrounds')
        }
    res.render('campgrounds/show',{campground});
}))
router.get('/:id/edit',isloggedin,isAuthor,catchAsync(async (req,res)=>{

const {id} = req.params.id;
    const campground = await Campground.findById(id)


    // const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','an error found - check the url not found')
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
campground.author = req.user._id;
await campground.save();
req.flash('success','successfully created a new campground')
res.redirect(`/campgrounds/${campground._id}`);

})
)
router.put('/:id',isloggedin,validateCampground,isAuthor,catchAsync(async (req,res,next)=>{

    const { id } = req.params;
    // const campground = await Campground.findById(id)
    // if(!campground.author.equals(req.user._id)){
    //     req.flash('error','you must be signed in to edit')
    //     return res.redirect(`/campgrounds/${id}`);
    // }
  const campground132 =  await Campground.findByIdAndUpdate(id, { ...req.body.campground},{new :true});
  req.flash('success',`successfully edited the ${campground132.title} campground`)

  res.redirect(`/campgrounds/${campground132._id}`);

    // next(e)  show
}));

router.delete('/:id',isloggedin,catchAsync(async (req,res)=>{

    await Campground.findByIdAndDelete(id);
    req.flash('success',`successfully deleted the  campground`)
    res.redirect('/campgrounds');
}))
module.exports = router;