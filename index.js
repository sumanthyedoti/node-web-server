const app = require("./server")
const requestParser = require("./server/pipeline/requestParser")
const bodyParser = require("./server/pipeline/bodyParser")
const staticHandler = require("./server/pipeline/staticHandler")

const port = 3030

app
  .passThrough(requestParser)
  .passThrough(bodyParser)
  .passThrough(staticHandler)
  .start()

app.listen(port)
