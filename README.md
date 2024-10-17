# BigFileUpload

A Demo for Handling Large File Uploads using JavaScript and Node.js

## 技术栈

- Node.js Express + 原生 JS
- HTML5 Fetch API

## 启动

```
## 前端
npm i serve -g
serve

## 后端
node ./server.js 或者 nodemon ./server.js
```

## 基础功能

- 基于 WebWorker 的多线程计算 hash
- 基于`spark-md5`的文件 hash 计算
- 基于`fetch`的分片上传
- 断点续传
- 秒传
- fetch 请求并发数量控制

## 待优化

- 由于是基于`fetch`的分片上传，所以没有做上传进度的显示
- 为了处理`spark-md5`计算大文件的 `hash` 速度慢的问题，暂时采用部分文件切片`chunk`参与计算,可能结果不准
- 暂时没有考虑断网、刷新页面等异常情况
