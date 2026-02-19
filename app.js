document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

/* ================================
   CARREGAMENTO DAS QUESTÕES
================================ */
async function carregarQuestoes() {
  try {
    const response = await fetch("questoes.json");
    const data = await response.json();
    const questoes = Array.isArray(data) ? data : data.questoes;

    const container = document.getElementById("questoes");
    container.innerHTML = "";

    questoes.forEach(q => {
      const div = document.createElement("div");
      div.className = "questao";

      div.innerHTML = `
        <div class="meta"><strong>Questão ${q.id}</strong></div>

        <div class="enunciado">${q.enunciado}</div>

        <div class="alternativas">
          ${Object.entries(q.alternativas).map(([letra, texto]) => `
            <div class="alternativa">
              <span><strong>${letra})</strong> ${texto}</span>
            </div>
          `).join("")}
        </div>
      `;

      container.appendChild(div);
    });

  } catch (erro) {
    console.error("Erro ao carregar questões:", erro);
  }
}

/* ================================
   FUNÇÕES PLACEHOLDER (EVITAM ERRO)
================================ */
function aplicarMarcacao(cor) {
  // função será implementada depois
  console.log("Marcação selecionada:", cor);
}

function filtrarQuestoes(tipo) {
  // função será implementada depois
  console.log("Filtro:", tipo);
}
