import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
//import expressJwt from 'express-jwt'
import { expressjwt } from "express-jwt";
import config from './../../config/config.js'

// Van Nguyen: modify signin, signin with userName, set cookies expiration to 24 hours
const signin = async (req, res) => {
    try {
      let user = await User.findOne({ "username": req.body.username }); 
      if (!user)
        return res.status(401).json({ error: "User not found" });
  
      if (!user.authenticate(req.body.password)) {
        return res.status(401).send({ error: "Username and password don't match." });
      }
  
      const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '24h' }); // Set token expiration to 24 hours
      res.cookie('SurveyApp', token, { expire: new Date() + 24 * 60 * 60 * 1000 }); // Set cookie expiration to 24 hours
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim(); // concat userName 
      return res.json({
        token,
        user: {
          _id: user._id,
          name: userName,
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      return res.status(401).json({ error: "Could not sign in" });
    }
  };


const signout = (req, res) => { 
res.clearCookie("SurveyApp")
return res.status('200').json({ 
message: "signed out"
}) 
}
const requireSignin = expressjwt({ 
    secret: config.jwtSecret, 
    algorithms: ["HS256"],
    userProperty: 'auth'
})
const hasAuthorization = (req, res, next) => { 
const authorized = req.profile && req.auth
&& req.profile._id ==  req.auth._id 
if (!(authorized)) {
return res.status('403').json({ 
error: "User is not authorized"
}) 
} 
next()
}
export default { signin, signout, requireSignin, hasAuthorization }