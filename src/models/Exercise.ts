import mongoose, { Schema } from 'mongoose';
import { Exercise } from 'src/types/models';

const ExerciseSchema = new Schema<Exercise>({
  name: {
    type: String,
    required: [true, 'Please add an exercise name'],
    maxlength: [25, '25 character max']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User validation failed'],
    immutable: true
  },
  pr: {
    type: Number,
    default: 0
  },
  prDate: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<Exercise>('Exercise', ExerciseSchema);
