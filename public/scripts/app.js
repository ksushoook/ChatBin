const socket = io(location.host);
const currentChat = location.pathname.slice(1);

document.title = "ChatBin - " + currentChat

let currentUser = "";

socket.emit("trying-to-connect", currentChat)

const modalElement = document.querySelector('#modal')
const modal = new bootstrap.Modal(modalElement)
modalElement.addEventListener('shown.bs.modal', () => {
    form.uname.focus()
})
modal.show()

const form = document.forms[0]
form.addEventListener("submit", (e) => {
    e.preventDefault()
    fetch(location + `/check?name=` + encodeURIComponent(form.uname.value))
        .then((res) => {
            if (res.ok) {
                currentUser = form.uname.value
                fetch(location + `/users`)
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        data?.forEach(el =>
                            new UserListEl(el).render()
                        )
                        msgInput.focus()
                    })
                socket.emit("user-connect", currentUser)
                modal.hide()
            } else {
                document.querySelector("#form-tooltip").classList.remove("hidden")
            }
        })
})

const
    msgContainer = document.querySelector("#msg-container"),
    submitButton = document.querySelector("#submitButton"),
    msgInput = document.querySelector("#text-input")

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        submitButton.click()
})
submitButton.addEventListener("click", () => {
    if (!msgInput.value)
        return false
    socket.emit("message", msgInput.value, currentUser)
    msgInput.value = ""
    return true
})


// source: Message.js  =>  class Message

// source: UserListEl.js  =>  class UserListEl


const toast = new bootstrap.Toast(document.querySelector("#toast"))
socket.on("client-trying-to-connect", () =>
    toast.show()
)
socket.on("client-user-connect", (e) => {
    toast.hide()
    new Message(`
            <u><b>${e}</b></u>
            <img
                src="${hashMapApi.link(e)}"
                alt=""
                class="mx-2" height="24px" width="24px"
            />
            connected
        `,
        null,
        "connection"
    ).render().notify(`${e} connected`)
    if (e !== currentUser)
        new UserListEl(e).render()
})
socket.on("user-disconnect", (e) => {
    new Message(`
        <u><b>${e}</b></u>
        <img
            src="${hashMapApi.link(e)}"
            alt=""
            class="mx-2"
            height="24px"
            width="24px"
        >
        disconnected
    `,
    null,
    "connection"
    ).render().notify(`${e} disconnected`)

    document.querySelector(`#user-list #${e}`).remove()
})

socket.on("client-message", (text, owner) =>
    new Message(text, owner).render().notify()
)
