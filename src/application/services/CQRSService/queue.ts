import Queue from "bull";

export const addQueue = (
  alias: string,
  options: any = {
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
) => {
  return new Queue(alias, options);
};

export const setProcessToQueue = (queue: any, process: any) => {
  queue.process(async (job: any, done: any) => {
    const { data } = job;
    try {
      if (Array.isArray(data)) await process(...data);
      else await process(data);
      done(null, { message: "Process completed succesfully!" });
    } catch (e: any) {
      console.error(e);
      job.fail(e);
    }
  });
};

export const addJobToQueue = (
  queue: any,
  job: any,
  options: any = { attempts: 3, backoff: { type: "exponential", delay: 60000 } }
) => {
  queue.add(job, options);
};
