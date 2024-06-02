import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import errorHandler from '../utils/error.js'

export const signUp = async (req, res, next) => {
    const { user, email, password } = req.body;
    // console.time("Total Request Time");
    // console.time("Hashing Time");

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        //console.timeEnd("Hashing Time");

        const newUser = new User({ user, email, password: hashedPassword });
        //console.time("Database Save Time");
        
        await newUser.save();
        //console.timeEnd("Database Save Time");

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        //console.error("Error during sign up:", error);
        next(error);
    }
};


export const signIn = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if(!validUser) return next(errorHandler(401, 'No user found.'));
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Invalid credentials'))

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)

        const {password : pass, ...rest} = validUser._doc;

        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(user){
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = user._doc;

        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }else{
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

        const generatedUserName = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4);
        const newUser = new User({user: generatedUserName, email: req.body.email, password: hashedPassword, avatar: req.body.photo});

        await newUser.save();

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);

        const {password, ...rest} = newUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }
}