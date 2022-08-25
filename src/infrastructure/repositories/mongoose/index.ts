import mongoose from "mongoose";
import config from "../../../config";

mongoose.connect(config.mongoDBLocalTestUrl);

export const {connection} = mongoose;

// Callback once connection open
connection.once("open", () => {
  console.log("Mongodb connection stablished");
});

connection.on("error", (err) => {
  console.log(err);
  process.exit(0);
});
