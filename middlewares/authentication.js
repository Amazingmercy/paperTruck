const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET_KEY

const isAuthenticated = (req, res, next) => {
  try{
    const token = req.header('Authorization')
    if (!token) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    const tokenValue = token.replace("Bearer ", "")
    const verifiedToken = jwt.verify(tokenValue, secretKey);


    if (!verifiedToken) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = verifiedToken;
    next();

  } catch(error){
    if(error.name == 'TokenExpiredError'){
      return res.status(400).json({ message: 'Token expired!' });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

}



const isAdmin = (req, res, next) => {
    const token = req.header("Authorization");
    try{
  
    if (!token) {
      return res.status(401).json({ message: "Admin is not logged in" });
    }

    const tokenValue = token.replace("Bearer ", "")
    const verifiedToken = jwt.verify(tokenValue, secretKey);

    
    if (verifiedToken.userRole == 'admin') {
      req.user = verifiedToken; 
      next();
    } else {
      res.status(403).json({ message: "Access denied. User is not an admin" });
    }
  } catch(error){
    if(error.name == 'TokenExpiredError'){
      return res.status(400).json({ message: 'Token expired!' });
    } else {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}


module.exports = {
    isAuthenticated,
    isAdmin
}