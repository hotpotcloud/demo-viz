// import points from "@/data/H1/Points_EBSH1.json";
// import polys from "@/data/H1/Polys_EBSH1.json";
// import props from "@/data/H1/Props_EBSH1_PERMX.json";
// export { points as EBSH1, polys as Polys_EBSH1, props as Props_EBSH1 };

const jsonFiles = import.meta.glob("@/example-data/H1/*.json");
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
