// 子线程
;(function hashWorker() {
  self.importScripts('./spark-md5.min.js')
  // 消息监听
  self.onmessage = (e) => {
    const { chunkList } = e.data
    const spark = new self.SparkMD5.ArrayBuffer()
    const loadNextChunk = (i) => {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(chunkList[i].file)
      fileReader.onload = (e) => {
        spark.append(e.target.result)
        if (i < chunkList.length - 1) {
          loadNextChunk(i + 1)
        } else {
          self.postMessage({
            hash: spark.end(),
            chunkList,
          })
          // 关闭线程
          self.close()
        }
      }
    }
    loadNextChunk(0)
  }
})()
