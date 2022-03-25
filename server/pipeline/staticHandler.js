const fs = require("fs")
const mime = require("mime")

const { status, public_folder } = require("../../config")
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
  const fileName = public(req.pathname.slice(1))
  if (!fs.existsSync(fileName)) {
    res.status = status.notFound
    next()
    return false
  }
  const fileExtention = fileName.split(".").slice(-1)[0]
  fs.stat(fileName, (err, stats) => {
    if (err) {
      console.error(err)
    } else {
      const isRange = !!req.headers.range
      const [start, end = stats.size - 1] = isRange
        ? getRangeBytes(req.headers.range)
        : [0, stats.size - 1]
      let headers = {}
      headers = {
        "Content-Type": mime.getType(fileExtention),
        "Content-Length": end - start + 1,
      }
      if (isRange) {
        headers = {
          ...headers,
          "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        }
      }
      res.writeHead(isRange ? 206 : 200, headers)
      var fileReadStream = fs.createReadStream(fileName, {
        start: start,
        end: end,
      })
      fileReadStream
        .pipe(res.socket)
        .on("end", () => {
          let isKeepAlive =
            (conn = req.headers.connection) && conn == "keep-alive"
              ? true
              : false
          isKeepAlive ? res.socket.end() : null
        })
        .on("error", function (err) {
          console.log("error at file-read-stream\n", err)
          next()
        })
    }
  })
}

module.exports = staticHandler
