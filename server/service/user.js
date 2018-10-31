// ---> 处理登录和后台相关的操作
const mongoose = require('mongoose')
const User = mongoose.model('User')

const  checkPassword = async (email, password) => {
    let match = false
    const user = await User.findOne({ email })

    if (user) {
        match = await user.comparePassword(password, user.password)
    }

    return {
        match,
        user
    }
}

exports.checkPassword = checkPassword