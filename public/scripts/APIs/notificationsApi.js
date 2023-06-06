class NotificationsApi {
    constructor(func) {
        (async function(){await Notification.requestPermission()})()
        this.openFunc = func
    }
    notification(owner, text, img){
        const nf = new Notification(`${owner}`, {
            body: text,
            icon: img,
            badge: img,
            image: img,
            data: {
                url: location.toString(),
                status: "open",
            },
        });
        nf.onclick = this.openFunc
    }
}
const notificationsApi = new NotificationsApi(()=>window.focus())