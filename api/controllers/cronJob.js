import cron from 'node-cron';
import User from '../models/user.model.js';

// Cron job that runs at 5PM every day to mark today's no-shows as absent
cron.schedule('00 17 * * *', async () => {
  try {
    console.log("Cron job executed at 5PM");

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0); // Start of today's date
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of today's date

    const result = await User.updateMany(
      {
        schedule: {
          $elemMatch: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        isPresent: { $ne: 'ARRIVED' },
      },
      {
        $set: { isPresent: 'ABSENT' },
        $push: {
          notifications: {
            message: `You missed your Annual PE schedule.`,
            type: 'warning',
            timestamp: new Date(),
            link: '/status',
            isRead: false
          }
        }
      }
    );

    console.log(`Marked ${result.modifiedCount} users as absent at 5 PM.`);
  } catch (error) {
    console.error("Error marking users absent:", error);
  }
});

// Job that runs when the system starts to mark past schedules as absent
const markPastSchedulesAsAbsent = async () => {
  try {
    console.log("Running job to mark past schedules as absent");

    const now = new Date();
    
    // First, find all users with any schedule data
    const users = await User.find({
      schedule: { $exists: true, $ne: [], $ne: [""]},
      isPresent: { $ne: 'ARRIVED' }
    });
    
    let markedCount = 0;
    
    // Process each user
    for (const user of users) {
      // Check each schedule date
      let hasPastSchedule = false;
      let hasFutureSchedule = false;
      
      // Make sure schedule is treated as an array
      const schedules = Array.isArray(user.schedule) ? user.schedule : [user.schedule];
      
      // Examine each schedule date
      for (const scheduleDate of schedules) {
        const scheduleDateObj = new Date(scheduleDate);
        
        if (scheduleDateObj < now) {
          hasPastSchedule = true;
        } else {
          hasFutureSchedule = true;
        }
      }
      
      // If user has a past schedule and no future schedules, mark as absent
      if (hasPastSchedule && !hasFutureSchedule) {
        await User.updateOne(
          { _id: user._id },
          {
            $set: { isPresent: 'ABSENT' },
            $push: {
              notifications: {
                message: `You missed your Annual PE schedule.`,
                type: 'warning',
                timestamp: new Date(),
                link: '/status',
                isRead: false
              }
            }
          }
        );
        markedCount++;
      }
    }

    console.log(`Marked ${markedCount} users with past schedules as absent.`);
  } catch (error) {
    console.error("Error marking past schedules as absent:", error);
  }
};

// Execute the past schedules job when the system starts
markPastSchedulesAsAbsent();