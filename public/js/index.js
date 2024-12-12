const checkValidation = async () => {
    
    const token = localStorage.getItem("token")

    if(!token) {
        window.location.href="login.html"
        return
    }

    const res = await fetch("/api/private" , {
        method: "get",
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (!res.ok) {
        document.getElementById("error").textContent = "ERROR"
    } else {
         document.getElementById("success").textContent = "Authorization succesful"

         const container = document.getElementById("container")

         const btn = document.createElement("button")
         btn.setAttribute("id", "logout")
         btn.classList.add("btn", "waver-effect", "waves-light", "center-align")
         btn.textContent = "Logout"
         container.appendChild(btn)

         btn.addEventListener("click", () => {
            localStorage.removeItem("token")
            window.location.href="login.html"

        })
    }
}



checkValidation()

