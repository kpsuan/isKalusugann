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

export const getposts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
  
      // Fetch posts based on filters
      const posts = await Announcement.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Announcement.countDocuments();
  
      res.status(200).json({ posts, totalPosts });
    } catch (error) {
      next(error);
    }
  };
  




export const deletepost = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(403, 'Only admins can delete posts!'));
    }

    try{
        await Announcement.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post has been deleted...');
    }
    catch(error){
        next(error);
    }
}

export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    try {
      const updatedPost = await Announcement.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };
  