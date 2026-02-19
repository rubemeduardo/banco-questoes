document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

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
          <label class="alternativa">
            <input type="radio" name="questao-${q.id}" value="${letra}">
            <span><strong>${letra})</strong> ${texto}</span>
          </label>
        `).join("")}
      </div>

      <button class="btn-responder" onclick="responder(${q.id}, '${q.gabarito}', this)">
        Responder
      </button>

      <div class="resultado"></div>
    `;

    container.appendChild(questao);
  });
}

function responder(id, gabarito, botao) {
  const questao = botao.closest(".questao");
  const alternativas = questao.querySelectorAll(
    `input[name="questao-${id}"]`
  );

  let selecionada = null;

  alternativas.forEach(opcao => {
    if (opcao.checked) {
      selecionada = opcao.value;
    }
  });

  const resultado = questao.querySelector(".resultado");

  if (!selecionada) {
    resultado.innerHTML =
      "<span style='color:orange'>Selecione uma alternativa.</span>";
    return;
  }

  questao.dataset.status = "respondida";

  if (selecionada === gabarito) {
    resultado.innerHTML =
      "<span style='color:green;font-weight:bold'>✔ Resposta correta</span>";
  } else {
    resultado.innerHTML =
      `<span style='color:red;font-weight:bold'>✘ Incorreta. Gabarito: ${gabarito}</span>`;
  }
}

/* =========================
   FILTROS (MANTIDOS)
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
