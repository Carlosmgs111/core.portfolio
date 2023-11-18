
// ? Simulate a delayed task
export const asyncDelay = (delay = 5000) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
