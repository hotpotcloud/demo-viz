# 自定义图层开发指南

## 1. 自定义图层概述

### 1.1 为什么需要自定义图层
- 实现特定的渲染效果
- 优化性能
- 支持自定义数据结构
- 实现特殊的交互效果

### 1.2 自定义图层的优势
- 完全控制数据结构
- 可以自定义渲染效果
- 可以实现复杂的动画效果
- 可以优化性能
- 可以实现特殊的交互效果

## 2. 实现方案

### 2.1 使用现有组件
```typescript
import { SubsurfaceViewer } from '@webviz/subsurface-components';
import { Grid3DLayer } from '@webviz/subsurface-components';

// 1. 准备数据
const buildingData = {
    vertices: new Float32Array([...]), // 3D 坐标点
    faces: new Uint32Array([...]),     // 面片索引
    properties: {
        height: new Float32Array([...]), // 高度信息
        type: new Uint32Array([...])     // 建筑物类型
    }
};

// 2. 创建图层
const buildingLayer = new Grid3DLayer({
    id: 'building-layer',
    data: buildingData,
    material: {
        ambient: 0.35,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [255, 255, 255]
    },
    colorMap: 'viridis',
    pickable: true,
    lightSettings: {
        headLight: {
            intensity: 0.5,
            color: [255, 255, 255]
        },
        ambientLight: {
            intensity: 0.3,
            color: [255, 255, 255]
        }
    }
});
```

### 2.2 创建自定义图层
```typescript
import { CompositeLayer } from '@deck.gl/core';

class CustomBuildingLayer extends CompositeLayer {
    static layerName = 'CustomBuildingLayer';

    initializeState() {
        this.state = {
            buffers: {
                vertex: null,
                normal: null,
                index: null,
                uv: null,
                property: null
            },
            shaderProgram: null,
            textures: new Map(),
            renderState: null
        };
    }

    updateState({ props, oldProps, changeFlags }) {
        if (changeFlags.dataChanged) {
            this.updateBuffers(props.data);
        }
    }

    renderLayers() {
        const { gl } = this.context;
        gl.useProgram(this.state.shaderProgram);
        this.setUniforms();
        this.setAttributes();
        gl.drawElements(gl.TRIANGLES, this.state.indexCount, gl.UNSIGNED_INT, 0);
    }
}
```

## 3. 自定义数据结构

### 3.1 数据结构定义
```typescript
interface CustomBuildingData {
    // 基础属性
    id: string;
    type: 'residential' | 'commercial' | 'industrial';
    
    // 几何信息
    vertices: Float32Array;      // 顶点坐标
    normals: Float32Array;       // 法向量
    indices: Uint32Array;        // 面片索引
    uvs: Float32Array;          // UV 坐标
    
    // 属性信息
    properties: {
        height: number;
        width: number;
        length: number;
        rotation: number;
        color: [number, number, number];
        textureId?: number;
    };
    
    // 自定义属性
    customProperties: {
        temperature?: number;
        occupancy?: number;
        energyUsage?: number;
    };
}
```

## 4. 自定义着色器

### 4.1 顶点着色器
```glsl
#version 300 es
in vec3 position;
in vec3 normal;
in vec2 uv;
in vec4 properties;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec3 lightPosition;

out vec3 vNormal;
out vec2 vUv;
out vec4 vProperties;

void main() {
    vec3 pos = position;
    pos.y += sin(time + position.x) * properties.x;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vProperties = properties;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
```

### 4.2 片段着色器
```glsl
#version 300 es
precision highp float;

in vec3 vNormal;
in vec2 vUv;
in vec4 vProperties;

uniform sampler2D textureMap;
uniform float time;
uniform vec3 lightColor;
uniform float ambientIntensity;
uniform float diffuseIntensity;

out vec4 fragColor;

void main() {
    vec3 lightDir = normalize(lightPosition - vPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    vec3 baseColor = texture(textureMap, vUv).rgb;
    vec3 customColor = vec3(
        sin(time + vProperties.x),
        cos(time + vProperties.y),
        vProperties.z
    );
    
    vec3 finalColor = mix(baseColor, customColor, vProperties.w);
    
    vec3 ambient = ambientIntensity * lightColor;
    vec3 diffuse = diffuseIntensity * diff * lightColor;
    vec3 final = (ambient + diffuse) * finalColor;
    
    fragColor = vec4(final, 1.0);
}
```

## 5. 性能优化

### 5.1 数据优化
- 使用 TypedArray 存储数据
- 实现数据分块加载
- 使用 Web Workers 处理数据

### 5.2 渲染优化
- 实现视锥体剔除
- 使用 LOD（Level of Detail）
- 实现遮挡剔除

### 5.3 交互优化
- 实现选择框选
- 实现建筑物高亮
- 实现建筑物信息展示

## 6. 开发建议

### 6.1 开发流程
1. 分析需求
   - 确定需要展示的数据类型
   - 确定需要的交互方式
   - 确定性能要求

2. 选择实现方式
   - 评估是否可以使用现有图层
   - 评估是否需要创建新图层
   - 评估是否需要组合多个图层

3. 开发实现
   - 使用现有图层或创建新图层
   - 实现数据转换和处理
   - 实现交互逻辑

4. 测试和优化
   - 进行性能测试
   - 进行交互测试
   - 进行兼容性测试

### 6.2 注意事项
1. WebGL 编程需要专业知识
2. 需要仔细管理 GPU 资源
3. 需要优化内存使用
4. 需要处理各种边界情况
5. 需要实现良好的错误处理 