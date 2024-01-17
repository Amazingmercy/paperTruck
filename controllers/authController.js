const User = require('../models/userModel')
const asyncWrapper = require('../middlewares/asyncWrapper')
const secretKey = process.env.JWT_SECRET_KEY
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const validateUser = require('../middlewares/validate')


const passwordLink = process.env.RESET_PASSWORD_LINK;  // Link for password reset
const senderEmail = process.env.SENDER_EMAIL;  // Email address for sending emails
const EmailPass = process.env.SENDER_EMAIL_PASS;  // Password for the email address

// Map to store reset tokens for email verification for reset password
const tokenStore = new Map();
const usedTokens = {};
const tokenBlackList = new Set();

const createUser = asyncWrapper(async (req, res)  => {
    const {departmentName, email, password, confirmPassword } = req.body
    
    const validate = validateUser(req.body)
    if (validate.error) {
      //Extract error message
      const validationError = validate.error.details[0].message;
      return res.status(400).json({ message: validationError});
    }
    
    if(password != confirmPassword){
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({email})
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    await User.create({departmentName, email, password})
    return res.status(201).json({message: "success"})
    
})


const logInUser = asyncWrapper( async (req, res) => {
    const { email, password} = req.body


    const user = await User.findOne({email})
    if(!user) {
        return res.status(40).json({message: 'Invalid email address'})
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token for authentication
    const payload = {
      userId: user._id,
      userEmail: user.email,
      userRole: user.role,
    };

    const userRole =user.role
    const userId = user._id
    const token = jwt.sign(payload, secretKey, { expiresIn: "100m" })
    res.status(200).json({token, userRole, userId})

})


const logOutUser = asyncWrapper( async (req, res) => {
    const token = req.header("Authorization");


    tokenBlackList.add(token);

    res.status(200).json({ message: "success" });
})


const forgetPassword = asyncWrapper( async (req, res) => {
    const { email } = req.body

    const user = User.findOne({email})

    if(!user){
        return res.status(400).json({message: 'Invalid email address'})
    }

    // Generate a reset token and store it
    const resetToken = jwt.sign({ email }, secretKey, { expiresIn: "10m" });
    tokenStore.set(email, resetToken);

    // Send password reset email
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
      subject: "paperTruck: Password Reset Request",
      text: `To reset your password, click the following link: ${passwordLink}/${resetToken}`,
    };

    transporter.sendMail(mailDetails, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending reset email"});
      } else {
        console.log(`Email sent: ${result.response}`);
        res.status(200).json({ message: "Password reset email sent" });
      }
    })


})


const getResetPassword = asyncWrapper( async (req, res) => {

  const  {token}  =  req.params


  jwt.verify(token, secretKey)
  //res.redirect('../public/resetPassword.html')
  res.redirect(`http://127.0.0.1:5500/public/resetPassword.html?token=${token}`);



  
})


const resetPassword = asyncWrapper(async (req, res) => {
  const { password} = req.body
  const {token } = req.params


  // Verify the token and retrieve the stored token
  const verifiedToken = jwt.verify(token, secretKey);
  const storedToken = tokenStore.get(verifiedToken.email);

      // Check if the token matches the stored token and has not been used
      if (token === storedToken && !usedTokens[token]) {
        // Update the user's password
        await User.findOneAndUpdate({email:verifiedToken.email}, password, 
        {   new:true, 
            runValidators: true
        });
  
        // Remove the stored token and mark it as used
        tokenStore.delete(verifiedToken.email);
        usedTokens[token] = true;
  
        res.status(200).json({ message: "Password reset successful" });
      }

})


const viewAllParticipants = asyncWrapper( async (req, res) => {

  const participants = await User.find({ role: { $ne: 'admin' } }).select('departmentName -_id')
  res.status(200).json(participants)

})




module.exports = {
    createUser,
    logInUser,
    logOutUser,
    getResetPassword,
    forgetPassword,
    resetPassword,
    viewAllParticipants,
}