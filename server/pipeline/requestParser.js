const URL = require("url")

const { parseQuery } = require("../../utils")

function requestParser(req, res_, next) {
  req.headers = {}
  const [firstLine, ...headers] = req.data.head.toString().split("\r\n")
  const [method, uri, httpv = "HTTP/1.1"] = firstLine.split(" ")
  const parsedURL = URL.parse(uri)
  req["method"] = method
  req["httpv"] = httpv
  req["uri"] = uri
  req["pathname"] = parsedURL.pathname.replace(/\/$/, "/index.html")
  req["query"] = parseQuery(parsedURL.query)
  for (let h of headers) {
    const [key, value] = h.split(": ")
    req.headers[key.toLowerCase()] = value
  }
  delete req.data.head
  next()
}

module.exports = requestParser
