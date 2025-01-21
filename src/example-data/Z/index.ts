const jsonFiles = import.meta.glob("@/example-data/Z/*.json");
async function loadJsonFiles() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: { [key: string]: any } = {};
  for (const path in jsonFiles) {
    const keys = path.split("/").pop()?.replace(".json", "") as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = await jsonFiles[path]();
    data[keys] = obj.default;
  }
  return data;
}
export const data = await loadJsonFiles();
