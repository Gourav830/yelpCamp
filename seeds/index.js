const mongoose = require('mongoose');
const Campground = require('../models/capmgroung');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers')
async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp123');
      console.log("CONNECTION OPEN to mongoose");
  }


  main().catch(err => console.log("Error occuredd"));

  const sample = (array)=>    array[Math.floor(Math.random() * array.length)];

  const seedDB = async ()=>{
    await Campground.deleteMany({});
   for(let i=0;i<50;i++){
    const price = Math.floor(Math.random()*40);
    const random1000 = Math.floor(Math.random()*1000);
  const newCamp =  new Campground({
    author : '65f55c7241b4d7ea3ad98eec',
    location : `${cities[random1000].city},${cities[random1000].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,
    image:'https://source.unsplash.com/collection/483251',
    description : 'ipsum dolor sit amet consectetur adipisicing elit. Earum perferendis, aspernatur minima tempore facilis, expedita fuga suscipit quam ullam fugit, quidem nemo odit. Impedit ad fugiat cupiditate explicabo illum vitae.'
,price
   })
   await newCamp.save();

}
  }

  seedDB().then(()=>{
    mongoose.connection.close();
    console.log("EXITING....");
  });