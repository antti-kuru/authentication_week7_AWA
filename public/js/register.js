const initRegister = () => {
    document.getElementById("registerForm").addEventListener("submit", (event) => {
        fetchData(event)
    })
}



const fetchData = async (event) => {
    event.preventDefault()

    const formData = {
        email: event.target.email.value,
        password: event.target.password.value
    }

    try{

        const res = await fetch("/api/user/register", {
            method: "POST",
            headers: { "content-type": "application/json"},
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        console.log(data)

        window.location.href="login.html"


    } catch(error) {
        console.log(error)
    }


}



initRegister()