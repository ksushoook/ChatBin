let currentListDisplay = "none"
class UserListEl {
    constructor(name) {
        this.name = name
        this.container = document.querySelector("#user-list")
    }
    render() {
        const el = document.createElement("div")
        el.id = `${this.name}`
        el.classList.add("d-flex", "justify-content-end", "align-items-center")
        el.innerHTML = `
            <span
                class="pe-2"
                style="display: ${currentListDisplay}"
            > ${this.name} </span>
            <img
                src="${hashMapApi.link(this.name)}"
                alt="${this.name}"
                class="rounded rounded-circle bg-light my-1"
            >
        `;
        this.container.appendChild(el)
        return this
    }
}
document.querySelector("#user-list")
    .addEventListener("click", () => {
        currentListDisplay = currentListDisplay === "none" ? "inline" : "none"
        document.querySelectorAll("#user-list span")
            .forEach(el => el.style.display = currentListDisplay)
    })
