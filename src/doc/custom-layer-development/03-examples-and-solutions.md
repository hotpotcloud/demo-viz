# 示例代码和解决方案

## 1. 3D 建筑物渲染示例

### 1.1 使用 Grid3DLayer 实现

```typescript
// 1. 定义建筑物数据结构
interface BuildingData {
    // 建筑物基础信息
    id: string;
    name: string;
    type: 'residential' | 'commercial' | 'industrial';
    
    // 几何信息
    position: [number, number, number];  // 建筑物中心点坐标
    dimensions: {
        width: number;    // 宽度
        length: number;   // 长度
        height: number;   // 高度
    };
    
    // 属性信息
    properties: {
        yearBuilt: number;
        floors: number;
        occupancy: number;
    };
}

// 2. 数据转换函数
function convertBuildingToGridData(buildings: BuildingData[]) {
    const vertices: number[] = [];
    const faces: number[] = [];
    const properties: any[] = [];
    
    buildings.forEach(building => {
        // 计算建筑物的八个顶点
        const { position, dimensions } = building;
        const [x, y, z] = position;
        const { width, length, height } = dimensions;
        
        // 添加顶点
        const baseIndex = vertices.length / 3;
        vertices.push(
            x - width/2, y, z - length/2,    // 0
            x + width/2, y, z - length/2,    // 1
            x + width/2, y, z + length/2,    // 2
            x - width/2, y, z + length/2,    // 3
            x - width/2, y + height, z - length/2,  // 4
            x + width/2, y + height, z - length/2,  // 5
            x + width/2, y + height, z + length/2,  // 6
            x - width/2, y + height, z + length/2   // 7
        );
        
        // 添加面片（三角形）
        faces.push(
            // 底面
            baseIndex, baseIndex + 1, baseIndex + 2,
            baseIndex, baseIndex + 2, baseIndex + 3,
            // 顶面
            baseIndex + 4, baseIndex + 5, baseIndex + 6,
            baseIndex + 4, baseIndex + 6, baseIndex + 7,
            // 侧面
            baseIndex, baseIndex + 1, baseIndex + 5,
            baseIndex, baseIndex + 5, baseIndex + 4,
            baseIndex + 1, baseIndex + 2, baseIndex + 6,
            baseIndex + 1, baseIndex + 6, baseIndex + 5,
            baseIndex + 2, baseIndex + 3, baseIndex + 7,
            baseIndex + 2, baseIndex + 7, baseIndex + 6,
            baseIndex + 3, baseIndex, baseIndex + 4,
            baseIndex + 3, baseIndex + 4, baseIndex + 7
        );
        
        // 添加属性
        properties.push({
            id: building.id,
            type: building.type,
            yearBuilt: building.properties.yearBuilt,
            floors: building.properties.floors,
            occupancy: building.properties.occupancy
        });
    });
    
    return {
        vertices: new Float32Array(vertices),
        faces: new Uint32Array(faces),
        properties: properties
    };
}

// 3. 创建图层
const buildingLayer = new Grid3DLayer({
    id: 'building-layer',
    data: convertBuildingToGridData(buildings),
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

// 4. 使用图层
<SubsurfaceViewer
    layers={[buildingLayer]}
    views={{
        layout: [1, 1],
        viewports: [{
            id: '3d-view',
            type: '3d',
            show3D: true,
            isSync: true
        }]
    }}
    camera={{
        position: [0, 0, 1000],
        target: [0, 0, 0],
        up: [0, 1, 0]
    }}
/>
```

### 1.2 使用自定义图层实现

