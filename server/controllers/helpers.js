import fs from "fs"

export const getFileData = (fileName) => {
  const file = fs.readFileSync(fileName);
  return JSON.parse(file);
}

export const setFileData = (filepath, newData, errorCallback) => {
  const newFileData = JSON.stringify(newData);

  fs.writeFileSync(filepath, newFileData, "utf-8", errorCallback);
}