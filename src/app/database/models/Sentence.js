import mongoose from 'mongoose';
import QA from "./QA";
import Language from './Language';
import Candidate from "./Candidate";

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
  }
  //.. later on property
});


const Sentence = mongoose.models['Sentence'] || mongoose.model("Sentence", sentenceSchema);

export default Sentence;
