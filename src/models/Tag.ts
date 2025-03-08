import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true },
});

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);
