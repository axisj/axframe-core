import * as fs from "fs";
import * as path from "path";
import programConfig from "../../../makeProgramConfig";
import decamelize, { camelCase, exist, mkdir } from "./utils";
import { getNameNDir } from "./getNameNDir";

function main() {
  const { pagesDir, templateDir, programTypeFile, pageRouteFile, routesFile, serviceMockUpDataFile, programs } =
    programConfig;

  if (!exist(programTypeFile)) {
    throw `The programType file does not exist. "${programTypeFile}"`;
  }

  if (!exist(pageRouteFile)) {
    throw `The pageRouteFile file does not exist. "${pageRouteFile}"`;
  }

  if (!exist(routesFile)) {
    throw `The routesFile file does not exist. "${routesFile}"`;
  }

  if (!exist(serviceMockUpDataFile)) {
    throw `The serviceMockUpDataFile file does not exist. "${serviceMockUpDataFile}"`;
  }

  const programTypeFileRaw = fs.readFileSync(programTypeFile, { encoding: "utf-8" });
  const pageRouteFileRaw = fs.readFileSync(pageRouteFile, { encoding: "utf-8" });
  const routesFileRaw = fs.readFileSync(routesFile, { encoding: "utf-8" });
  const serviceMockUpDataFileRaw = fs.readFileSync(serviceMockUpDataFile, { encoding: "utf-8" });

  let programTypeFileNew = programTypeFileRaw;
  let pageRouteFileNew = pageRouteFileRaw;
  let routesFileRawNew = routesFileRaw;
  let serviceMockUpDataFileRawNew = serviceMockUpDataFileRaw;

  programs.forEach((p) => {
    const { name: programName, dirs } = getNameNDir(p.name);

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
    const programTypeName = decamelize(p.code).toUpperCase();

    // 템플릿 파일로 파일 생성
    {
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
    }

    programTypeFileNew = programTypeFileNew.replace(
      "/* ##ADD_PROGRAM_TYPE_POSITION## */",
      `${programTypeName} = "${programTypeName}",
  /* ##ADD_PROGRAM_TYPE_POSITION## */`,
    );

    routesFileRawNew = routesFileRawNew.replace(
      "/* ##INSERT_ROUTE_POSITION## */",
      `${programTypeName}: {
    program_type: PROGRAM_TYPES.${programTypeName},
    path: "${p.url}",
  },
  /* ##INSERT_ROUTE_POSITION## */`,
    );

    pageRouteFileNew = pageRouteFileNew
      .replace(
        "/* ##IMPORT_COMPONENT_POSITION## */",
        `const ${Pascal_programName} = React.lazy(() => import("${targetDir.replace("src/", "")}/App"));
/* ##IMPORT_COMPONENT_POSITION## */`,
      )
      .replace(
        "{/* ##INSERT_ROUTE_POSITION## */}",
        `<Route path={ROUTES.${programTypeName}.path} element={<${Pascal_programName} />} />
          {/* ##INSERT_ROUTE_POSITION## */}`,
      );

    serviceMockUpDataFileRawNew = serviceMockUpDataFileRawNew
      .replace(
        "/* ##INSERT_MENU_POSITION## */",
        `{
        multiLanguage: {
          en: "${Pascal_programName}",
          ko: "${Pascal_programName}",
        },
        iconTy: "Default",
        progCd: "${programTypeName}",
        children: [],
      },
      /* ##INSERT_MENU_POSITION## */`,
      )
      .replace(
        "/* ##INSERT_PROGRAM_TYPE_POSITION## */",
        `"${programTypeName}",
    /* ##INSERT_PROGRAM_TYPE_POSITION## */`,
      );
  });

  // Update programTypeFile
  fs.writeFileSync(programTypeFile, programTypeFileNew);
  // Update pageRouteFile
  fs.writeFileSync(pageRouteFile, pageRouteFileNew);
  // Update routesFile
  fs.writeFileSync(routesFile, routesFileRawNew);
  // Update serviceMockUpDataFile
  fs.writeFileSync(serviceMockUpDataFile, serviceMockUpDataFileRawNew);
}

main();
