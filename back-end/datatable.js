const form = document.querySelector(".filter");
const tableBody = document.querySelector(".datatable tbody");
const searchInput = document.querySelector(".search");
const attributeSelect = document.querySelector(".atribut");
const searchGradInput = document.querySelector(".searchGrad");

async function fetchPodatke(search = "", atribut = "svi") {
   const url = new URL("/api/v1/gradovi/filter", window.location.origin);
   url.searchParams.append("search", search);
   url.searchParams.append("atribut", atribut);

   const res = await fetch(url);
   const data = await res.json();
   napraviTablicu(data.response);
}

async function fetchAllPodatke() {
   const url = new URL("/api/v1/gradovi", window.location.origin);

   const res = await fetch(url);
   const data = await res.json();
   napraviTablicu(data.response);
}

function napraviTablicu(data) {
   tableBody.innerHTML = "";
   data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
         <td>${row.ime_zupanije}</td>
         <td>${row.sjediste}</td>
         <td>${row.zupan}</td>
         <td>${row.povrsina_km2}</td>
         <td>${row.broj_stanovnika}</td>
         <td>${row.pozivni_broj}</td>
         <td>${row.dan_zupanije}</td>
         <td>${row.broj_opcina}</td>
         <td>${row.broj_naselja}</td>
         <td>${row.ime_grada}</td>
      `;
      tableBody.appendChild(tr);
   });
}

async function downloadFile(put, search, atribut, ime) {
   try {
      const url = new URL(put, window.location.origin);
      url.searchParams.append("search", search);
      url.searchParams.append("atribut", atribut);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const isJson = ime.endsWith(".json");
      console.log("gnoa");
      const data = isJson ? await res.json() : await res.text();
      console.log("msgoneou");

      const blob = new Blob(
         [isJson ? JSON.stringify(data, null, 2) : data],
         { type: isJson ? "application/json" : "text/csv" }
      );
      
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = ime;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
   } catch (err) {
      console.error("Download failed:", err);
   }
}

async function traziGrad(ime) {
   try {
      const url = new URL(`/api/v1/gradovi/${encodeURIComponent(ime)}`, window.location.origin);
      console.log(url.toString());
      const res = await fetch(url);
      const data = await res.json();
      napraviTablicu(data.response);
   } catch (err) {
      console.error("Traženje grada nije uspjelo:", err);
   }
}

form.addEventListener("submit", e => {
   e.preventDefault();
   const search = searchInput.value.trim();
   const atribut = attributeSelect.value;
   fetchPodatke(search, atribut);
});

document.querySelector(".traziGrad").addEventListener("click", e => {
   e.preventDefault();
   const search = searchGradInput.value.trim();
   console.log("Traži grad:", search);
   traziGrad(search);
});

document.querySelector(".dodajGrad").addEventListener("click", () => {
   window.location.href="dodajGrad.html";
});

document.querySelector(".urediGrad").addEventListener("click", () => {
   window.location.href="urediGrad.html";
});

document.querySelector(".ukloniGrad").addEventListener("click", () => {
   window.location.href="ukloniGrad.html";
});

document.querySelector(".preuzmiJson").addEventListener("click", () => {
   const search = searchInput.value.trim();
   const atribut = attributeSelect.value;
   downloadFile("/api/v1/gradovi/export/json", search, atribut, "filtrirano.json");
});

document.querySelector(".preuzmiCsv").addEventListener("click", () => {
   const search = searchInput.value.trim();
   const atribut = attributeSelect.value;
   downloadFile("/api/v1/gradovi/export/csv", search, atribut, "filtrirano.csv");
});

document.querySelector(".povratak").addEventListener("click", () => {
   window.location.href="index.html";
});

searchGradInput.addEventListener("input", () => {
   const value = searchGradInput.value;
   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
   searchGradInput.value = capitalizedValue;
});

fetchAllPodatke();