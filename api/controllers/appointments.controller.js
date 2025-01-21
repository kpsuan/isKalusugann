import Appointments from "../models/appointments.model.js"
import { errorHandler } from "../utils/error.js";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchAvailableTimeSlots = async (req, res, next) => {
    const { date } = req.params;
    const userId = req.query.userId; // Add this parameter to your frontend API call

    try {
        if (!date || !dayjs(date).isValid()) {
            return res.status(400).json({ message: 'Invalid or missing date parameter.' });
        }

        const parsedDateStart = dayjs.tz(date, "Asia/Manila").startOf('day').toISOString();
        const parsedDateEnd = dayjs.tz(date, "Asia/Manila").endOf('day').toISOString();

        // Check if user already has a booking on this date
        if (userId) {
            const existingUserBooking = await Appointments.findOne({
                userId: userId,
                date: { $gte: parsedDateStart, $lte: parsedDateEnd }
            });

            if (existingUserBooking) {
                return res.status(200).json({ 
                    availableTimeSlots: [],
                    message: "You already have an appointment scheduled for this date."
                });
            }
        }

        const allTimeSlots = [
            "09:00 AM - 10:00 AM",
            "10:00 AM - 11:00 AM",
            "01:00 PM - 02:00 PM",
            "02:00 PM - 03:00 PM",
            "03:00 PM - 04:00 PM",
        ];

        const bookedAppointments = await Appointments.find({
            date: { $gte: parsedDateStart, $lte: parsedDateEnd },
        }).select('timeSlot').lean();

        const bookedTimeSlots = new Set(bookedAppointments.map(app => app.timeSlot));
        const availableTimeSlots = allTimeSlots.filter(slot => !bookedTimeSlots.has(slot));

        res.status(200).json({ availableTimeSlots });
    } catch (error) {
        console.error("Error fetching available time slots:", error);
        next(errorHandler(error, req, res));
    }
};


export const create = async (req, res) => {
    const { userId, firstName, lastName, email, date, timeSlot, service, category, phoneNumber, status } = req.body;

    try {
        if (!dayjs(date).isValid()) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        const parsedDateStart = dayjs.tz(date, "Asia/Manila").startOf('day').toISOString();
        const parsedDateEnd = dayjs.tz(date, "Asia/Manila").endOf('day').toISOString();

        // Check if user already has a booking on this date
        const existingUserBooking = await Appointments.findOne({
            userId: userId,
            date: { $gte: parsedDateStart, $lte: parsedDateEnd }
        });

        if (existingUserBooking) {
            return res.status(400).json({ message: "You already have an appointment scheduled for this date." });
        }

        // Check if the selected time slot is already booked
        const existingAppointment = await Appointments.findOne({
            date: { $gte: parsedDateStart, $lte: parsedDateEnd },
            timeSlot: timeSlot,
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "The selected time slot is already booked." });
        }

        // Create the appointment
        const newAppointment = new Appointments({
            userId,
            firstName,
            lastName,
            email,
            date: dayjs(date).toISOString(),
            timeSlot,
            service,
            category,
            phoneNumber,
            status,
        });

        await newAppointment.save();

        res.status(201).json({ message: "Appointment created successfully!", appointment: newAppointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Failed to create appointment. Please try again." });
    }
};






export const fetchMonthlyAvailability = async (req, res, next) => {
    const { yearMonth } = req.params;
    const [year, month] = yearMonth.split('-');
    const timezone = "Asia/Manila";

    try {
        const startOfMonth = dayjs.tz(`${year}-${month}-01`, timezone).startOf('month');
        const endOfMonth = startOfMonth.endOf('month').utc().toDate();
        const startUTC = startOfMonth.utc().toDate();

        const appointments = await Appointments.find({
            date: { $gte: startUTC, $lte: endOfMonth },
        }).lean();

        const availabilityStatus = {};
        const daysInMonth = startOfMonth.daysInMonth();
        const allTimeSlots = 5; // Total slots per day

        for (let i = 0; i < daysInMonth; i++) {
            const currentDate = startOfMonth.add(i, 'day');
            const formattedDate = currentDate.format('YYYY-MM-DD');

            const dateAppointments = appointments.filter(app =>
                dayjs(app.date).tz(timezone).format('YYYY-MM-DD') === formattedDate
            );

            availabilityStatus[formattedDate] = dateAppointments.length >= allTimeSlots ? 'full' : 'available';
        }

        res.status(200).json(availabilityStatus);
    } catch (error) {
        console.error("Error fetching monthly availability:", error);
        next(errorHandler(error, req, res));
    }
};

export const checkDateAvailability = async (req, res, next) => {
    const { date } = req.params;
    const { userId } = req.query;

    try {
        if (!date || !dayjs(date).isValid()) {
            return res.status(400).json({ message: 'Invalid or missing date parameter.' });
        }

        const parsedDateStart = dayjs.tz(date, "Asia/Manila").startOf('day').toISOString();
        const parsedDateEnd = dayjs.tz(date, "Asia/Manila").endOf('day').toISOString();

        // Check if date has already passed
        if (dayjs(date).isBefore(dayjs().startOf('day'))) {
            return res.status(400).json({
                message: 'Cannot book appointments for past dates.',
                status: 'unavailable'
            });
        }

        // Check if user already has booking on this date
        if (userId) {
            const existingUserBooking = await Appointments.findOne({
                userId: userId,
                date: { $gte: parsedDateStart, $lte: parsedDateEnd }
            });

            if (existingUserBooking) {
                return res.status(400).json({
                    message: 'You already have an appointment scheduled for this date.',
                    status: 'unavailable'
                });
            }
        }

        // Count appointments for this date
        const appointmentsCount = await Appointments.countDocuments({
            date: { $gte: parsedDateStart, $lte: parsedDateEnd }
        });

        // Define max slots (matching your available time slots)
        const maxSlotsPerDay = 5;

        if (appointmentsCount >= maxSlotsPerDay) {
            return res.status(400).json({
                message: 'No available slots for this date.',
                status: 'full'
            });
        }

        res.status(200).json({
            message: 'Slots available',
            status: 'available',
            availableSlots: maxSlotsPerDay - appointmentsCount
        });

    } catch (error) {
        console.error("Error checking date availability:", error);
        next(errorHandler(error, req, res));
    }
};