const perfil = localStorage.getItem("perfil");

if (!perfil) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

/* ============================
   CARREGAMENTO DAS QUESTÕES
============================ */
async function carregarQuestoes() {
  try {
    const response = await fetch("questoes.json");
    const data = await response.json();
    const questoes = Array.isArray(data) ? data : data.questoes || [];

    const container = document.getElementById("questoes");
    container.innerHTML = "";

    questoes.forEach(q => {
      const questaoDiv = document.createElement("div");
      questaoDiv.className = "questao";

      questaoDiv.innerHTML = `
        <div class="meta"><strong>Questão ${q.id}</strong></div>

        <p class="enunciado"><strong>${q.enunciado}</strong></p>

        <div class="alternativas">
          ${Object.entries(q.alternativas).map(([letra, texto]) => `
            <div class="alternativa" 
                 data-letra="${letra}" 
                 data-questao="${q.id}">
              <span class="texto"><strong>${letra})</strong> ${texto}</span>
              <span class="btn-x" title="Marcar como errada">✖</span>
            </div>
          `).join("")}
        </div>

        <button onclick="responder(${q.id}, '${q.gabarito}')">
          Responder
        </button>

        <div class="resultado" id="resultado-${q.id}"></div>
      `;

      container.appendChild(questaoDiv);
    });

    ativarEventosAlternativas();

  } catch (erro) {
    console.error("Erro ao carregar questões:", erro);
    document.getElementById("questoes").innerHTML =
      "<p>Erro ao carregar as questões.</p>";
  }
}

/* ============================
   SELEÇÃO DE ALTERNATIVAS
============================ */
function ativarEventosAlternativas() {
  document.querySelectorAll(".alternativa").forEach(alt => {

    // Seleção da alternativa
    alt.addEventListener("click", e => {
      if (e.target.classList.contains("btn-x")) return;

      const questaoId = alt.dataset.questao;
      document
        .querySelectorAll(`.alternativa[data-questao="${questaoId}"]`)
        .forEach(a => a.classList.remove("selecionada"));

      alt.classList.add("selecionada");
    });

    // X para tachar alternativa
    const btnX = alt.querySelector(".btn-x");
    btnX.addEventListener("click", e => {
      e.stopPropagation();
      alt.classList.toggle("tachada");
    });
  });
}

/* ============================
   CORREÇÃO DA QUESTÃO
============================ */
function responder(idQuestao, gabarito) {
  const alternativas = document.querySelectorAll(
    `.alternativa[data-questao="${idQuestao}"]`
  );

  let selecionada = null;

  alternativas.forEach(alt => {
    if (alt.classList.contains("selecionada")) {
      selecionada = alt;
    }
    alt.classList.remove("correta", "incorreta");
  });

  const resultadoDiv = document.getElementById(`resultado-${idQuestao}`);

  if (!selecionada) {
    resultadoDiv.innerHTML =
      "<span style='color: orange;'>Selecione uma alternativa.</span>";
    return;
  }

  const letra = selecionada.dataset.letra;

  if (letra === gabarito) {
    selecionada.classList.add("correta");
    resultadoDiv.innerHTML =
      "<span style='color: green; font-weight: bold;'>✔ Resposta correta</span>";
  } else {
    selecionada.classList.add("incorreta");

    alternativas.forEach(alt => {
      if (alt.dataset.letra === gabarito) {
        alt.classList.add("correta");
      }
    });

    resultadoDiv.innerHTML =
      `<span style='color: red; font-weight: bold;'>
        ✘ Resposta incorreta. Gabarito: ${gabarito}
      </span>`;
  }
}

/* ============================
   MARCAÇÃO LIVRE DE TEXTO
   Alt + 1 (amarelo)
   Alt + 2 (verde)
   Alt + 3 (azul)
============================ */
document.addEventListener("keydown", function (e) {
  if (!e.altKey) return;

  let classe = null;
  if (e.key === "1") classe = "highlight-yellow";
  if (e.key === "2") classe = "highlight-green";
  if (e.key === "3") classe = "highlight-blue";

  if (!classe) return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement("span");
  span.className = classe;

  try {
    range.surroundContents(span);
  } catch {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  }

  selection.removeAllRanges();
});

