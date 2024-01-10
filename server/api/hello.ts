import data from './jobs.json';
export default defineEventHandler((event) => {
  return {
    data,
  }
});
