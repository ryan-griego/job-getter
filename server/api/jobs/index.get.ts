import {Schema, model} from 'mongoose';

const JobSchema = new Schema({
  email: {
    type: String,
  },
  name: {
    name: String
  },
});

export const Job = model<any>('Job', JobSchema);

export default defineEventHandler(async (event) => {
  const jobs = await Job.find();
  return {
    jobs,
  };
});
