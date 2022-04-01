const fs = require("fs")
const mime = require("mime")

const { public_folder } = require("../../config")
const { staticFiles } = require("../../utils")

const public = staticFiles(public_folder)

let getRangeBytes = (range) => {
  return range
    .replace(/bytes=/, "")
    .split("-")
    .filter((r) => r !== "")
    .map(parseInt)
}

function staticHandler(req, res, next) {
  if (req.method !== "GET") {
    next()
    return
  }
  const fileName = public(req.pathname.slice(1))
  const fileExtention = fileName.split(".").slice(-1)[0]
  fs.exists(fileName, (isExists) => {
    if (!isExists) {
      // res.send404() // ! dont end the pipelines
      next()
      return false
    }
    fs.stat(fileName, (err, stats) => {
      if (err) {
        console.error(err)
      } else {
        const isRange = !!req.headers.range
        const [start, end = stats.size - 1] = isRange
          ? getRangeBytes(req.headers.range)
          : [0, stats.size - 1]
        // ! do const
        const headers = {
          "Content-Type": mime.getType(fileExtention),
          "Content-Length": end - start + 1,
        }
        if (isRange) {
          headers["Content-Range"] = `bytes ${start}-${end}/${stats.size}`
        }
        res.writeHead(isRange ? 206 : 200, headers)
        const fileReadStream = fs.createReadStream(fileName, {
          start: start,
          end: end,
        })
        fileReadStream
          .pipe(res.socket)
          .on("end", () => {
            res.end()
          })
          .on("error", function (err) {
            console.log("error at file-read-stream\n", err)
          })
      }
    })
  })
}

module.exports = staticHandler
