import { app } from "./app.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import connectionDB from "./db/index.js";

// FIRST APPROACH
/* // new concept ifi'ss ()()

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    // this is to listen to errors
    app.on("error", (errors) => {
      console.log("Errrr ", errors);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log("Connected to the port.");
    });
  } catch (error) {
    console.log("Error while connecting with DB", error);
  }
})();
 */

// second approach
// since connectionDB is async function it will return a promise
connectionDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed!!!", err);
  });
