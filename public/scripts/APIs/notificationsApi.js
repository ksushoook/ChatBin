class NotificationsApi {
    constructor(func) {
        (async function(){await Notification.requestPermission()})()
        this.openFunc = func
    }
    notification(owner, text, img){
        console.log(arguments)
        const nf = new Notification(`${owner}`, {
            body: text,
            icon: img
        });
        nf.onclick = this.openFunc
        console.log(nf)
    }
}
const notificationsApi = new NotificationsApi(()=>window.focus())