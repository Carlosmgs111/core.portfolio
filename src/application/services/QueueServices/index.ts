import Queue from "bull";
import config from "../../../config";

const redisUrlConnection = config.redisUrlDev || config.redisUrlProd;

export const createQueue = (
  alias: string,
  redisUrl: string = redisUrlConnection
) => new QueueService(alias, redisUrl);
export class QueueService extends Queue {
  constructor(
    alias: string,
    options: any = {
      redis: {
        host: "127.0.0.1",
        port: 6379,
      },
    }
  ) {
    super(alias, options);
  }

  setProcess = (process: any) => {
    this.process(async (job: any, done: any) => {
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
    return this;
  };

  addJob = (
    job: any,
    options: any = {
      attempts: 3,
      backoff: { type: "exponential", delay: 60000 },
    }
  ) => {
    this.add(job, options);
    return this;
  };
}
