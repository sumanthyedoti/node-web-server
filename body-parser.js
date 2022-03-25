const fs = require("fs")
const mime = require("mime")

const { parseQuery } = require("./utils")
const { status } = require("./config")

const contentTypes = {
  json: "application/json",
  formURLEncoded: "application/x-www-form-urlencoded",
  multipartForm: "multipart/form-data",
}

function bodyParser(data, request, response) {
  console.log({ request })
  const contentType = request.headers["content-type"]
  if (!request.headers["content-length"] || !contentType) {
    request.isQueryParsed = false
    return false
  }
  if (contentType === contentTypes.json) {
    request.body = JSON.parse(data)
  } else if (contentType === contentTypes.formURLEncoded) {
    request.body = parseQuery(data)
  } else if (contentType === contentTypes.multipartForm) {
  } else {
    const extension = mime.getExtension(contentType)
    const fileName = `${Date.now()}.${extension}`
    fs.createWriteStream(`uploads/${fileName}`).write(data)
    response.uploadedFileName = fileName
    response.status = status["201"]
  }
  request.isQueryParsed = true
}

module.exports = bodyParser
