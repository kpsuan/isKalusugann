import Appointments from "../models/appointments.model.js";
import { errorHandler } from "../utils/error.js";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchAvailableTimeSlots = async (req, res, next) => {
    const { date } = req.params; // Expected format: YYYY-MM-DD
    const timezone = "Asia/Manila";

    try {
        // Convert the requested date to UTC midnight
        const requestedDate = dayjs.tz(date, timezone).startOf('day');
        const startOfDay = requestedDate.utc().toDate();
        const endOfDay = requestedDate.add(1, 'day').utc().toDate();

        // Define all possible time slots
        const allTimeSlots = [
            "09:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "01:00 PM - 02:00 PM",
            "02:00 PM - 03:00 PM",
            "03:00 PM - 04:00 PM",
        ];

        // Fetch all appointments for the selected date
        const bookedAppointments = await Appointments.find({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).select('timeSlot').lean();

        // Create a Set of booked time slots for efficient lookup
        const bookedTimeSlots = new Set(bookedAppointments.map(app => app.timeSlot));

        // Filter out booked time slots
        const availableTimeSlots = allTimeSlots.filter(slot => !bookedTimeSlots.has(slot));

        // Log for debugging
        console.log('Date Range:', {
            date,
            startOfDay,
            endOfDay,
            bookedTimeSlots: Array.from(bookedTimeSlots),
            availableTimeSlots
        });

        res.status(200).json({ availableTimeSlots });
    } catch (error) {
        next(errorHandler(error, req, res));
    }
};

export const create = async (req, res, next) => {
    const slug = req.user.id.toLowerCase();
    const { date, firstName, lastName, phoneNumber, timeSlot, service, category } = req.body;

    try {
        // Convert the appointment date to UTC while preserving the date in Manila time
        const appointmentDate = dayjs.tz(date, 'Asia/Manila').startOf('day').utc().toDate();

        // Check if the user already has an appointment on this date
        const userAppointmentOnDate = await Appointments.findOne({
            userId: req.user.id,
            date: {
                $gte: appointmentDate,
                $lt: dayjs(appointmentDate).add(1, 'day').toDate()
            }
        });

        if (userAppointmentOnDate) {
            return res.status(400).json({
                message: 'You already have an appointment on this date.'
            });
        }

        // Check if this time slot is already booked on this date
        const existingAppointment = await Appointments.findOne({
            date: {
                $gte: appointmentDate,
                $lt: dayjs(appointmentDate).add(1, 'day').toDate()
            },
            timeSlot: timeSlot
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: 'This time slot is already booked for the selected date.'
            });
        }

        const newAppointment = new Appointments({
            userId: req.user.id,
            firstName,
            lastName,
            date: appointmentDate,
            timeSlot,
            service,
            phoneNumber,
            category,
            slug,
        });

        const savedAppointment = await newAppointment.save();
        res.status(200).json(savedAppointment);
    } catch (error) {
        next(errorHandler(error, req, res));
    }
};


// Update monthly availability check as well
export const fetchMonthlyAvailability = async (req, res, next) => {
    const { yearMonth } = req.params;
    const [year, month] = yearMonth.split('-');
    const timezone = "Asia/Manila";

    try {
        const startOfMonth = dayjs.tz(`${year}-${month}-01`, timezone).startOf('month');
        const startUTC = startOfMonth.utc().toDate();
        const endUTC = startOfMonth.endOf('month').utc().toDate();

        const appointments = await Appointments.find({
            date: { 
                $gte: startUTC,
                $lte: endUTC
            }
        }).lean();

        const availabilityStatus = {};
        const daysInMonth = startOfMonth.daysInMonth();

        for (let i = 0; i < daysInMonth; i++) {
            const currentDate = startOfMonth.add(i, 'day');
            const formattedDate = currentDate.format('YYYY-MM-DD');
            
            // Count appointments for this specific day
            const dateAppointments = appointments.filter(app => 
                dayjs(app.date).tz(timezone).format('YYYY-MM-DD') === formattedDate
            );

            // Consider a day full if all time slots are taken
            const maxSlotsPerDay = 5; // Since we have 5 possible time slots
            availabilityStatus[formattedDate] = dateAppointments.length >= maxSlotsPerDay ? 'full' : 'available';
        }

        res.status(200).json(availabilityStatus);
    } catch (error) {
        next(errorHandler(error, req, res));
    }
};