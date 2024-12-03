import Events from "../models/events.model.js";
import { errorHandler } from "../utils/error.js"

export const createEvent = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'Only admins can create events!'));
    }
    if(!req.body.title || !req.body.date){
        return next(errorHandler(400, 'Please provide all required fields!'));
    
    }

    const slug =req.body.title.split(' ').join('').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newEvent = new Events({

        ...req.body, 
        slug, 
        userId: req.user.id,
    });

    try{
        const savedEvent = await newEvent.save();
        res.status(200).json(savedEvent);
    }
    catch(error){
        next(error);
    }
};   

export const getevents = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        // Fetch events based on filters
        const events = await Events.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.title && { title: req.query.title }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.date && { date: req.query.date }),
            ...(req.query.image && { image: req.query.image }),
            ...(req.query.timeslot && { timeSlot: req.query.timeslot }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalEvents = await Events.countDocuments();

        res.status(200).json({ events, totalEvents }); // Updated to match the frontend expectation
    } catch (error) {
        next(error);
    }
};

export const getUpcomingEvents = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const events = await Events.find({
            date: { $gte: currentDate },
        }).sort({ date: 1 }).limit(5); // Fetch next 5 upcoming events

        res.status(200).json({ events });
    } catch (error) {
        next(error);
    }
};
