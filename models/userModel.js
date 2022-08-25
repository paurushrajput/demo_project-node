const mongoose = require('mongoose')
const User = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    fullName:{
        type: String
    },
    password: {
        type: String
    },
    plainPassword:{
        type:String
    },
    phoneNumber: {
        type: String
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/a2karya80559188/image/upload/v1584446275/admin_nke1cg.jpg"
    },
    Role: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    },
    jwtToken: {
        type: String
    }
}, {
    timestamps: true

})
const UserModel = mongoose.model('users', User);
module.exports = UserModel
