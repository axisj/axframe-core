import fs from "fs";
import path from "path";
import { camelCase, exist } from "./utils.ts";
import { ProgramType } from "./@types.ts";

interface Props {
  fileNames: string[];
  type: keyof typeof ProgramType;
  templateDir: string;
  targetDir: string;
  Pascal_programName: string;
  programName: string;
}
export function saveFileByTmpl({ fileNames, type, templateDir, targetDir, Pascal_programName, programName }: Props) {
  fileNames.forEach((fn) => {
    let data = fs.readFileSync(path.join(templateDir, type, fn), { encoding: "utf-8" });
    let pathToFile = path.join(targetDir, fn);

    const rePType = new RegExp(`\\$${type}\\$`, "g");
    const reUsePType = new RegExp(`use\\$${type}\\$`, "g");

    pathToFile = pathToFile.replace(rePType, Pascal_programName);
    data = data.replace(reUsePType, "use" + Pascal_programName).replace(rePType, camelCase(programName));

    if (exist(pathToFile)) {
      throw "Failed to create file. The file already exists.";
    } else {
      console.log(pathToFile);
      fs.writeFileSync(pathToFile, data);
    }
  });
}
