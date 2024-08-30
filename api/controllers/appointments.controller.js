import Appointments from "../models/appointments.model.js";
import { errorHandler } from "../utils/error.js";
import dayjs from 'dayjs';

// Endpoint to create a new appointment
export const create = async (req, res, next) => {
    const slug = req.user.id.toLowerCase(); // Use userId as the slug
    const { date, timeSlot } = req.body;

    try {
        // Check if the user has already booked this time slot on the same date
        const existingAppointment = await Appointments.findOne({
            userId: req.user.id,
            date: date,
            timeSlot: timeSlot,
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'You have already booked this time slot.' });
        }

        // Create a new appointment
        const newAppointment = new Appointments({
            ...req.body,
            slug,
            userId: req.user.id,
        });

        const savedAppointment = await newAppointment.save();
        res.status(200).json(savedAppointment);
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (could occur from the unique compound index)
            res.status(400).json({ message: 'You have already booked this time slot.' });
        } else {
            next(errorHandler(error, req, res));
        }
    }
};

// Endpoint to fetch availability status for a month
export const fetchMonthlyAvailability = async (req, res, next) => {
    const { year, month } = req.params;

    try {
        // Define the start and end of the month
        const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month').toDate();
        const endOfMonth = dayjs(startOfMonth).endOf('month').toDate();

        // Fetch appointments for the entire month
        const appointments = await Appointments.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).exec();

        // Aggregate availability status for each date
        const availabilityStatus = {};
        for (let date = startOfMonth; date <= endOfMonth; date = dayjs(date).add(1, 'day').toDate()) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const count = appointments.filter(app => dayjs(app.date).format('YYYY-MM-DD') === formattedDate).length;
            availabilityStatus[formattedDate] = count >= 20 ? 'full' : 'available';
        }

        res.status(200).json(availabilityStatus);
    } catch (error) {
        next(errorHandler(error, req, res));
    }
};

export const fetchAvailableTimeSlots = async (req, res, next) => {
    const { date } = req.params;

    try {
        // Parse the date string to a Date object or use dayjs for consistent handling
        const formattedDate = dayjs(date, 'YYYY-MM-DD').startOf('day').toDate();
        
        console.log('Received date:', date);
        console.log('Formatted date:', formattedDate);

        // Define all possible time slots
        const allTimeSlots = [
            "09:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "01:00 PM - 02:00 PM",
            "02:00 PM - 03:00 PM",
            "03:00 PM - 04:00 PM",
        ];

        // Fetch all appointments for the given date
        const bookedAppointments = await Appointments.find({
            date: formattedDate
        }).exec(); 

        console.log('Booked appointments:', bookedAppointments);

        // Extract booked time slots from the fetched appointments
        const bookedTimeSlots = bookedAppointments.map(appointment => appointment.timeSlot);
        console.log('Booked time slots:', bookedTimeSlots);

        // Filter out the booked time slots from all possible time slots
        const availableTimeSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
        console.log('Available time slots:', availableTimeSlots);

        // Return the available time slots
        res.status(200).json({ availableTimeSlots });
    } catch (error) {
        next(errorHandler(error, req, res));
    }
};
