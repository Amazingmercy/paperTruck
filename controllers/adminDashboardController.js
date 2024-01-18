const User = require('../models/userModel')
const Log = require('../models/logModel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const nodemailer = require('nodemailer')

const senderEmail = process.env.SENDER_EMAIL;  // Email address for sending emails
const EmailPass = process.env.SENDER_EMAIL_PASS;  // Password for the email address


const viewAllParticipants = asyncWrapper(async (req, res) => {
    const participants = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json(participants)


})

const getUserId = asyncWrapper(async (req, res) => {
    const {departmentName}  = req.body

    const user = await User.findOne({departmentName})
    if(!user){
        return res.status(404).json({message: `User not found`})
    }
    res.status(200).json(user._id)
    //res.status(200).json(departmentName)


})


const viewOneParticipant = asyncWrapper(async (req, res) => {
  const userId  = req.params.id

  const user = await User.findOne({_id: userId})
  if(!user){
      return res.status(404).json({message: `User not found`})
  }
  res.status(200).json(user)


})

const getDepartmentNames = asyncWrapper(async (req, res) => {

  const departmentName = await User.find({}).select('departmentName -_id')
  if(!departmentName){
      return res.status(404).json({message: `Department Name not found`})
  }
  res.status(200).json(departmentName)



})

const removeOneParticipant = asyncWrapper(async (req, res) => {
    const userId  = req.params.id
    const user = await User.findOneAndDelete({_id: userId})
    if(!user){
        return res.status(404).json({message: `User with id ${userId} not found`})
    }
    res.status(200).json({message: 'User deleted successfully'})
    
})


const updateReward = asyncWrapper(async (req, res) => {
    const  userId = req.params.id
    const {reward}  = req.body

    const user = await User.findOne({_id: userId})
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


      await User.findOneAndUpdate(
          {_id: userId}, 
          { $set: { reward: reward } },
          { new:true, runValidators: true}
          )

        res.status(200).json({message: `Reward Updated!`})

});


const addPoints = asyncWrapper(async (req, res) => {
    const { points} = req.body
    const pointsValue = points
    const userId = req.params.id
    const user = await User.findOne({_id: userId})

    
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }

    

    await User.findOneAndUpdate(
        {_id: userId}, 
        { $inc: { binPoints: points } },
        { new:true, runValidators: true}
        )

    res.status(200).json({message: `${pointsValue} Points added successfully`})

})


const rewardNotification = asyncWrapper(async (req, res) => {
    const userId = req.params.id
    const user = await User.findOne({_id: userId})
    const email = user.email
    const departmentName = user.departmentName

    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    // Send Notification email
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: senderEmail,
          pass: EmailPass,
        },
      });
  
      const mailDetails = {
        from: senderEmail,
        to: email,
        subject: "paperTruck: Reward Notification",
        text: `Congratulations ${departmentName} Department🔥, You finally got to the peak, Visit your Dashboard to see your reward Now!`,
      };
  
      transporter.sendMail(mailDetails, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: "Error sending notification email"});
        } else {
          console.log(`Email sent: ${result.response}`);
          res.status(200).json({ message: "Reward notfication sent" });
        }
      })
  
})


const pointsNotification = asyncWrapper(async (req, res) => {
    const userId = req.params.id
    const user = await User.findOne({_id: userId})
    const email = user.email
    const points = user.binPoints
    const departmentName = user.departmentName

    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    // Send Notification email
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: senderEmail,
          pass: EmailPass,
        },
      });
  
      const mailDetails = {
        from: senderEmail,
        to: email,
        subject: "paperTruck: Points Notification",
        text: `${departmentName} our paperTruck Hero 🌍💚: You just got new points added, You have ${points} Points, Continue keeping the environment safe, keep the game going...`,
      };
  
      transporter.sendMail(mailDetails, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: "Error sending notification email"});
        } else {
          console.log(`Email sent: ${result.response}`);
          res.status(200).json({ message: "Points notfication sent" });
        }
      })
  
})


const viewLogs = asyncWrapper(async (req, res) => {
    const logs = await Log.find({}).sort('-timestamp');
    res.status(200).json(logs);
    
})


module.exports = {
    viewAllParticipants,
    viewOneParticipant,
    viewLogs,
    addPoints,
    updateReward,
    rewardNotification,
    pointsNotification,
    removeOneParticipant,
    getUserId,
    getDepartmentNames
}