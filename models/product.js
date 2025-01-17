const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'product name must be provided'],
    },
    price:{
        type:Number,
        required:[true, 'a price must be provided'],
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:4.5,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    },
    company:{
        type:String,
        enum:{
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported'
        },
        //enum:['ikea', 'liddy', 'caressa', 'marcos'], This way you can limit the number of company entries
    },
})

module.exports = mongoose.model('Products', ProductSchema);