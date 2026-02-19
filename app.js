document.addEventListener("DOMContentLoaded", carregarQuestoes);

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
      <div class="meta">Questão ${q.id}</div>

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

/* ===== Alternativas com letras garantidas ===== */

function renderizarAlternativas(q) {
  const letras = ["A", "B", "C", "D", "E"];

  return Object.values(q.alternativas).map((texto, i) => `
    <div class="alternativa"
         data-questao="${q.id}"
         data-letra="${letras[i]}"
         onclick="selecionarAlternativa(this)">
      <span class="texto"><strong>${letras[i]})</strong> ${texto}</span>
      <span class="marcar-errada" onclick="toggleTachado(event, this)">✖</span>
    </div>
  `).join("");
}

function selecionarAlternativa(el) {
  const id = el.dataset.questao;
  document
    .querySelectorAll(`.alternativa[data-questao="${id}"]`)
    .forEach(a => a.classList.remove("selecionada"));

  el.classList.add("selecionada");
}

/* ===== Correção ===== */

function responder(id, gabarito) {
  const selecionada = document.querySelector(
    `.alternativa[data-questao="${id}"].selecionada`
  );

  const resultado = document.getElementById(`resultado-${id}`);

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

/* ===== X para tachar ===== */

function toggleTachado(e, el) {
  e.stopPropagation();
  el.closest(".alternativa").classList.toggle("tachada");
}

/* ===== MARCAÇÃO LIVRE (FUNCIONA DE VERDADE) ===== */

document.addEventListener("keydown", function (e) {
  if (!e.altKey) return;

  let cor = null;
  if (e.key === "1") cor = "highlight-yellow";
  if (e.key === "2") cor = "highlight-green";
  if (e.key === "3") cor = "highlight-blue";

  if (!cor) return;

  document.execCommand("hiliteColor", false,
    cor === "highlight-yellow" ? "#fff59d" :
    cor === "highlight-green"  ? "#c8e6c9" :
                                 "#bbdefb"
  );
});
