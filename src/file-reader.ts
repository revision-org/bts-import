import { promises as fs } from "fs";
import * as libxmljs from "libxmljs";
import { Settings } from "./types/settings";
import chalk from "chalk";

export const readBinding = async (settings: Settings) => {
  const file = await fs.readFile(settings.path, {
    encoding: "utf8",
  });

  var document = libxmljs.parseXml(file.toString(), { blanks: false });

  return document;
};

export const readSettings = async (path?: string) => {
  const defaultPath = path ? path : "./settings.json";

  console.log(`Looking for a settings file at ${defaultPath}`);

  try {
    const file = await fs.readFile(defaultPath, {
      encoding: "utf8",
    });

    const settings: Settings = JSON.parse(file);

    return settings;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.log(chalk.yellow("A settings (settings.json) is required."));
    }
  }
};
