import Student from '../models/student.model.js';
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import config from './../../config/config.js';

// Sign in with studentNumber and password, set cookies expiration to 24 hours
const signin = async (req, res) => {
    try {
        let student = await Student.findOne({ "studentNumber": req.body.studentNumber });
        if (!student)
            return res.status(401).json({ error: "Student not found" });

        if (!student.authenticate(req.body.password)) {
            return res.status(401).send({ error: "Student number and password don't match." });
        }

        const token = jwt.sign({ _id: student._id, isAdmin: student.isAdmin }, config.jwtSecret, { expiresIn: '24h' });
        res.cookie('SchoolSystem', token, { expire: new Date() + 24 * 60 * 60 * 1000 });

        const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
        return res.json({
            token,
            student: {
                name: studentName,
                email: student.email,
                studentNumber: student.studentNumber,
                isAdmin: student.isAdmin
            }
        });
    } catch (err) {
        return res.status(401).json({ error: "Could not sign in" });
    }
};

// Sign out function
const signout = (req, res) => {
    res.clearCookie("SchoolSystem");
    return res.status(200).json({
        message: "Signed out"
    });
};

// Require sign-in middleware
const requireSignin = expressjwt({
    secret: config.jwtSecret,
    algorithms: ["HS256"],
    userProperty: 'auth'
});

// Authorization middleware
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: "Student is not authorized"
        });
    }
    next();
};

// Admin check middleware
const isAdmin = (req, res, next) => {
    if (!req.auth || !req.auth.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }
    next();
};

export default { signin, signout, requireSignin, hasAuthorization, isAdmin };
