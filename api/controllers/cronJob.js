import cron from 'node-cron';
import User from '../models/user.model.js';

cron.schedule('00 17 * * *', async () => {
  try {
    console.log("Cron job executed at 5PM");

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

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
      { $set: { isPresent: 'ABSENT' },
        $push: {
          notifications: {
            message: `You missed your Annual PE schedule.`,
            type: 'warning',
            timestamp: new Date(),
            link: '/status',
            isRead: false
          }
      }  
      },
      
    );

    console.log(`Marked ${result.modifiedCount} users as absent at 5 PM.`);
  } catch (error) {
    console.error("Error marking users absent:", error);
  }
});
