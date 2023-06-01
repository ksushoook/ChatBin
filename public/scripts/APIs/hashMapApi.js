class HashMapApi{
    constructor() {
        this.host = "https://hashmaps-sk9g.onrender.com/picsum"
    }
    link(seed, w=64, h=64){
        return `${this.host}?seed=${encodeURIComponent(seed)}`
    }
}

const hashMapApi = new HashMapApi()
