import mongoose from "mongoose";

const affiliateProgramSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true, 
  },
  key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  }
});

export default mongoose.model('AffiliateProgram', affiliateProgramSchema);