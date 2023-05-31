class HashMapApi{
    constructor() {
        this.host = "https://picsum.photos"
    }
    link(seed, w=64, h=64){
        return `${this.host}/seed/${seed}/${w}/${h}`
    }
}

const hashMapApi = new HashMapApi()
