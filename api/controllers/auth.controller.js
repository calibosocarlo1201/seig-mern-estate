import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

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
