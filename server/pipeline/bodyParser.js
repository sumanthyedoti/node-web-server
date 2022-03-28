const fs = require("fs")
const mime = require("mime")

const { parseQuery } = require("../../utils")
const { status } = require("../../config")

const contentTypes = {
  json: "application/json",
  formURLEncoded: "application/x-www-form-urlencoded",
  multipartForm: "multipart/form-data",
}

const SIZE_LIMIT = 100000000

function bodyParser(req, res, next) {
  const contentType = req.headers["content-type"]
  if (!req.headers["content-length"] || !contentType || !req.data.body) {
    delete req.buffer.body
    next()
    return false
  }
  const size = parseInt(req.headers["content-length"])
  if (size > SIZE_LIMIT) {
    res.writeHead(400)
    res.end()
    return false
  }
  if (contentType === contentTypes.json) {
    req.body = JSON.parse(req.buffer.body.toString())
  } else if (contentType === contentTypes.formURLEncoded) {
    req.body = parseQuery(req.buffer.body.toString())
  } else if (contentType === contentTypes.multipartForm) {
  } else {
    const extension = mime.getExtension(contentType)
    const year = new Date().getFullYear()
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0")
    const date = new Date().getDate().toString().padStart(2, "0")
    const fileName = `${year}-${month}-${date}-${Date.now()}.${extension}`
    fs.createWriteStream(`uploads/${fileName}`).write(req.buffer.body)
    res.uploadedFileName = fileName
    res.statusCode = 201
  }
  delete req.buffer.body
  next()
}

module.exports = bodyParser
