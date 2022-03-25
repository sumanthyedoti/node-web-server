const path = require("path")

function parseQuery(query) {
  if (!query) return {}
  const queryList = query
    .split("&")
    .map(decodeURIComponent)
    .map((query) => query.split("="))
  return queryList.reduce(
    (queries, q) => ((queries[q[0]] = q[1] || null), queries),
    {}
  )
}

const staticFiles = (pathToFile) => (fileName) =>
  path.resolve(__dirname, pathToFile, fileName)

module.exports = {
  parseQuery,
  staticFiles,
}
