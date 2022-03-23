const fs = require("fs")
const status = require("./status")
const path = require("path")
const mime = require("mime")

const staticFiles = (dirName) => (fileName) =>
  path.resolve(__dirname, dirName, fileName)

const public = staticFiles("public")

function getHeaders(headers) {
  return {
    Server: "nws",
    Date: new Date().toString().slice(0, 28),
    "Accept-Ranges": "bytes",
    ...headers,
  }
}

let getStatusLine = ({ code: statusCode, message, httpv = "HTTP/1.1" }) =>
  `${httpv} ${statusCode} ${message}\r\n`
let getRangeBytes = (range) => {
  return range
    .replace(/bytes=/, "")
    .split("-")
    .filter((r) => r !== "")
    .map(parseInt)
}

function getHead(status, headers) {
  function getHeadersResponse(headers) {
    const headersResponse = Object.keys(headers).reduce(
      (acc, key) => acc + `${key}: ${headers[key]}\r\n`,
      ""
    )
    return headersResponse + "\r\n"
  }
  const allHeaders = getHeaders(headers)
  return getStatusLine(status) + getHeadersResponse(allHeaders)
}

function sendResponce(socket, request) {
  const fileName = public(request.pathname.slice(1))
  if (!fs.existsSync(fileName)) {
    socket.end(getStatusLine(status.notFound))
    return false
  }
  const fileExtention = fileName.split(".").slice(-1)[0]
  fs.stat(fileName, (err, stats) => {
    if (err) {
      console.error(err)
    } else {
      const isRange = !!request.headers.range
      const [start, end = stats.size - 1] = isRange
        ? getRangeBytes(request.headers.range)
        : [0, stats.size - 1]
      let headers = {}
      headers = getHeaders({
        "Content-Type": mime.getType(fileExtention),
        "Content-Length": end - start + 1,
      })
      if (isRange) {
        headers = getHeaders({
          ...headers,
          "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        })
      }
      socket.write(
        getHead(isRange ? status.partialContent : status.ok, headers)
      )
      var fileReadStream = fs.createReadStream(fileName, {
        start: start,
        end: end,
      })
      console.log(fileName, stats.size, end - start + 1)
      fileReadStream
        .pipe(socket)
        .on("end", () => {
          let isKeepAlive =
            (conn = request.headers.connection) && conn == "keep-alive"
              ? true
              : false
          isKeepAlive ? socket.end() : null
        })
        .on("error", function (err) {
          console.log("error at file-read-stream\n", err)
          socket.end()
        })
    }
  })
}

module.exports = {
  sendResponce,
}
