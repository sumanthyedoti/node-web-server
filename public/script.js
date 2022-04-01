const body = document.querySelector("body")
const openButton = document.querySelector(".opener")
const bottle = document.querySelector(".bottle")
const bottleWrapper = document.querySelector(".bottle-wrapper")
const cap = document.querySelector(".bottle__cap")
const capWrapper = document.querySelector(".cap-wrapper")

const handleOpen = () => {
  cap.classList.add("rotate-cap")
  capWrapper.classList.add("move-cap")
  bottle.classList.add("rotate-bottle")
  bottleWrapper.classList.add("shake-bottle")
  setTimeout(() => {
    body.innerHTML = ""
    body.classList.add("ketchup-bg")
  }, 11000)
}
openButton.addEventListener("click", handleOpen)
