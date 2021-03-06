const app = require("./server")
const requestParser = require("./server/pipeline/requestParser")
const cookieParser = require("./server/pipeline/cookieParser")
const bodyParser = require("./server/pipeline/bodyParser")
const staticHandler = require("./server/pipeline/staticHandler")
const { router, routeHandler } = require("./server/pipeline/routeHandler")

const {
  getTodos,
  getTodo,
  postTodo,
  updateTodo,
  deleteTodo,
  uploadFile,
} = require("./controllers")

const port = 3030

app
  .passThrough(requestParser)
  .passThrough(cookieParser)
  .passThrough(bodyParser)
  .passThrough(staticHandler)
  .passThrough(routeHandler)
  .start()

router.get("/todos", getTodos)
router.get("/todos/:id", getTodo)
router.post("/todos", postTodo)
router.put("/todos/:id", updateTodo)
router.delete("/todos/:id", deleteTodo)

router.post("/upload", uploadFile)

app.listen(port)
