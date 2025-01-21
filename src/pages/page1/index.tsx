import { FC, useEffect, useState } from "react";
import { Spin } from "antd"; // 引入Spin组件
import SubsurfaceViewer from "@webviz/subsurface-viewer";
import { configLayers } from "./config";

const Page1: FC = () => {
  const [config, setConfig] = useState(configLayers);
  const [loading, setLoading] = useState(true); // 设置loading状态

  useEffect(() => {
    // 模拟异步加载数据的过程
    setConfig(configLayers); // 这里你可以根据实际需要加载数据
    setTimeout(() => {
      setLoading(false); // 数据加载完成，停止loading状态
    }, 5000); // 模拟加载时间
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* 如果loading为true，显示Spin加载组件 */}
      {loading ? (
        <Spin
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : (
        <SubsurfaceViewer
          bounds={[443584, 3973299, 501167, 3700647]}
          id="grid-3d"
          layers={[
            {
              "@@type": "AxesLayer",
              ZIncreasingDownwards: false,
              bounds: [443584, 3643299, -4890, 511167, 3701647, -1],
              id: "axes-layer2",
            },
            ...config,
          ]}
          verticalScale={10}
          triggerHome={0}
          views={{
            layout: [1, 1],
            viewports: [
              {
                id: "view_1",
                show3D: true,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default Page1;
