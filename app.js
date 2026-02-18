// ===============================
// CONTROLE DE MARCAÇÃO DE TEXTO
// ===============================
let corAtual = "highlight-yellow";

function setCor(cor) {
  corAtual = cor;
}

function marcarPalavra() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement("span");
  span.className = corAtual;
  span.style.padding = "2px 4px";
  span.style.borderRadius = "4px";

  range.surroundContents(span);
  selection.removeAllRanges();
}

// ===============================
// CARREGAMENTO DAS QUESTÕES
// ===============================
fetch("questoes.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Não foi possível carregar questoes.json");
    }
    return response.json();
  })
  .then(questoes => {
    const container = document.getElementById("questoes");

    questoes.forEach((q, index) => {
      const questaoDiv = document.createElement("div");
      questaoDiv.className = "questao";

      questaoDiv.innerHTML = `
        <div class="meta">
          <strong>${q.area}</strong> | ${q.tema}<br>
          Ano: ${q.ano} | Banca: ${q.banca} | Órgão: ${q.orgao}
        </div>

        <div class="enunciado">
          ${q.enunciado}
        </div>

        <div class="toolbar">
          <span onclick="setCor('highlight-yellow')">🟨</span>
          <span onclick="setCor('highlight-green')">🟩</span>
          <span onclick="setCor('highlight-blue')">🟦</span>
          <span onclick="marcarPalavra()">✏️</span>
        </div>

        <div class="alternativas">
          ${Object.entries(q.alternativas).map(([letra, texto]) => `
            <div class="alternativa" data-opcao="${letra}">
              <span onclick="event.stopPropagation(); this.parentElement.classList.toggle('errada')">❌</span>
              <strong>${letra})</strong> ${texto}
            </div>
          `).join("")}
        </div>

        <button onclick="responder(this, '${q.gabarito}')">Responder</button>

        <div class="section"><strong>Fonte:</strong> ${q.fonte_gabarito || "—"}</div>
        <div class="section"><strong>Comentário do administrador:</strong> ${q.comentario_admin || "—"}</div>

        <div class="section">
          <strong>Comentário do usuário:</strong>
          <textarea placeholder="Digite sua anotação pessoal..."></textarea>
        </div>

        <div class="section"><strong>Estatísticas:</strong> em breve</div>
      `;

      // Clique para selecionar alternativa
      questaoDiv.querySelectorAll(".alternativa").forEach(alt => {
        alt.addEventListener("click", () => {
          questaoDiv.querySelectorAll(".alternativa")
            .forEach(a => a.classList.remove("selecionada"));
          alt.classList.add("selecionada");
        });
      });

      container.appendChild(questaoDiv);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar as questões:", error);
    alert("Erro ao carregar o banco de questões. Verifique o arquivo questoes.json.");
  });

// ===============================
// FUNÇÃO DE RESPOSTA
// ===============================
function responder(botao, gabarito) {
  const questao = botao.closest(".questao");
  const selecionada = questao.querySelector(".alternativa.selecionada");

  if (!selecionada) {
    alert("Selecione uma alternativa.");
    return;
  }

  const opcaoEscolhida = selecionada.dataset.opcao;

  if (opcaoEscolhida === gabarito) {
    alert("✅ Resposta correta!");
  } else {
    alert(`❌ Resposta incorreta. Gabarito: ${gabarito}`);
  }
}

