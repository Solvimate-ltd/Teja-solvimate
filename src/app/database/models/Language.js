import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true,
  }
});

const Language = mongoose.models.Language || mongoose.model("Language", languageSchema);

export default Language;
