window.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("/api/v1/user");
    const data = await res.json();
    const user = data.user;

    if (!user) {
        console.error("Niste ulogirani");
        window.location.href = "/index.html";
    } else {
        const avatar = document.querySelector(".avatar");
        const name = document.querySelector(".name");
        const email = document.querySelector(".email");
        const natrag = document.querySelector(".natrag");

        avatar.src = user.picture;
        name.textContent = user.nickname;
        email.textContent = user.email;

        natrag.onclick = () => {
            window.location.href = "/index.html";
        };
    }
});