const express = require('express')
const router = express.Router()
const User = require('../controllers/userDashboardController')


router.route('/departments').get(User.viewAllParticipantsAuth)
router.route('/departmentName').get(User.viewDepartmentName)
router.route('/topDepartments').get(User.viewTopParticipants)
router.route('/points').get(User.viewPoints)
router.route('/reward').get(User.getReward)
router.route('/history').get(User.getHistory)

module.exports = router