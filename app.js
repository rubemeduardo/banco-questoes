document.addEventListener("DOMContentLoaded", () => {
  carregarQuestoes();
});

// Palavras-chave que serão destacadas no enunciado
const PALAVRAS_CHAVE = [
  "Lei de Responsabilidade Fiscal",
  "LRF",
  "receita",
  "despesa",
  "orçamento",
  "calamidade pública",
  "pessoal",
  "gabarito",
  "percentual",
  "limite",
  "classificação",
  "investimento",
  "transferência",
  "corrente",
  "capital"
];

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

      const enunciadoDestacado = destacarPalavras(q.enunciado);

      questaoDiv.innerHTML = `
        <div class="cabecalho-questao">
          <span class="id-questao">Questão ${q.id}</span>
          <span class="marcar-errada" title="Marcar para revisão">✖</span>
        </div>

        <p class="enunciado"><strong>${enunciadoDestacado}</strong></p>

        <div class="alternativas">
          ${Object.values(q.alternativas)
            .map((texto, index) => {
              const letra = ["A", "B", "C", "D", "E"][index];
              return `
                <div class="alternativas">
                  ${Object.entries(q.alternativas).map(([letra, texto]) => `
                    <div class="alternativa">
                      <input type="radio" name="questao-${q.id}" value="${letra}">
                      <span class="texto"><strong>${letra})</strong> ${texto}</span>
                      <span class="btn-x" onclick="toggleTachado(this)">✖</span>
                    </div>
                  `).join("")}
                </div>
              `;
            }).join("")}
        </div>

        <button class="btn-responder" onclick="responder(${q.id}, '${q.gabarito}')">
          Responder
        </button>

        <div class="resultado" id="resultado-${q.id}"></div>
      `;

      // Evento do X
      questaoDiv.querySelector(".marcar-errada").addEventListener("click", () => {
        questaoDiv.classList.toggle("questao-tachada");
      });

      container.appendChild(questaoDiv);
    });

  } catch (erro) {
    console.error("Erro ao carregar questões:", erro);
  }
}

function responder(idQuestao, gabarito) {
  const alternativas = document.getElementsByName(`questao-${idQuestao}`);
  let selecionada = null;

  alternativas.forEach(opcao => {
    if (opcao.checked) selecionada = opcao.value;
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

// Destaque de palavras-chave
function destacarPalavras(texto) {
  let resultado = texto;
  PALAVRAS_CHAVE.forEach(palavra => {
    const regex = new RegExp(`\\b(${palavra})\\b`, "gi");
    resultado = resultado.replace(regex, `<mark>$1</mark>`);
  });
  return resultado;
}
function toggleTachado(botaoX) {
  botaoX.closest(".alternativa").classList.toggle("tachada");
}


