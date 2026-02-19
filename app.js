document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

/* =======================
   CARREGAR QUESTÕES
======================= */

async function carregarQuestoes() {
  const response = await fetch("questoes.json");
  const data = await response.json();
  const questoes = Array.isArray(data) ? data : data.questoes;

  const container = document.getElementById("questoes");
  container.innerHTML = "";

  questoes.forEach(q => {
    const div = document.createElement("div");
    div.className = "questao";

    div.innerHTML = `
      <p class="enunciado"><strong>${q.enunciado}</strong></p>

      <div class="alternativas">
        ${renderizarAlternativas(q)}
      </div>

      <button onclick="responder(${q.id}, '${q.gabarito}')">
        Responder
      </button>

      <div class="resultado" id="resultado-${q.id}"></div>
    `;

    container.appendChild(div);
  });
}

/* =======================
   ALTERNATIVAS
======================= */

function renderizarAlternativas(q) {
  return Object.entries(q.alternativas)
    .map(([letra, texto]) => `
      <div class="alternativa"
           data-questao="${q.id}"
           data-letra="${letra}"
           onclick="selecionarAlternativa(this)">
        <span class="texto"><strong>${letra})</strong> ${texto}</span>
        <span class="marcar-errada" onclick="toggleTachado(event, this)">✖</span>
      </div>
    `).join("");
}

function selecionarAlternativa(el) {
  const questao = el.dataset.questao;
  document
    .querySelectorAll(`.alternativa[data-questao="${questao}"]`)
    .forEach(a => a.classList.remove("selecionada"));

  el.classList.add("selecionada");
}

/* =======================
   RESPONDER
======================= */

function responder(idQuestao, gabarito) {
  const selecionada = document.querySelector(
    `.alternativa[data-questao="${idQuestao}"].selecionada`
  );

  const resultado = document.getElementById(`resultado-${idQuestao}`);

  if (!selecionada) {
    resultado.innerHTML = "⚠ Selecione uma alternativa.";
    return;
  }

  if (selecionada.dataset.letra === gabarito) {
    selecionada.classList.add("correta");
    resultado.innerHTML = "✔ Resposta correta";
  } else {
    selecionada.classList.add("errada");
    resultado.innerHTML = `✘ Resposta incorreta. Gabarito: ${gabarito}`;
  }
}

/* =======================
   TACHAR ALTERNATIVA
======================= */

function toggleTachado(event, botao) {
  event.stopPropagation();
  botao.closest(".alternativa").classList.toggle("tachada");
}

/* =======================
   MARCAÇÃO LIVRE
======================= */

document.addEventListener("keydown", function (e) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  let classe = null;

  if (e.altKey && e.key === "1") classe = "highlight-yellow";
  if (e.altKey && e.key === "2") classe = "highlight-green";
  if (e.altKey && e.key === "3") classe = "highlight-blue";

  if (!classe) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  span.className = classe;

  range.surroundContents(span);
  selection.removeAllRanges();
});
