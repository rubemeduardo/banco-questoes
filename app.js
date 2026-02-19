document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

/* =========================
   CARREGAMENTO DAS QUESTÕES
========================= */
async function carregarQuestoes() {
  const response = await fetch("questoes.json");
  const data = await response.json();
  const questoes = Array.isArray(data) ? data : data.questoes;

  const container = document.getElementById("questoes");
  container.innerHTML = "";

  questoes.forEach(q => {
    const questao = document.createElement("div");
    questao.className = "questao";
    questao.dataset.status = "nao";

    questao.innerHTML = `
      <div class="meta"><strong>Questão ${q.id}</strong></div>

      <div class="enunciado">${q.enunciado}</div>

      <div class="alternativas">
        ${Object.entries(q.alternativas).map(([letra, texto]) => `
          <div class="alternativa"
               data-letra="${letra}"
               onclick="selecionarAlternativa(this)">
            <span class="texto"><strong>${letra})</strong> ${texto}</span>
            <span class="btn-x" onclick="event.stopPropagation();toggleTachado(this)">✖</span>
          </div>
        `).join("")}
      </div>

      <button class="btn-responder" onclick="responderQuestao(this, '${q.gabarito}')">
        Responder
      </button>

      <div class="resultado"></div>
    `;

    container.appendChild(questao);
  });
}

/* =========================
   SELEÇÃO DE ALTERNATIVA
========================= */
function selecionarAlternativa(div) {
  const alternativas = div.parentElement.querySelectorAll(".alternativa");
  alternativas.forEach(a => a.classList.remove("selecionada"));
  div.classList.add("selecionada");
}

/* =========================
   RESPONDER QUESTÃO
========================= */
function responderQuestao(botao, gabarito) {
  const questao = botao.closest(".questao");
  const selecionada = questao.querySelector(".alternativa.selecionada");
  const resultado = questao.querySelector(".resultado");

  if (!selecionada) {
    resultado.innerHTML =
      "<span style='color:orange'>Selecione uma alternativa.</span>";
    return;
  }

  const letra = selecionada.dataset.letra;
  questao.dataset.status = "respondida";

  questao.querySelectorAll(".alternativa").forEach(a => {
    a.classList.remove("correta", "errada");
    if (a.dataset.letra === gabarito) {
      a.classList.add("correta");
    } else if (a === selecionada) {
      a.classList.add("errada");
    }
  });

  if (letra === gabarito) {
    resultado.innerHTML =
      "<span style='color:green;font-weight:bold'>✔ Resposta correta</span>";
  } else {
    resultado.innerHTML =
      `<span style='color:red;font-weight:bold'>✘ Incorreta. Gabarito: ${gabarito}</span>`;
  }
}

/* =========================
   TACHAR ALTERNATIVA
========================= */
function toggleTachado(botaoX) {
  botaoX.closest(".alternativa").classList.toggle("tachada");
}

/* =========================
   FILTROS
========================= */
function filtrarQuestoes(tipo) {
  document.querySelectorAll(".questao").forEach(q => {
    if (tipo === "todas") q.style.display = "block";
    else if (tipo === "respondidas")
      q.style.display = q.dataset.status === "respondida" ? "block" : "none";
    else if (tipo === "nao")
      q.style.display = q.dataset.status === "nao" ? "block" : "none";
  });
}

/* =========================
   MARCAÇÃO LIVRE DE TEXTO
========================= */
function aplicarMarcacao(cor) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement("span");
  span.className = `highlight-${cor}`;
  range.surroundContents(span);

  selection.removeAllRanges();
}
