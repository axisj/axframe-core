import * as fs from "fs";
import * as path from "path";
import programConfig from "../../../makeProgramConfig";
import decamelize, { camelCase, exist, mkdir } from "./utils";
import { EXAMPLE_ROUTERS } from "../../router/exampleRouter.ts";
import { Route } from "react-router-dom";
import React from "react";
import * as url from "url";

function main() {
  const { pagesDir, templateDir, programTypeFile, pageRouteFile, programs } = programConfig;

  if (!exist(programTypeFile)) {
    throw `The programType file does not exist. "${programTypeFile}"`;
  }

  if (!exist(pageRouteFile)) {
    throw `The pageRouteFile file does not exist. "${pageRouteFile}"`;
  }

  const programTypeFileRaw = fs.readFileSync(programTypeFile, { encoding: "utf-8" });
  const pageRouteFileRaw = fs.readFileSync(pageRouteFile, { encoding: "utf-8" });
  let programTypeFileNew = programTypeFileRaw;
  let pageRouteFileNew = pageRouteFileRaw;

  programs.forEach((p) => {
    const programName = Array.isArray(p.name) ? p.name[p.name.length - 1] : p.name;
    const dirs = Array.isArray(p.name) ? p.name : [p.name];

    const targetDir = path.join(pagesDir, ...dirs);
    if (exist(targetDir)) {
      throw `There is a program already created with the same name. "${targetDir}" Please remove the folder and try again.`;
    }

    mkdir(targetDir);
    console.log(targetDir, "was created successfully.");

    const fileNames = fs
      .readdirSync(path.join(templateDir, p.type), { withFileTypes: true, encoding: "utf-8" })
      .filter((p) => p.isFile())
      .map((p) => p.name);
    const Pascal_programName = camelCase(programName, { pascalCase: true });

    fileNames.forEach((fn) => {
      let data = fs.readFileSync(path.join(templateDir, p.type, fn), { encoding: "utf-8" });
      let pathToFile = path.join(targetDir, fn);

      const rePType = new RegExp(`\\$${p.type}\\$`, "g");
      const reUsePType = new RegExp(`use\\$${p.type}\\$`, "g");

      pathToFile = pathToFile.replace(rePType, Pascal_programName);
      data = data.replace(reUsePType, "use" + Pascal_programName).replace(rePType, camelCase(programName));

      if (exist(pathToFile)) {
        throw "Failed to create file. The file already exists.";
      } else {
        console.log(pathToFile);

        fs.writeFileSync(pathToFile, data);
      }
    });

    programTypeFileNew = programTypeFileNew.replace(
      "/* ##ADD_PROGRAM_TYPE_POSITION## */",
      `${decamelize(p.code).toUpperCase()} = "${decamelize(p.code).toUpperCase()}",
  /* ##ADD_PROGRAM_TYPE_POSITION## */`,
    );

    pageRouteFileNew = pageRouteFileNew
      .replace(
        "/* ##IMPORT_COMPONENT_POSITION## */",
        `const ${Pascal_programName} = React.lazy(() => import("${targetDir.replace("src/", "")}/App"));
/* ##IMPORT_COMPONENT_POSITION## */`,
      )
      .replace(
        "{/* ##INSERT_ROUTE_POSITION## */}",
        `<Route path={"${p.url}"} element={<${Pascal_programName} />} />
          {/* ##INSERT_ROUTE_POSITION## */}`,
      );
  });

  // Update programType file
  fs.writeFileSync(programTypeFile, programTypeFileNew);

  // Update pageRoute file
  fs.writeFileSync(pageRouteFile, pageRouteFileNew);
}

main();
