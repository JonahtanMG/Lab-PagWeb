document.querySelector(".login form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = e.target.querySelector('input[type="text"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nombre: usuario,
            password: password
        })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Bienvenido " + data.user.nombre);
    } else {
        alert(data.error);
    }
});