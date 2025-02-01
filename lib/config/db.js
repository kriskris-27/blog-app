import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://krishnakumars:Krisatmongodb@cluster0.hcgu9.mongodb.net/blog-app');
    console.log("DB Connected");
}