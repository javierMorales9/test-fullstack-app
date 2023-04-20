import path from "path";
import dotenv from "dotenv";

const setEnv = () => {
  if (process.env.NODE_ENV && process.env.NODE_ENV !== "production") {
    const result1 = dotenv.config({
      path: path.join(
        __dirname,
        `../../../../../settings/env/${process.env.NODE_ENV}.env`,
      ),
    });

    if (result1.error) {
      throw result1.error;
    }
  }
};

export default setEnv;
