document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

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
        <div class="meta">
          <strong>Questão ${q.id}</strong>
        </div>

        <p class="enunciado">
          ${q.enunciado}
        </p>

        <div class="alternativas">
          ${renderizarAlternativas(q)}
        </div>

        <button onclick="responder(${q.id}, '${q.gabarito}')">
          Responder
        </button>

        <div class="resultado" id="resultado-${q.id}"></div>
      `;

      container.appendChild(questaoDiv);
    });

  } catch (erro) {
    console.error("Erro ao carregar questões:", erro);
  }
}

/* ===== RENDERIZA ALTERNATIVAS (A–E / A–D / C/E) ===== */
function renderizarAlternativas(q) {
  return Object.entries(q.alternativas)
    .map(([letra, texto]) => {
      return `
        <div class="alternativa">
          <input type="radio" name="questao-${q.id}" value="${letra}">
          <span class="texto"><strong>${letra})</strong> ${texto}</span>
          <span class="marcar-errada" onclick="toggleTachado(this)">✖</span>
        </div>
      `;
    })
    .join("");
}

/* ===== RESPONDER ===== */
function responder(idQuestao, gabarito) {
  const alternativas = document.getElementsByName(`questao-${idQuestao}`);
  let selecionada = null;

  alternativas.forEach(opcao => {
    if (opcao.checked) {
      selecionada = opcao.value;
    }
  });

  const resultadoDiv = document.getElementById(`resultado-${idQuestao}`);

  if (!selecionada) {
    resultadoDiv.innerHTML =
      "<span style='color: orange;'>Selecione uma alternativa.</span>";
    return;
  }

  if (selecionada === gabarito) {
    resultadoDiv.innerHTML =
      "<span style='color: green; font-weight: bold;'>✔ Resposta correta</span>";
  } else {
    resultadoDiv.innerHTML =
      `<span style='color: red; font-weight: bold;'>✘ Resposta incorreta. Gabarito: ${gabarito}</span>`;
  }
}

/* ===== TACHAR ALTERNATIVA ===== */
function toggleTachado(botaoX) {
  const alternativa = botaoX.closest(".alternativa");
  alternativa.classList.toggle("tachada");
}
