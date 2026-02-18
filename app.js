document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("questoes");
  if (!container) {
    alert("Erro: div #questoes não encontrada");
    return;
  }

  fetch("questoes.json")
    .then(res => res.json())
    .then(questoes => {
      questoes.forEach(q => {
        const div = document.createElement("div");
        div.className = "questao";

        div.innerHTML = `
          <div class="meta">
            <strong>${q.area}</strong> | ${q.tema}<br>
            Ano: ${q.ano} | Banca: ${q.banca} | Órgão: ${q.orgao}
          </div>

          <div class="enunciado">${q.enunciado}</div>

          ${Object.entries(q.alternativas).map(([l, t]) => `
            <div class="alternativa">
              <strong>${l})</strong> ${t}
            </div>
          `).join("")}
        `;

        container.appendChild(div);
      });
    })
    .catch(err => {
      alert("Erro ao carregar questões");
      console.error(err);
    });

});
