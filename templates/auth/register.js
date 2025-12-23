document.querySelector(".register form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = e.target.querySelectorAll("input");
    const nombre = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;

    const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            email,
            password
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Registro exitoso");
        window.location.href = "login.html";
    } else {
        alert(data.error);
    }
});