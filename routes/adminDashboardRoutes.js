const express = require('express')
const router = express.Router()
const Admin = require('../controllers/adminDashboardController')


router.route('/points/:id').put(Admin.addPoints).get(Admin.pointsNotification)
router.route('/oneParticipant/:id').get(Admin.viewOneParticipant).delete(Admin.removeOneParticipant)
router.route('/reward/:id').put(Admin.updateReward).get(Admin.rewardNotification)
router.route('/id').post(Admin.getUserId)
router.route('/participants').get(Admin.viewAllParticipants)
router.route('/logs').get(Admin.viewLogs)


module.exports = router