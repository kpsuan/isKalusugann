import Documents from "../models/docs.model.js";
import { errorHandler } from "../utils/error.js"

export const upload = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'Only admins can upload documents!'));
    }
    if(!req.body.content){
        return next(errorHandler(400, 'Please provide all required fields!'));
    
    }

    const newDocs = new Documents({

        ...req.body, 
    
        userId: req.user.id,
    });

    try{
        const savedDocs = await newDocs.save();
        res.status(200).json(savedDocs);
    }
    catch(error){
        next(error);
    }
};   

export const getdocuments = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
  
      const docs = await Documents.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
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
  
      const totalDocs = await Documents.countDocuments();
      res.status(200).json({ docs, totalDocs });
    } catch (error) {
      next(error);
    }
  };
  

export const deletedocuments = async (req, res, next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(403, 'Only admins can delete documents!'));
    }

    try{
        await Documents.findByIdAndDelete(req.params.docsId);
        res.status(200).json('Document has been deleted...');
    }
    catch(error){
        next(error);
    }
}

export const updatedocuments = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this document'));
    }
    try {
      const updatedDocs = await Documents.findByIdAndUpdate(
        req.params.docsId,
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
      res.status(200).json(updatedDocs);
    } catch (error) {
      next(error);
    }
  };