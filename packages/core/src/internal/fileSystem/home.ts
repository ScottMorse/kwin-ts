import os from "os";
import path from "path";

export const expandHome = (p: string) => {
  return path.resolve(p.replace("~", os.homedir()));
};
