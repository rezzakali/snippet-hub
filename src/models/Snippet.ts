import mongoose from 'mongoose';

const SnippetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    createdBy: { type: String, ref: 'User' },
    favouriteBy: [{ type: String, ref: 'User' }],
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Snippet ||
  mongoose.model('Snippet', SnippetSchema);
