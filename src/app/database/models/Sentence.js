import mongoose from 'mongoose';

const sentenceSchema = new mongoose.Schema({
  sentence: {
    type: String,
    required: true
  },
  translatedSentence: {
    type: String,
    default: ""
  },
  isTranslated: {
    type: Boolean,
    default: false
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }
  //.. later on property
});


const Sentence = mongoose.models['Sentence'] || mongoose.model("Sentence", sentenceSchema);

export default Sentence;
