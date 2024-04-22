import mongoose from "mongoose";

const docsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
      },
      content: {
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
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png',
      },
      category: {
        type: String,
        default: 'uncategorized',
      },
    },
    { timestamps: true }
);

const Documents = mongoose.model('Documents', docsSchema);

export default Documents;