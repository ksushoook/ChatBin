require("dotenv").config()

const PORT = process.env.PORT || 3000

const path = require("path")
const express = require("express")
const expApp = express()
const corsAllOrigins = require("cors")({origin: true})
expApp.use(corsAllOrigins)
expApp.use(express.static(path.join(__dirname, 'public')))
const httpApp = require("http").Server(expApp)
const io = require("socket.io")(httpApp, {
    cors: {
        origin: "*",
        credentials: true
    }
});

const chats = {} // Map

expApp.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
expApp.get("/newchat", (req, res) => {
    function randomLetter() {
        const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters[Math.floor(Math.random()*letters.length)];
    }
    let newChat = ""
    for (let i=0; i<5; i++)
        newChat += randomLetter()

    chats[newChat] = new Set()
    console.log(`\n ---> new chat chats[${newChat}], inited by ${req.ip}`)
    res.redirect(`/${newChat}`)
})
expApp.get("/:chat", (req, res) => {
    if(!chats.hasOwnProperty(req.params.chat)){
        res.statusCode = 404
        res.sendFile(path.join(__dirname, 'public', '404.html'))
        return
    }

    res.sendFile(path.join(__dirname, 'public', 'chat.html'))
})
expApp.get("/:chat/users", (req, res) => {
    res.write(JSON.stringify([...chats[req.params.chat]]))
    res.end()
})
expApp.get("/:chat/check", (req, res) => {
    const absUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    const nameToCheck = absUrl.searchParams.get("name")
    const chatToCheck = chats[req.params.chat]
    res.statusCode = chatToCheck.has(nameToCheck) ? 401 : 200
    res.send()
})

io.on("connection", (socket) => {
    console.log(`\ns ->\tcreating socket(${socket.id}) - ${new Date().toUTCString()}`);

    let clientName = ""
    let clientChat = ""

    socket.on("trying-to-connect", (chat) => {
        socket.join(chat)
        socket.to(chat).emit("client-trying-to-connect")
        clientChat = chat
    })

    socket.on("user-connect", (user) => {
        if(chats[clientChat].hasOwnProperty(user)){
            socket.emit("client-user-already-exists")
            return
        }
        clientName = user
        chats[clientChat].add(clientName)
        socket.to(clientChat).emit("client-user-connect", clientName)
        socket.emit("client-user-connect", clientName)
    })

    socket.on("message", (text, owner) => {
        socket.to(clientChat).emit("client-message", text, owner)
        socket.emit("client-message", text, owner)
    })

    socket.on("disconnecting", () => {
        if(io.sockets.adapter.rooms.get(clientChat)?.size === 1) {
            console.log(`\n -x-> removed chat chats[${clientChat}]`)
            delete chats[clientChat]
            return
        }

        chats[clientChat]?.delete(clientName)

        socket.to(clientChat).emit("user-disconnect", clientName)
        console.log(`\n -x-> discocnnecting socket(${socket.id}) - ${new Date().toUTCString()}`)
    })
})

httpApp.listen(PORT, ()=>console.log(`listening on ${PORT}\n!!! CHANGE HOST IN chat.html ('<UR IP>') !!!`))
