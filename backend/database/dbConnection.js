import mongoose from "mongoose";

export const dbConnection = ()=> {
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "HEALTHCARE_ONLINE"
    })
    .then(()=>{
        console.log("Connected to database!");
    })
    .catch((err) => {
        console.error(`some error occurred while connecting to database: ${err}`);
    });
}