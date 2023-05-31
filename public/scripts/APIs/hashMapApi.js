class HashMapApi{
    constructor() {
        this.host = "http://167.172.179.35:3001/picsum"
    }
    link(seed, w=64, h=64){
        return `${this.host}?seed=${encodeURIComponent(seed)}`
    }
}

const hashMapApi = new HashMapApi()
