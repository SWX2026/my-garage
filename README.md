# 我的车库

一个可部署到 GitHub Pages 的移动端优先车辆管理网页，使用 React + Vite + Tailwind CSS 构建，不需要后端服务器，数据保存到浏览器 LocalStorage。

## 功能

- 汽车 / 摩托车 Tab
- 车辆列表展示、搜索、详情查看
- 添加、编辑、删除车辆
- 上传车辆图片、上传品牌 Logo
- 图片本地预览，并转 Base64 保存到 LocalStorage
- 常用车、认证状态展示
- 保险 / 年检快到期提醒
- 底部固定“添加车辆”按钮

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打包：

```bash
npm run build
```

## GitHub Pages 部署步骤

1. 创建 GitHub 仓库，例如 `my-garage`。

2. 修改部署配置：

   - 将 `package.json` 里的 `homepage` 改成：

```json
"homepage": "https://你的用户名.github.io/my-garage/"
```

   - 如果仓库名不是 `my-garage`，同步修改 `vite.config.js`：

```js
base: '/你的仓库名/',
```

3. 初始化 Git 并推送代码：

```bash
git init
git add .
git commit -m "init my garage app"
git branch -M main
git remote add origin https://github.com/你的用户名/my-garage.git
git push -u origin main
```

4. 安装 `gh-pages`：

```bash
npm install gh-pages --save-dev
```

本项目的 `package.json` 已经包含：

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

5. 部署：

```bash
npm run deploy
```

6. 打开访问链接：

```text
https://你的用户名.github.io/my-garage/
```

如果页面没有立即出现，在 GitHub 仓库的 `Settings -> Pages` 中确认部署分支为 `gh-pages`。
