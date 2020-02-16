import mongoose from 'mongoose';
import { ExerciseOnTemplateSchema, Template } from 'src/types/models';
const Schema = mongoose.Schema;

// Helper Schemas

const ExerciseSchema = new Schema<ExerciseOnTemplateSchema>({
  name: {
    type: String,
    required: [true, 'Please add an exercise name'],
    maxlength: [25, '25 character max']
  },
  weight: {
    type: Number,
    max: [2000, '2000 lb limit']
  },
  sets: {
    type: Number,
    max: [2000, '2000 sets limit']
  },
  reps: {
    type: Number,
    max: [2000, '2000 reps limit']
  }
});

// Workout schema

const TemplateSchema = new Schema<Template>({
  name: {
    type: String,
    required: [true, 'Give your template a name'],
    trim: true,
    maxlength: [20, '20 character max']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    maxlength: [25, 'Title cannot be longer than 25 characters'],
    trim: true
  },
  tags: [
    {
      content: String,
      color: String
    }
  ],
  notes: String,
  exercises: [ExerciseSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true
  }
});

export default mongoose.model<Template>('Template', TemplateSchema);
