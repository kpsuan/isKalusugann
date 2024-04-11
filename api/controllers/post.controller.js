import Announcement from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'Only admins can create posts!'));
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Please provide all required fields!'));
    
    }

    const slug =req.body.title.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newPost = new Announcement({

        ...req.body, 
        slug, 
        userId: req.user.id,
    });

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(error){
        next(error);
    }
};   