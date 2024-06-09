import errorHandler from "../utils/error.js"
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

export const test = (req,res) => {
    res.json({
        message: "test"
    })
}

export const updateUser = async (req, res, next) => {

    if(req.user.id !== req.params.id) return next(errorHandler(403, 'Unautorized! You can only update your own account'));

    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                user: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    if(req.user.id !== req.params.id) return next(errorHandler(403, 'Unautorized! You can only delete your own account')); 

    const deletedUser = await User.deleteOne({_id: id});

    if(deletedUser.deletedCount > 0){
        res.clearCookie('access_token');
        res.status(200).json({message: "Your account was successfully deleted!"})
    }
}