```typescript
// 1. 定义自定义图层
class CustomBuildingLayer extends CompositeLayer {
    static layerName = 'CustomBuildingLayer';
    
    // 定义图层属性
    static defaultProps = {
        data: { type: 'array', value: [] },
        opacity: { type: 'number', value: 1.0 },
        selectedBuildingId: { type: 'string', value: null },
        onBuildingClick: { type: 'function', value: null }
    };

    initializeState() {
        this.state = {
            // GPU 缓冲区
            buffers: {
                vertex: null,
                normal: null,
                index: null,
                uv: null,
                property: null
            },
            // 着色器程序
            shaderProgram: null,
            // 纹理
            textures: new Map(),
            // 渲染状态
            renderState: null
        };
    }

    updateState({ props, oldProps, changeFlags }) {
        if (changeFlags.dataChanged) {
            this.updateBuffers(props.data);
        }
    }

    // 更新 GPU 缓冲区
    updateBuffers(data: BuildingData[]) {
        const { gl } = this.context;
        
        // 创建顶点缓冲区
        this.state.buffers.vertex = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.buffers.vertex);
        gl.bufferData(gl.ARRAY_BUFFER, this.packVertices(data), gl.STATIC_DRAW);

        // 创建法向量缓冲区
        this.state.buffers.normal = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.buffers.normal);
        gl.bufferData(gl.ARRAY_BUFFER, this.packNormals(data), gl.STATIC_DRAW);

        // 创建索引缓冲区
        this.state.buffers.index = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.state.buffers.index);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.packIndices(data), gl.STATIC_DRAW);

        // 创建属性缓冲区
        this.state.buffers.property = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.buffers.property);
        gl.bufferData(gl.ARRAY_BUFFER, this.packProperties(data), gl.STATIC_DRAW);
    }

    // 渲染图层
    renderLayers() {
        const { gl } = this.context;
        
        // 使用着色器程序
        gl.useProgram(this.state.shaderProgram);
        
        // 设置 uniform 变量
        this.setUniforms();
        
        // 设置顶点属性
        this.setAttributes();
        
        // 绘制
        gl.drawElements(gl.TRIANGLES, this.state.indexCount, gl.UNSIGNED_INT, 0);
    }

    // 设置 uniform 变量
    setUniforms() {
        const { gl } = this.context;
        const program = this.state.shaderProgram;
        
        // 设置变换矩阵
        gl.uniformMatrix4fv(
            gl.getUniformLocation(program, 'modelMatrix'),
            false,
            this.props.modelMatrix
        );
        
        // 设置时间（用于动画）
        gl.uniform1f(
            gl.getUniformLocation(program, 'time'),
            Date.now() * 0.001
        );
        
        // 设置光照参数
        gl.uniform3fv(
            gl.getUniformLocation(program, 'lightPosition'),
            this.props.lightPosition
        );
        
        // 设置选中状态
        gl.uniform1i(
            gl.getUniformLocation(program, 'selectedBuildingId'),
            this.props.selectedBuildingId
        );
    }

    // 设置顶点属性
    setAttributes() {
        const { gl } = this.context;
        const program = this.state.shaderProgram;
        
        // 设置顶点位置
        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.buffers.vertex);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'position'));
        gl.vertexAttribPointer(
            gl.getAttribLocation(program, 'position'),
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        
        // 设置法向量
        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.buffers.normal);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'normal'));
        gl.vertexAttribPointer(
            gl.getAttribLocation(program, 'normal'),
            3,
            gl.FLOAT,
            false,
            0,
            0
        );
        
        // 设置属性
        gl.bindBuffer(gl.ARRAY_BUFFER, this.state.buffers.property);
        gl.enableVertexAttribArray(gl.getAttribLocation(program, 'properties'));
        gl.vertexAttribPointer(
            gl.getAttribLocation(program, 'properties'),
            4,
            gl.FLOAT,
            false,
            0,
            0
        );
    }

    // 处理点击事件
    onClick(info) {
        if (this.props.onBuildingClick) {
            this.props.onBuildingClick(info.object);
        }
    }
}

// 2. 使用自定义图层
<SubsurfaceViewer
    layers={[
        new CustomBuildingLayer({
            id: 'custom-buildings',
            data: buildings,
            selectedBuildingId: selectedId,
            onBuildingClick: (building) => {
                setSelectedId(building.id);
            }
        })
    ]}
    // ... 其他配置
/>
```

## 2. 性能优化示例

### 2.1 视锥体剔除

```typescript
class CustomBuildingLayer extends CompositeLayer {
    // 检查建筑物是否在视锥体内
    isInFrustum(building: BuildingData): boolean {
        const { viewport } = this.context;
        const { position, dimensions } = building;
        
        // 计算建筑物的包围盒
        const boundingBox = {
            min: [
                position[0] - dimensions.width/2,
                position[1],
                position[2] - dimensions.length/2
            ],
            max: [
                position[0] + dimensions.width/2,
                position[1] + dimensions.height,
                position[2] + dimensions.length/2
            ]
        };
        
        // 检查包围盒是否在视锥体内
        return viewport.containsBox(boundingBox);
    }

    // 更新状态时进行视锥体剔除
    updateState({ props, oldProps, changeFlags }) {
        if (changeFlags.dataChanged) {
            // 过滤可见建筑物
            const visibleBuildings = props.data.filter(
                building => this.isInFrustum(building)
            );
            
            // 更新缓冲区
            this.updateBuffers(visibleBuildings);
        }
    }
}
```

### 2.2 LOD（Level of Detail）实现

