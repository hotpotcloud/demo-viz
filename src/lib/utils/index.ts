// // /**
// //  * 动态加载指定目录下的所有 JSON 文件并返回一个对象。
// //  * 支持递归加载子文件夹中的文件。
// //  *
// //  *
// //  * @param dirPath 要加载的文件夹路径，可以是相对路径或绝对路径。
// //  * @returns 返回一个包含所有 JSON 数据的对象，键是文件名（无扩展名），值是文件内容。
// //  */
// // export async function loadJsonFilesFromDir(
// //   dirPath: string
// //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// // ): Promise<{ [key: string]: any }> {
// //   try {
// //     // 使用 import.meta.glob 动态导入指定目录及其子目录下的所有 JSON 文件
// //     const jsonFiles = import.meta.glob(`${dirPath}/*.json`);
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     const data: { [key: string]: any } = {};
// //     // 循环导入每个 JSON 文件
// //     for (const path in jsonFiles) {
// //       try {
// //         // 提取文件名（去掉路径和扩展名）
// //         const fileName = path.split("/").pop()?.replace(".json", "") as string;

// //         // 动态导入 JSON 文件并获取内容
// //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //         const module: any = await jsonFiles[path]();
// //         data[fileName] = module.default;
// //       } catch (error) {
// //         console.error(`加载文件 ${path} 时出错:`, error);
// //       }
// //     }

// //     return data;
// //   } catch (error) {
// //     console.error(`加载文件夹 ${dirPath} 时出错:`, error);
// //     return {};
// //   }
// // }

// // utils/loadJsonFiles.ts

// // 映射文件夹路径
// const folderPaths = {
//   H1: "@/example-data/H1",
//   H3A: "@/example-data/H3/HA3A",

//   // 可以继续添加其他文件夹
// };

// /**
//  * 动态加载指定目录下的所有 JSON 文件并返回一个对象。
//  *
//  * @param folder 文件夹名称，必须是已映射的文件夹。
//  * @returns 返回一个包含所有 JSON 数据的对象，键是文件名（无扩展名），值是文件内容。
//  */
// export async function loadJsonFilesFromFolder(
//   folder: keyof typeof folderPaths
// ): Promise<{ [key: string]: any }> {
//   const dirPath = folderPaths[folder]; // 获取映射后的文件夹路径
//   const jsonFiles = import.meta.glob(folderPaths[folder].json); // 使用静态路径加载 JSON 文件

//   const data: { [key: string]: any } = {};

//   // 循环导入每个 JSON 文件
//   for (const path in jsonFiles) {
//     try {
//       // 提取文件名（去掉路径和扩展名）
//       const fileName = path.split("/").pop()?.replace(".json", "") as string;

//       // 动态导入 JSON 文件并获取内容
//       const module = await jsonFiles[path]();
//       data[fileName] = module.default;
//     } catch (error) {
//       console.error(`加载文件 ${path} 时出错:`, error);
//     }
//   }

//   return data;
// }
