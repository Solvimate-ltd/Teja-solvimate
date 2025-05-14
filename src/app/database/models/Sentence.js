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
  isReviewed: {
    type: Boolean,
    default: false
  },
  isAbusive: {
    type: Boolean,
    default: false
  },
  review: {
    type: mongoose.Schema.Types.Mixed, // In Future I will keep candidated Entered sentence and remark
    default: null
    /*
     {
      candidateSentence: "string",
      remark: "string"
     }
     */
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  //.. later on property
});


const Sentence = mongoose.models['Sentence'] || mongoose.model("Sentence", sentenceSchema);

export default Sentence;
