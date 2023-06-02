class Message {
    constructor(text, owner, type='msg') {
        this.type = type
        this.text = text
        this.owner = owner
        this.isThisUser = this.owner === currentUser
    }

    render() {
        const parentClassList = [
            "container-fluid",
            "d-flex",
            `justify-content-${this.type === "msg" ?
                this.isThisUser ?
                    "end" :
                    "start"
                : "center"}`,
            "px-0",
            "message",
            this.isThisUser ? "message-y" : "message-ny"
        ];
        const messageTextClassList = [
            "text-brake",
            `${this.isThisUser ? "bg-primary" : "bg-secondary"}`,
            'rounded',
            'p-3',
            'py-2',
            `${this.type !== "msg" ? "py-1 rounded-pill" : ""}`
        ];
        const el = document.createElement('div');
        el.classList.add(...parentClassList)
        el.innerHTML = `
                <div
                    style="max-width: 90%;"
                    class='d-flex align-items-center flex-row${this.isThisUser ? "-reverse" : ""}'
                >
                    ${
                        this.type === "msg" ?
                            `<div class="d-flex flex-column align-items-center user__info">
                                <img
                                    src="${randomImgAPI.picsum(this.owner)}"
                                    alt=""
                                    class="rounded mx-2 mx-md-4"
                                >
                                <span> ${this.owner} </span>
                            </div>` : ""
                    }
                    <div
                        class='${messageTextClassList.join(" ")}'
                        style='--bs-bg-opacity: 0.4'
                    >
                        ${this.text}
                    </div>
                </div>
            `;
        msgContainer.append(el)
        el.scrollIntoView({behavior: "smooth", block: "end"})
        return this
    }
    notify(text){
        if(document.hasFocus())
            return this
        if(this.owner===null){
            notificationsApi.notification(
                "ChatBin",
                text,
                // './../../imgs/favicon.svg'
                `${location.origin}/imgs/favicon.svg`
                // `https://raw.githubusercontent.com/ksushoook/ChatBin/main/public/imgs/favicon.svg`
            )
            return this
        }
        if(!this.isThisUser)
            notificationsApi.notification(
                this.owner,
                this.text,
                randomImgAPI.picsum(this.owner)
            )

        return this
    }
}