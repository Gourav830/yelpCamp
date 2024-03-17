const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsunc')
const Review =require('../models/review')

const Campground = require('../models/capmgroung');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema}=require('../schemas');
const {validateReview,isloggedin} =require('../middleware')



router.post('/',isloggedin,validateReview,catchAsync(async (req,res)=>{
    const {id} = req.params

        const newReview = await Campground.findById(id)
        const review = new Review(req.body.review);
        review.author =req.user._id;
        newReview.reviews.push(review);
        await review.save();
        await newReview.save();
        req.flash('success',`successfully posted the review `)
        res.redirect(`/campgrounds/${newReview._id}`);

    }))
    router.delete('/:reviewId',isloggedin,catchAsync(async (req,res)=>{
        const {id,reviewId} = req.params;
        await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

        await Review.findByIdAndDelete(reviewId);
        req.flash('success',`successfully deleted the review `)
        res.redirect(`/campgrounds/${id}`)

    }))
    module.exports = router;
