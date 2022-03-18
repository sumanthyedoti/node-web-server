const body = document.querySelector("body")
const openButton = document.querySelector(".opener")
const bottle = document.querySelector(".bottle")

const handleOpen = () => {
    openButton.classList.add("hide")
    bottle.classList.add("hide")
    body.classList.add("ketchup-bg")
}
openButton.addEventListener("click", handleOpen)