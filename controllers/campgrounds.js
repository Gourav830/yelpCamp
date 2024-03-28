
const Campground = require('../models/capmgroung');
module.exports.index =async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}
module.exports.new =(req,res)=>{
   res.render('campgrounds/new')
}
module.exports.show =async (req,res)=>{
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
 }
//  module.exports.renderEdit =async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findById(id)
//     if (!campground) {
//         req.flash('error', 'Cannot find that campground!');
//         return res.redirect('/campgrounds');
//     }
//     res.render('campgrounds/edit', { campground });
// }

module.exports.renderEdit = async (req,res)=>{
    const {id} = req.params;
        const campground = await Campground.findById(id)
        // const campground = await Campground.findById(req.params.id);
        if(!campground){
            req.flash('error','an error found - check the url not found')
           return res.redirect('/campgrounds')
        }
     res.render('campgrounds/edit',{campground});
    }
module.exports.createNew =async (req,res,next)=>{
        // if(!req.body.campground)throw new ExpressError('Invalid camp DATA',400)
    console.log(req.files)
            const campground = new Campground(req.body.campground);

            campground.image = req.files.map(f => ({
                url: f.path,
                filename: f.filename
            }));
        campground.author = req.user._id;
        await campground.save();
        console.log(campground)
        req.flash('success','successfully created a new campground')
        res.redirect(`/campgrounds/${campground._id}`);
    }

module.exports.editCamp =async (req,res,next)=>{

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
    }
    module.exports.deleteCampground = async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted campground')
        res.redirect('/campgrounds');
    }