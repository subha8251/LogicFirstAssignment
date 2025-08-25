require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/Property");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Property.deleteMany({});
  await Property.insertMany([
    { title:"PG near XLRI", description:"AC rooms", type:"pg", price:6000, location:{city:"jamshedpur", state:"Jharkhand"} },
    { title:"2BHK Flat", description:"Family only", type:"flat", price:15000, location:{city:"jamshedpur"} },
    { title:"House in Adityapur", description:"Spacious", type:"house", price:22000, location:{city:"jamshedpur"} }
  ]);
  console.log("Seeded");
  process.exit(0);
})();
