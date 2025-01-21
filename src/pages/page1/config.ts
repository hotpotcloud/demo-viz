import {
  EBSH1,
  EBSK1_4,
  EBSK5_9,
  EBSH3A,
  EBSH3B,
  EBSS,
  EBST,
  EBSZ,
  WELL,
} from "@/example-data/index";
import type { TLayerDefinition } from "@webviz/subsurface-viewer";
enum LAYER_NAME {
  EBSH1 = "EBSH1",
  EBSK1_4 = "EBSK1_4",
  EBSK5_9 = "EBSK5_9",
  EBSH3A = "EBSH3A",
  EBSH3B = "EBSH3B",
  EBSS = "EBSS",
  EBST = "EBST",
  EBSZ = "EBSZ",
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const layerIds: any = {
  [LAYER_NAME.EBSH1]: EBSH1,
  // [LAYER_NAME.EBSK1_4]: EBSK1_4,
  // [LAYER_NAME.EBSK5_9]: EBSK5_9,
  // [LAYER_NAME.EBSH3A]: EBSH3A,
  // [LAYER_NAME.EBSH3B]: EBSH3B,
  // [LAYER_NAME.EBSS]: EBSS,
  // [LAYER_NAME.EBST]: EBST,
  // [LAYER_NAME.EBSZ]: EBSZ,
};
const baseLayer: TLayerDefinition = {
  "@@type": "Grid3DLayer",
  ZIncreasingDownwards: false,
  colorMapName: "Rainbow",
  gridLines: false,
  id: "Grid3DLayer",
  material: true,
  pickable: true,
  pointsData: EBSH1.Points_EBSH1,
  polysData: EBSH1.Polys_EBSH1,
  propertiesData: EBSH1.Props_EBSH1_PERMX,
};
const baseWell: TLayerDefinition = {
  "@@type": "WellsLayer",
  id: "well0",
  data: "@/example-data/well/wellTraj/EB-1.json",
  ZIncreasingDownwards: false,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replaceJson = (keys: any): TLayerDefinition[] => {
  const layers: TLayerDefinition[] = [];
  const arr = Object.keys(keys);
  const arrWell = Object.keys(WELL);
  // console.log("WELL", WELL);
  if (arr) {
    arr.forEach((el: string) => {
      layers.push({
        ...baseLayer,
        id: el,
        pointsData: keys[el][`Points_${el}`],
        polysData: keys[el][`Polys_${el}`],
        propertiesData: keys[el][`Props_${el}_PERMX`],
      });
    });
  }
  if (arrWell) {
    arrWell.forEach((el: string) => {
      layers.push({
        ...baseWell,
        id: el,
        data: WELL[el],
      });
    });
  }
  return layers;
};
export const configLayers = replaceJson(layerIds);
