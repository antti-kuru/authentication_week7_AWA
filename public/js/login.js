

const initLogin = () => {
    document.getElementById("loginForm").addEventListener("submit", (event) => {
        fetchData(event)
    })
}



fetchData = async (event) => {
    event.preventDefault()



    
    const formData = {
        email: event.target.email.value,
        password: event.target.password.value
    }

    try{

        const res = await fetch("/api/user/login", {
            method: "POST",
            headers: { "content-type": "application/json"},
            body: JSON.stringify(formData)
        })

        const data = await res.json()
        
        if(data.token){
            localStorage.setItem("token", data.token)
            window.location.href="/"
            console.log(data)
        }


    } catch(error) {
        console.log(error)
    }
}









initLogin()