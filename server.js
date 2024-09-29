const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs-extra')
const multer = require('multer')

const app = express()
app.use(cors())

// 配置文件存储位置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync('uploads')
    }
    cb(null, dir)
  },
  // filename: (req, file, cb) => {
  //   cb(null, file.name)
  // },
})

const upload = multer({ storage })

// 文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  const { fileName, fileHash, index, totalChunks } = req.body
  if (!fileName) {
    return res.status(400).send('文件名缺失')
  }
  const tempPath = path.resolve('uploads', `${fileHash}-${index}`)

  if (!fs.existsSync(tempPath)) {
    fs.moveSync(req.file.path, tempPath)
  } else {
    // fs.removeSync(req.file.path)
  }
  res.send({
    code: '200',
    msg: '上传成功',
    success: true,
  })
})

// 合并切片
app.get('/mergeChunks', (req, res) => {
  const { fileName } = req.query
  // 最终合成的文件路径
  const filePath = path.resolve('uploads', fileName)
  const tempPath = path.resolve('uploads')
  const chunkPaths = fs.readdirSync(tempPath)
  // 先排序,再进行拼接,否则会导致切片文件顺序错乱
  chunkPaths.sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]))
  chunkPaths.forEach((chunkName) => {
    // 单个切片的路径
    const chunkFullPath = path.resolve(tempPath, chunkName)
    fs.appendFileSync(filePath, fs.readFileSync(chunkFullPath))
    // 删除切片
    fs.removeSync(chunkFullPath)
  })
  res.send({
    code: '200',
    msg: '合并成功',
    success: true,
  })
})

// 秒传校验
app.get('/verify', (req, res) => {
  const { fileHash } = req.query
  const filePath = path.resolve('uploads', fileHash)
  if (fs.existsSync(filePath)) {
    res.send({
      code: '200',
      msg: '文件已存在',
      success: true,
    })
  } else {
    res.send({
      code: '400',
      msg: '文件不存在',
      success: false,
    })
  }
})

app.listen(8000, () => {
  console.log('app is listening on port 8000!')
})