```typescript
class CustomBuildingLayer extends CompositeLayer {
    // 计算 LOD 级别
    getLODLevel(zoom: number): number {
        if (zoom > 18) return 0;  // 高细节
        if (zoom > 15) return 1;  // 中等细节
        return 2;                 // 低细节
    }

    // 根据 LOD 级别获取建筑物几何数据
    getBuildingGeometry(building: BuildingData, lodLevel: number) {
        switch (lodLevel) {
            case 0:  // 高细节
                return this.getDetailedGeometry(building);
            case 1:  // 中等细节
                return this.getMediumGeometry(building);
            case 2:  // 低细节
                return this.getSimpleGeometry(building);
            default:
                return this.getSimpleGeometry(building);
        }
    }

    // 更新状态时应用 LOD
    updateState({ props, oldProps, changeFlags }) {
        if (changeFlags.dataChanged || changeFlags.viewportChanged) {
            const { viewport } = this.context;
            const lodLevel = this.getLODLevel(viewport.zoom);
            
            // 获取对应 LOD 级别的几何数据
            const geometryData = props.data.map(building => 
                this.getBuildingGeometry(building, lodLevel)
            );
            
            // 更新缓冲区
            this.updateBuffers(geometryData);
        }
    }
}
```

### 2.3 Web Worker 数据处理

```typescript
// 1. 创建 Web Worker
// buildingWorker.ts
self.onmessage = (e) => {
    const { buildings, lodLevel } = e.data;
    
    // 在 Worker 中处理数据
    const processedData = buildings.map(building => ({
        ...building,
        geometry: processBuildingGeometry(building, lodLevel)
    }));
    
    // 返回处理后的数据
    self.postMessage(processedData);
};

// 2. 在图层中使用 Worker
class CustomBuildingLayer extends CompositeLayer {
    processDataInWorker(data: BuildingData[], lodLevel: number) {
        const worker = new Worker('buildingWorker.ts');
        
        worker.postMessage({ data, lodLevel });
        
        worker.onmessage = (e) => {
            const processedData = e.data;
            this.updateBuffers(processedData);
        };
        
        worker.onerror = (error) => {
            console.error('Worker error:', error);
        };
    }

    updateState({ props, oldProps, changeFlags }) {
        if (changeFlags.dataChanged) {
            const { viewport } = this.context;
            const lodLevel = this.getLODLevel(viewport.zoom);
            
            // 使用 Worker 处理数据
            this.processDataInWorker(props.data, lodLevel);
        }
    }
}
```

## 3. 交互优化示例

### 3.1 建筑物选择和高亮

```typescript
class CustomBuildingLayer extends CompositeLayer {
    // 处理点击事件
    onClick(info) {
        if (this.props.onBuildingClick) {
            const building = info.object;
            
            // 更新选中状态
            this.setState({
                selectedBuildingId: building.id
            });
            
            // 触发回调
            this.props.onBuildingClick(building);
        }
    }

    // 在着色器中处理高亮效果
    // fragment.glsl
    void main() {
        vec3 color = baseColor;
        
        // 如果是选中的建筑物，添加高亮效果
        if (buildingId == selectedBuildingId) {
            color = mix(color, vec3(1.0, 1.0, 1.0), 0.3);
        }
        
        fragColor = vec4(color, 1.0);
    }
}
```

### 3.2 建筑物信息展示

```typescript
// 1. 创建信息展示组件
const BuildingInfo = ({ building }) => {
    return (
        <div className="building-info">
            <h3>{building.name}</h3>
            <p>类型: {building.type}</p>
            <p>高度: {building.dimensions.height}m</p>
            <p>楼层数: {building.properties.floors}</p>
            <p>建成年份: {building.properties.yearBuilt}</p>
            <p>入住率: {building.properties.occupancy}%</p>
        </div>
    );
};

// 2. 在图层中使用
class CustomBuildingLayer extends CompositeLayer {
    renderLayers() {
        const layers = [
            // 3D 建筑物图层
            new BuildingMeshLayer({
                // ... 配置
            }),
            
            // 信息展示图层
            new HTMLOverlayLayer({
                id: 'building-info',
                data: this.state.selectedBuilding ? [this.state.selectedBuilding] : [],
                renderSubLayer: (props) => {
                    if (!props.data) return null;
                    return (
                        <BuildingInfo
                            building={props.data}
                            position={this.getScreenPosition(props.data)}
                        />
                    );
                }
            })
        ];
        
        return layers;
    }
}
```

这些示例代码展示了如何：
1. 实现 3D 建筑物的渲染
2. 优化渲染性能
3. 实现交互功能
4. 处理数据
5. 展示信息

每个示例都针对特定的问题提供了解决方案，您可以根据实际需求选择合适的实现方式。 