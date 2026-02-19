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

        <p class="enunciado">${q.enunciado}</p>

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

function renderizarAlternativas(q) {
  return Object.entries(q.alternativas)
    .map(([letra, texto]) => `
      <div class="alternativa"
           data-letra="${letra}"
           onclick="selecionarAlternativa(this)">
        <span class="texto"><strong>${letra})</strong> ${texto}</span>
        <span class="marcar-errada" onclick="toggleTachado(event, this)">✖</span>
      </div>
    `)
    .join("");
}

/* ===== SELEÇÃO VISUAL ===== */
function selecionarAlternativa(div) {
  const container = div.closest(".alternativas");
  container.querySelectorAll(".alternativa").forEach(a => {
    a.classList.remove("selecionada");
  });
  div.classList.add("selecionada");
}

/* ===== RESPONDER ===== */
function responder(idQuestao, gabarito) {
  const questaoDiv = document.querySelector(
    `.questao:has(.alternativas .alternativa[data-questao="${idQuestao}"])`
  );

  const alternativaSelecionada = questaoDiv.querySelector(
    ".alternativa.selecionada"
  );

  const resultadoDiv = document.getElementById(`resultado-${idQuestao}`);

  if (!alternativaSelecionada) {
    resultadoDiv.innerHTML =
      "<span style='color: orange;'>Selecione uma alternativa.</span>";
    return;
  }

  const letra = alternativaSelecionada.dataset.letra;

  if (letra === gabarito) {
    alternativaSelecionada.classList.add("correta");
    resultadoDiv.innerHTML =
      "<span style='color: green; font-weight: bold;'>✔ Resposta correta</span>";
  } else {
    alternativaSelecionada.classList.add("errada");
    resultadoDiv.innerHTML =
      `<span style='color: red; font-weight: bold;'>✘ Resposta incorreta. Gabarito: ${gabarito}</span>`;
  }
}


  const letra = questao.dataset.letra;

  if (letra === gabarito) {
    questao.classList.add("correta");
    resultadoDiv.innerHTML =
      "<span style='color: green; font-weight: bold;'>✔ Resposta correta</span>";
  } else {
    questao.classList.add("errada");
    resultadoDiv.innerHTML =
      `<span style='color: red; font-weight: bold;'>✘ Resposta incorreta. Gabarito: ${gabarito}</span>`;
  }
}

/* ===== TACHAR ALTERNATIVA ===== */
function toggleTachado(event, botao) {
  event.stopPropagation();
  botao.closest(".alternativa").classList.toggle("tachada");
}

