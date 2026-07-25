import mongoose from 'mongoose';
const menuItemSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    taste:{
        type: String,
        enum: ['sweet', 'sour', 'spicy', 'salty', 'bitter'],
        required: true
    },
    is_drink:{
        type: Boolean,
        default: false,
        required: true
    },
    ingredients:{
        type: [String],
        required: true  
},
num_sales:{
    type: Number,
    default: 0
},
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;