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
   MARCAÇÃO LIVRE DE TEXTO
================================ */
function aplicarMarcacao(cor) {
  const selecao = window.getSelection();

  if (!selecao || selecao.rangeCount === 0) return;

  const range = selecao.getRangeAt(0);

  if (range.collapsed) return; // nada selecionado

  const span = document.createElement("span");

  if (cor === "yellow") span.className = "highlight-yellow";
  if (cor === "green") span.className = "highlight-green";
  if (cor === "blue") span.className = "highlight-blue";

  span.appendChild(range.extractContents());
  range.insertNode(span);

  // limpa a seleção
  selecao.removeAllRanges();
}

/* ================================
   PLACEHOLDERS (não quebram HTML)
================================ */
function filtrarQuestoes(tipo) {
  console.log("Filtro:", tipo);
}
