const socket = io()

const msgForm = document.getElementById("msg")
msgForm.addEventListener("submit", send)
const h3 = document.querySelector("h3")

socket.on('connect', () => {
    console.log("접속됨")
    socket.emit("enter", "room")
})

socket.on('welcome', (ip, newCount) => {
    h3.innerText = `현재 접속 인원 ${newCount}`
    const ul = document.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = `${ip} 님이 접속하셨습니다.`
    ul.append(li)
})

socket.on('update', (message) => {
    const ul = document.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = message
    ul.append(li)
})

socket.on('bye', (ip, newCount) => {
    h3.innerText = `현재 접속 인원 ${newCount}`
    const ul = document.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = `${ip} 님이 나가셨습니다.`
    ul.append(li)
})
  
//메시지 전송 함수
function send(event) {
    event.preventDefault()
    const input = msgForm.querySelector("input")
    const message = input.value
    const ul = document.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = message
    ul.append(li)

    socket.emit('message', message)

    input.value = ''
}