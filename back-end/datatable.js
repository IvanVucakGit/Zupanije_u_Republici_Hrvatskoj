const form = document.querySelector(".filter");
const tableBody = document.querySelector(".tablica tbody");
const searchInput = document.querySelector(".search");
const attributeSelect = document.querySelector(".atribut");

async function fetchPodatke(search = "", atribut = "svi") {
  const url = new URL("/api", window.location.origin);
  url.searchParams.append("search", search);
  url.searchParams.append("atribut", atribut);

  const res = await fetch(url);
  const data = await res.json();
  napraviTablicu(data);
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
    const data = isJson ? await res.json() : await res.text();

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
    alert("Greška pri preuzimanju datoteke: " + err.message);
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const search = searchInput.value.trim();
  const atribut = attributeSelect.value;
  fetchPodatke(search, atribut);
});

document.querySelector(".preuzmiJson").addEventListener("click", () => {
  const search = searchInput.value.trim();
  const atribut = attributeSelect.value;
  downloadFile("/api", search, atribut, "filtrirano.json");
});

document.querySelector(".preuzmiCsv").addEventListener("click", () => {
  const search = searchInput.value.trim();
  const atribut = attributeSelect.value;
  downloadFile("/api/csv", search, atribut, "filtrirano.csv");
});

document.querySelector(".povratak").addEventListener("click", () => {
  window.location.href="index.html";
});

fetchPodatke();
