class RandomImageAPI{
    constructor() {
        this.host = "https://readyyyk-randimgapi.onrender.com/"
        
    }
    urlParams(seed, w, h){
        return `seed=${encodeURIComponent(seed)}&w=${encodeURIComponent(w)}&h${encodeURIComponent(h)}`
    }
    hashMap(seed, w=7, h=7){
        return `${this.host}/hashMap?${this.urlParams(seed, w, h)}`
    }
    picsum(seed, w=64, h=64){
        return `${this.host}/picsum?${this.urlParams(seed, w, h)}`
    }
}

const randomImgApi = new RandomImageAPI()
