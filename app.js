let corAtual = "highlight-yellow";

function setCor(cor) {
  corAtual = cor;
}

function marcarPalavra() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  const span = document.createElement("span");
  span.className = corAtual;
  range.surroundContents(span);
  sel.removeAllRanges();
}

fetch("questoes.json")
  .then(response => response.json())
  .then(questoes => {
    const container = document.getElementById("questoes");

    questoes.forEach(q => {
      const div = document.createElement("div");
      div.className = "questao";

      div.innerHTML = `
        <strong>${q.area}</strong><br>
        <div class="meta">
          ${q.tema} | ${q.banca} | ${q.orgao} | ${q.ano}
        </div>

        <p>${q.enunciado}</p>

        <div class="toolbar">
          <span onclick="setCor('highlight-yellow')">🟨</span>
          <span onclick="setCor('highlight-green')">🟩</span>
          <span onclick="setCor('highlight-blue')">🟦</span>
          <span onclick="marcarPalavra()">✏️</span>
        </div>

        ${Object.entries(q.alternativas).map(([letra, texto]) => `
          <div class="alternativa" onclick="this.classList.toggle('selecionada')">
            <span onclick="event.stopPropagation(); this.parentElement.classList.toggle('errada')">❌</span>
            <strong>${letra})</strong> ${texto}
          </div>
        `).join("")}

        <button onclick="alert('Resposta correta: ${q.gabarito}')">Responder</button>

        <div class="section"><strong>Fonte:</strong> ${q.fonte_gabarito || "—"}</div>
        <div class="section"><strong>Comentário do administrador:</strong> ${q.comentario_admin || "—"}</div>
        <div class="section"><strong>Comentário do usuário:</strong> (em breve)</div>
        <div class="section"><strong>Estatísticas:</strong> ${q.estatisticas ? `Respondida: ${q.estatisticas.respondida}` : "—"}</div>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Erro ao carregar o banco de questões:", err);
  });
