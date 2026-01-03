const form = document.querySelector(".dodaj-forma");
const imeGradaInput = document.querySelector("#ime_grada");
const imeZupanijeInput = document.querySelector("#ime_zupanije");

form.addEventListener("submit", async (e) => {
   e.preventDefault();
   const ime_grada = imeGradaInput.value.trim();
   const ime_zupanije = imeZupanijeInput.value;
   try {
      const res = await fetch("/api/v1/gradovi", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ ime_grada, ime_zupanije })
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
   } catch (err) {
      console.error("Dodavanje grada nije uspjelo:", err);
   }
});

imeZupanijeInput.addEventListener("input", () => {
   const value = imeZupanijeInput.value;
   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
   imeZupanijeInput.value = capitalizedValue;
});

imeGradaInput.addEventListener("input", () => {
   const value = imeGradaInput.value;
   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
   imeGradaInput.value = capitalizedValue;
});

document.querySelector(".natrag").addEventListener("click", () => {
   window.location.href = "datatable.html";
});

async function ucitajZupanije() {
   try {
      const url = new URL("/api/v1/zupanije", window.location.origin);

      const res = await fetch(url);

      const data = await res.json();
      const zupanije = data.response;

      imeZupanijeInput.innerHTML = "";

      zupanije.forEach(z => {
         const option = document.createElement("option");
         option.value = z.ime_zupanije;
         option.textContent = z.ime_zupanije;
         imeZupanijeInput.appendChild(option);
      });
   } catch (err) {
      console.error(err);
   }
}

ucitajZupanije();