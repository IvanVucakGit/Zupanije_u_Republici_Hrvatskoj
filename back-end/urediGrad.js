const form = document.querySelector(".uredi-forma");
const imeGradaStaroInput = document.querySelector("#ime_grada_staro");
const imeGradaNovoInput = document.querySelector("#ime_grada_novo");

form.addEventListener("submit", async (e) => {
   e.preventDefault();
   const ime_grada_staro = imeGradaStaroInput.value.trim();
   const ime_grada_novo = imeGradaNovoInput.value.trim();
   try {
      const res = await fetch(`/api/v1/gradovi/${encodeURIComponent(ime_grada_staro)}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ ime_grada_novo })
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
   } catch (err) {
      console.error("Ažuriranje grada nije uspjelo:", err);
   }
});

imeGradaStaroInput.addEventListener("input", () => {
   const value = imeGradaStaroInput.value;
   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
   imeGradaStaroInput.value = capitalizedValue;
});

imeGradaNovoInput.addEventListener("input", () => {
   const value = imeGradaNovoInput.value;
   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
   imeGradaNovoInput.value = capitalizedValue;
});

document.querySelector(".natrag").addEventListener("click", () => {
   window.location.href = "datatable.html";
});