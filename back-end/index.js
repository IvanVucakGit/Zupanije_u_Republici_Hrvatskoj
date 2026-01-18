document.querySelector(".pregled").addEventListener("click", () => {
   window.location.href="datatable.html";
});

document.querySelector(".racun").addEventListener("click", () => {
   window.location.href = "/profile.html";
});

window.addEventListener("DOMContentLoaded", async () => {
   const res = await fetch("/api/v1/user");
   const data = await res.json();

   const loginBtn = document.querySelector(".prijava");

   if (data.isAuthenticated) {
      loginBtn.textContent = "Odjava";
      loginBtn.onclick = () => {
         window.location.href = "/logout";
      };
   } else {
      loginBtn.textContent = "Prijava";
      loginBtn.onclick = () => {
         window.location.href = "/login";
      };

      document.querySelector(".racun").style.display = "none";
      document.querySelector(".osvjezi").style.display = "none";
   }
});

document.querySelector(".osvjezi").addEventListener("click", async () => {
   try {
      const res = await fetch("/api/v1/zupanije/datoteke", { method: "PUT" });
   } catch (err) {
      console.error(err);
   }
});