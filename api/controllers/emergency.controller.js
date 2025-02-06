import Emergency from '../models/emergencyDate.model.js';
import { errorHandler } from '../utils/error.js';

export const getEmergencyDates = async (req, res, next) => {
    try {
      const emergencyDates = await Emergency.find({})
        .sort({ date: 1 })
        .populate('createdBy', 'name');
      
      res.status(200).json(emergencyDates);
    } catch (error) {
      next(error);
    }
  };