const User = require('../models/userModel')
const Log = require('../models/logModel')
const asyncWrapper = require('../middlewares/asyncWrapper')


const viewAllParticipantsAuth = asyncWrapper( async (req, res) => {

    //const participants = await User.find({}).
    const participants = await User.find({ role: { $ne: 'admin' } }).select('departmentName binPoints -_id')
    res.status(200).json(participants)
  
})


const viewTopParticipants = asyncWrapper( async (req, res) => {

    const participants = await User.find({ role: { $ne: 'admin' } }).select('departmentName binPoints -_id').sort('-binPoints').limit(5)
    res.status(200).json(participants)
  
})


const viewPoints = asyncWrapper( async (req, res) => {

    const userId = req.user.userId
    const binPoints = await User.findOne({_id: userId}).select('binPoints -_id')
    const binPointsValue = binPoints.binPoints
    res.status(200).json(binPointsValue)
})


const getReward = asyncWrapper(async (req, res) => {

    const userId = req.user.userId
    const reward = await User.findOne({_id: userId}).select('reward -_id')
    res.status(200).json(reward)
})

const viewDepartmentName = asyncWrapper(async (req, res) => {

    const userId = req.user.userId
    const departmentName = await User.findOne({_id: userId}).select('departmentName -_id')
    res.status(200).json(departmentName)
})


const getHistory = asyncWrapper(async (req, res) => {
    const userId = req.user.userId
    const logs = await Log.find({userId: userId}).select('action -_id').sort('-timestamp');
    res.status(200).json(logs);

})



module.exports = {
    viewAllParticipantsAuth,
    viewTopParticipants,
    viewPoints,
    getReward,
    getHistory,
    viewDepartmentName,

}