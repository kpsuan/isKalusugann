import LaboratoryService from "../models/laboratoryservices.model.js"
import { errorHandler } from "../utils/error.js"

export const createLaboratoryService = async (req, res) => {
    try {
      const { type, faculty, students, regular, senior } = req.body;
      const existingService = await LaboratoryService.findOne({ type });
        
      if (existingService) {
        existingService.faculty = faculty;
        existingService.students = students;
        existingService.regular = regular;
        existingService.senior = senior;
        await existingService.save();
        return res.json({ message: "Service updated successfully" });
      }
  
      const newService = new LaboratoryService(req.body);
      await newService.save();
      res.json({ message: "Service created successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  

export const getLaboratoryServices = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        // Fetch laboratory services based on filters
        const filters = {
            ...(req.query.type && { type: { $regex: req.query.type, $options: 'i' } }),
        };

        const services = await LaboratoryService.find(filters)
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalServices = await LaboratoryService.countDocuments(filters);

        res.status(200).json({ services, totalServices });
    } catch (error) {
        next(error);
    }
};

