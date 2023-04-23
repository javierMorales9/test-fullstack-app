import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function preStartFunction() {
  console.log("Generate Popup file");
  try {
    let fileText = fs
      .readFileSync(path.join(__dirname, "public", "js", "clickout.js"))
      .toString();

    fileText = fileText.replace(
      /const FRONTEND_URL = .+/g,
      "const FRONTEND_URL = '" + process.env.NEXT_PUBLIC_FRONTEND_URL + "';"
    );
    fileText = fileText.replace(
      /const BASE_URL = .+/g,
      "const BASE_URL = '" + process.env.NEXT_PUBLIC_BACKEND_URL + "/session';"
    );

    fs.writeFileSync(
      path.join(__dirname, "public", "js", "clickout_final.js"),
      fileText
    );
  } catch (err) {
    console.log("Error while modifying the file");
  }
}

preStartFunction();
