export function getNameNDir(name: string | string[]) {
  const programName = Array.isArray(name) ? name[name.length - 1] : name;
  const dirs = Array.isArray(name) ? name : [name];
  return { name: programName, dirs };
}
