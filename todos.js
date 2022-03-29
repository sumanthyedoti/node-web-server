const sampleTodo = {
  id: Date.now(),
  completed: false,
  text: "This a sample todo, please ignore or delete it!",
}

const todos = {
  [sampleTodo.id]: sampleTodo,
}

module.exports = todos
