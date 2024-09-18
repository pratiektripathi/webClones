import { mongoose } from "mongoose";

const todoschema = new mongoose.Schema({
    message:{
        type: String,
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
    
},{timestamps:true})

export const todo = mongoose.model('todo',todoschema);

