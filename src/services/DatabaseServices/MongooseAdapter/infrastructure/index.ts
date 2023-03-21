import mongoose from "mongoose";
import config from "../../../../config";

const test = !false;

const localURL = test ? config.mongoDBTestUrl : config.mongoDBLocalUrl;

export const connect = () =>
  mongoose.connect(localURL || config.mongoDBAtlasURL || "");

export const { connection } = mongoose;

// Callback once connection open
connection.once("open", () => {
  ("Mongodb connection stablished");
});

connection.on("error", (err) => {
  (err);
  process.exit(0);
});
