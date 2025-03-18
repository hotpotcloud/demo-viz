# Webviz Subsurface Components 项目分析

## 1. 项目概述

`webviz-subsurface-components` 是一个用于地下数据可视化的组件库，支持 TypeScript (React) 和 Python (Dash) 两种开发方式。

### 1.1 主要功能组件
- Subsurface Viewer：2D和3D地下数据空间可视化
- Well Log Viewer：井日志轨迹可视化
- Well Completions Plot：井完井时间步可视化
- Group Tree Plot：流量树可视化

### 1.2 技术栈
- 核心框架：React 17/18
- 开发语言：TypeScript
- UI 框架：Material-UI (@mui/material)
- 构建工具：Webpack
- 包管理：npm/yarn
- 测试框架：Jest + Cypress
- 文档工具：Storybook

## 2. 项目架构

### 2.1 目录结构
```
typescript/
├── packages/           # 组件包目录
│   ├── subsurface-viewer/    # 地下数据可视化
│   ├── well-log-viewer/      # 井日志查看器
│   ├── well-completions-plot/# 井完井图表
│   ├── group-tree-plot/      # 组树图表
│   └── wsc-common/           # 公共组件和工具
├── .storybook/        # Storybook 配置
├── cypress/           # 端到端测试
└── config/           # 项目配置
```

### 2.2 核心模块
- layers/：各种数据层的实现
- views/：视图管理
- viewports/：视口控制
- hooks/：React Hooks
- redux/：状态管理
- utils/：工具函数
- extensions/：扩展功能

## 3. 开发规范

### 3.1 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 TypeScript 进行类型检查
- 遵循 Conventional Commits 规范

### 3.2 测试规范
- 单元测试：使用 Jest
- 端到端测试：使用 Cypress
- 视觉测试：使用 cypress-image-diff-js
- 组件测试：使用 @testing-library/react

### 3.3 文档规范
- 使用 Storybook 进行组件文档编写
- 使用 MDX 编写文档
- 需要为每个组件提供使用示例

## 4. 开发流程

### 4.1 环境要求
- Node.js >= 14.17
- npm >= 6.14
- 推荐使用 Node.js 18.19.0（通过 Volta 配置）

### 4.2 开发命令
- `npm run storybook`：启动 Storybook 开发环境
- `npm run validate`：运行代码验证
- `npm run typecheck`：运行类型检查
- `npm run lint`：运行代码检查
- `npm run format`：格式化代码
- `npm run cy:run`：运行 Cypress 测试

## 5. 提交规范

### 5.1 Git 工作流
- 使用 "fork-and-pull" 工作流
- 使用 husky 进行 Git hooks 管理
- 遵循 Conventional Commits 规范

### 5.2 PR 检查清单
- 代码符合项目规范
- 所有测试通过
- PR 标题遵循 Conventional Commits 规范
- 新 API 有文档说明
- 新功能或 bug 修复有相应的 Story
- 新代码有测试覆盖 