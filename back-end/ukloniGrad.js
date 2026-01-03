const form = document.querySelector(".ukloni-forma");
const imeGradaInput = document.querySelector("#ime_grada");

form.addEventListener("submit", async (e) => {
   e.preventDefault();
   const ime_grada = imeGradaInput.value.trim();
   try {
      const res = await fetch(`/api/v1/gradovi/${encodeURIComponent(ime_grada)}`, {
         method: "DELETE"
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
   } catch (err) {
      console.error("Uklanjanje grada nije uspjelo:", err);
   }
});

imeGradaInput.addEventListener("input", () => {
   const value = imeGradaInput.value;
   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
   imeGradaInput.value = capitalizedValue;
});

document.querySelector(".natrag").addEventListener("click", () => {
   window.location.href = "datatable.html";
});