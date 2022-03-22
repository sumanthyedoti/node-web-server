var URL = require("url")

function parseQuery(query) {
  if (!query) return {}
  const queryList = query.split("&").map((query) => query.split("="))
  return queryList.reduce(
    (queries, q) => ((queries[q[0]] = q[1] || null), queries),
    {}
  )
}

function parserRequest(data) {
  const request = { headers: {} }
  const [head, body] = data.toString("utf8").split("\r\n\r\n")
  request.body = body
  const [firstLine, ...headers] = head.split("\r\n")
  const [method, uri, httpv = "HTTP/1.1"] = firstLine.split(" ")
  const parsedURL = URL.parse(uri)
  request["method"] = method
  request["httpv"] = httpv
  request["pathname"] = parsedURL.pathname.replace(/\/$/, "/index.html")
  request["query"] = parseQuery(parsedURL.query)
  for (let h of headers) {
    const [key, value] = h.split(": ")
    request.headers[key.toLowerCase()] = value
  }
  return request
}

module.exports = {
  parserRequest,
}
