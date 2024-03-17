const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsunc')
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/capmgroung');
const campgrounds = require('../controllers/campgrounds');

const {isloggedin,validateCampground,isAuthor} = require('../middleware');
router.route('/')
.get(catchAsync(campgrounds.index))
.post(isloggedin,validateCampground,catchAsync(campgrounds.createNew))

router.get('/new',isloggedin,campgrounds.new)

router.route('/:id')
.get(catchAsync(campgrounds.show))
.put(isloggedin,validateCampground,isAuthor,catchAsync(campgrounds.editCamp))
.delete(isloggedin,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isloggedin,isAuthor,catchAsync(campgrounds.renderEdit))

// router.get('/makeCampground', async (req,res) => {
// const camp = new Campground({ title : 'MY BACKYARD',description: 'sasta version'});
// await camp.save();
// res.send(camp);
// })
module.exports = router;