function parserRequest(data) {
  const request = { headers: {} }
  const requestData = data
    .toString("utf8")
    .split("\r\n")
    .filter((s) => s !== "")

  const [firstLine, ...headers] = requestData
  const [method, uri, httpv = "HTTP/1.1"] = firstLine.split(" ")
  request["method"] = method
  request["uri"] = uri.slice(-1) === "/" ? uri + "index.html" : uri
  request["httpv"] = httpv
  for (let h of headers) {
    const [key, value] = h.split(": ")
    request.headers[key.toLowerCase()] = value
  }
  return request
}

module.exports = {
  parserRequest,
}
