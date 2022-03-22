const fs = require("fs")
var url = require("url")
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
    ...headers,
  }
}

let getStatusLine = ({ code: statusCode, message, httpv = "HTTP/1.1" }) =>
  `${httpv} ${statusCode} ${message}\r\n`

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
      let headers = getHeaders({
        "Content-Type": mime.getType(fileExtention),
        "Content-Length": stats.size,
      })
      socket.write(getHead(status, headers))
      const fileReadStream = fs.createReadStream(fileName)
      fileReadStream.pipe(socket).on("end", () => {
        let isKeepAlive =
          request.headers.connection &&
          request.headers.connection == "keep-alive"
            ? true
            : false
        isKeepAlive ? socket.end() : null
      })
    }
  })
}

module.exports = {
  sendResponce,
}
