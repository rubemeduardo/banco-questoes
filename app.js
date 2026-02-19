document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

/* ======================
   PROGRESSO DO USUÁRIO
====================== */
const PROGRESSO_KEY = "progressoQuestoes";

function obterProgresso() {
  return JSON.parse(localStorage.getItem(PROGRESSO_KEY)) || {};
}

function salvarProgresso(idQuestao, status) {
  const progresso = obterProgresso();
  progresso[idQuestao] = status; // correta | errada
  localStorage.setItem(PROGRESSO_KEY, JSON.stringify(progresso));
}

/* ======================
   CARREGAR QUESTÕES
====================== */
async function carregarQuestoes() {
  try {
    const response = await fetch("questoes.json");
    const data = await response.json();
    const questoes = Array.isArray(data) ? data : data.questoes || [];

    const progresso = obterProgresso();
    const container = document.getElementById("questoes");
    container.innerHTML = "";

    questoes.forEach(q => {
      const questaoDiv = document.createElement("div");
      questaoDiv.className = "questao";

      if (progresso[q.id] === "correta") {
        questaoDiv.classList.add("questao-correta");
      }

      if (progresso[q.id] === "errada") {
        questaoDiv.classList.add("questao-errada");
      }

      questaoDiv.innerHTML = `
        <div class="cabecalho-questao">
          <span class="id-questao">Questão ${q.id}</span>
        </div>

        <p class="enunciado"><strong>${q.enunciado}</strong></p>

        <div class="alternativas">
          ${Object.entries(q.alternativas).map(([letra, texto]) => `
            <div class="alternativa">
              <input type="radio" name="questao-${q.id}" value="${letra}">
              <span class="texto"><strong>${letra})</strong> ${texto}</span>
              <span class="btn-x" onclick="toggleTachado(this)">✖</span>
            </div>
          `).join("")}
        </div>

        <button class="btn-responder" onclick="responder(${q.id}, '${q.gabarito}')">
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

/* ======================
   RESPONDER QUESTÃO
====================== */
function responder(idQuestao, gabarito) {
  const alternativas = document.getElementsByName(`questao-${idQuestao}`);
  let selecionada = null;

  alternativas.forEach(opcao => {
    if (opcao.checked) selecionada = opcao.value;
  });

  const resultadoDiv = document.getElementById(`resultado-${idQuestao}`);
  const questaoDiv = resultadoDiv.closest(".questao");

  if (!selecionada) {
    resultadoDiv.innerHTML =
      "<span style='color: orange;'>Selecione uma alternativa.</span>";
    return;
  }

  if (selecionada === gabarito) {
    resultadoDiv.innerHTML =
      "<span style='color: green;'>✔ Resposta correta</span>";

    questaoDiv.classList.add("questao-correta");
    questaoDiv.classList.remove("questao-errada");

    salvarProgresso(idQuestao, "correta");
  } else {
    resultadoDiv.innerHTML =
      "<span style='color: red;'>✘ Resposta incorreta</span>";

    questaoDiv.classList.add("questao-errada");
    questaoDiv.classList.remove("questao-correta");

    salvarProgresso(idQuestao, "errada");
  }
}

/* ======================
   TACHAR ALTERNATIVA
====================== */
function toggleTachado(botaoX) {
  botaoX.closest(".alternativa").classList.toggle("tachada");
}

/* ======================
   FILTROS
====================== */
function filtrarQuestoes(tipo) {
  const progresso = obterProgresso();
  const questoes = document.querySelectorAll(".questao");

  questoes.forEach(q => {
    const id = q.querySelector(".id-questao").textContent.replace("Questão ", "");
    const respondida = progresso[id];

    if (tipo === "todas") q.style.display = "block";
    if (tipo === "respondidas") q.style.display = respondida ? "block" : "none";
    if (tipo === "nao") q.style.display = respondida ? "none" : "block";
  });
}
