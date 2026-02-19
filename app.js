document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

async function carregarQuestoes() {
  try {
    const response = await fetch("questoes.json");
    const data = await response.json();

    // Caso o JSON venha em lote { lote:..., questoes: [...] }
    const questoes = Array.isArray(data) ? data : data.questoes || [];

    const container = document.getElementById("questoes");
    container.innerHTML = "";

    questoes.forEach(q => {
      const questaoDiv = document.createElement("div");
      questaoDiv.className = "questao";

      questaoDiv.innerHTML = `
        <div class="cabecalho-questao">
          <span class="id-questao">Questão ${q.id}</span>
        </div>

        <p class="enunciado"><strong>${q.enunciado}</strong></p>

        <div class="alternativas">
          ${Object.entries(q.alternativas).map(([letra, texto]) => `
            <label class="alternativa">
              <input type="radio" name="questao-${q.id}" value="${letra}">
              <span><strong>${letra})</strong> ${texto}</span>
            </label>
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
    document.getElementById("questoes").innerHTML =
      "<p>Erro ao carregar as questões.</p>";
  }
}

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
    resultadoDiv.innerHTML = "<span style='color: orange;'>Selecione uma alternativa.</span>";
    return;
  }

  if (selecionada === gabarito) {
    resultadoDiv.innerHTML = "<span style='color: green; font-weight: bold;'>✔ Resposta correta</span>";
  } else {
    resultadoDiv.innerHTML = `<span style='color: red; font-weight: bold;'>✘ Resposta incorreta. Gabarito: ${gabarito}</span>`;
  }
}
