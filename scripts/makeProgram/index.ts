import * as fs from "fs";
import * as path from "path";
import programConfig from "../../../makeProgramConfig";
import { exist, mkdir, camelCase } from "./utils";

function main() {
  const { pagesDir, templateDir, programs } = programConfig;

  programs.forEach((p) => {
    const programName = Array.isArray(p.name) ? p.name[p.name.length - 1] : p.name;
    const dirs = Array.isArray(p.name) ? p.name : [p.name];

    const targetDir = path.join(pagesDir, ...dirs);
    if (exist(targetDir)) {
      throw `There is a program already created with the same name. "${targetDir}" Please delete the folder and try again.`;
    }

    mkdir(targetDir);
    console.log(targetDir, "was created successfully.");

    const fileNames = fs
      .readdirSync(path.join(templateDir, p.type), { withFileTypes: true, encoding: "utf-8" })
      .filter((p) => p.isFile())
      .map((p) => p.name);

    fileNames.forEach((fn) => {
      let data = fs.readFileSync(path.join(templateDir, p.type, fn), { encoding: "utf-8" });
      let pathToFile = path.join(targetDir, fn);

      const rePType = new RegExp(`\\$${p.type}\\$`, "g");
      const reUsePType = new RegExp(`use\\$${p.type}\\$`, "g");
      const Pascal_programName = camelCase(programName, { pascalCase: true });

      pathToFile = pathToFile.replace(rePType, Pascal_programName);
      data = data.replace(reUsePType, "use" + Pascal_programName).replace(rePType, camelCase(programName));

      if (exist(pathToFile)) {
        throw "Failed to create file. The file already exists.";
      } else {
        console.log(pathToFile);

        fs.writeFileSync(pathToFile, data);
      }
    });
  });
}

main();
