const express = require('express')
const router = express.Router()
const User  = require('../controllers/authController')



router.route('/').get(User.viewAllParticipants)
router.route('/register').post(User.createUser)
router.route('/login').post(User.logInUser)
router.route('/logout').post(User.logOutUser)
router.route('/forgetPassword').post(User.forgetPassword)
router.route('/resetPassword/:token').get(User.getResetPassword).put(User.resetPassword)




module.exports = router