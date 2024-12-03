import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
        unique: true,
      },
      image: {
        type: String,
        default:
          'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
      },
      category: {
        type: String,
        default: 'uncategorized',
      },
      slug: {
        type: String,
        required: true,
        unique: true,
      },
      date: {
        type: String, // Store date as a string in 'YYYY-MM-DD' format
        required: true,
    },
      timeSlot: {
        type: String, // Store time slot as a string, e.g., '09:00 AM - 10:00 AM'
        required: true,
         },
    },
    { timestamps: true }
);

const Events = mongoose.model('Events', eventsSchema);

export default Events;