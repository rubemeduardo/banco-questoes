document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("questoes");
  if (!container) return;

  let corAtual = "highlight-yellow";

  function marcarPalavra() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement("span");
    span.className = corAtual;
    span.style.padding = "2px 4px";
    span.style.borderRadius = "4px";

    range.surroundContents(span);
    sel.removeAllRanges();
  }

  // expõe para uso nos botões
  window.setCor = corAtual => corAtual = corAtual;
  window.marcarPalavra = marcarPalavra;

  fetch("questoes.json")
    .then(r => r.json())
    .then(questoes => {
      questoes.forEach(q => {
        const questao = document.createElement("div");
        questao.className = "questao";

        // META
        questao.innerHTML = `
          <div class="meta">
            <strong>${q.area}</strong> | ${q.tema}<br>
            Ano: ${q.ano} | Banca: ${q.banca} | Órgão: ${q.orgao}
          </div>

          <div class="enunciado">${q.enunciado}</div>

          <div class="toolbar">
            <span data-cor="highlight-yellow">🟨</span>
            <span data-cor="highlight-green">🟩</span>
            <span data-cor="highlight-blue">🟦</span>
            <span class="marcar">✏️</span>
          </div>
        `;

        // TOOLBAR
        const toolbar = questao.querySelector(".toolbar");
        toolbar.querySelectorAll("span[data-cor]").forEach(btn => {
          btn.onclick = () => corAtual = btn.dataset.cor;
        });
        toolbar.querySelector(".marcar").onclick = marcarPalavra;

        // ALTERNATIVAS
        Object.entries(q.alternativas).forEach(([letra, texto]) => {
          const alt = document.createElement("div");
          alt.className = "alternativa";
          alt.dataset.opcao = letra;

          const x = document.createElement("span");
          x.textContent = "❌";
          x.onclick = e => {
            e.stopPropagation();
            alt.classList.toggle("errada");
          };

          const txt = document.createElement("span");
          txt.innerHTML = `<strong>${letra})</strong> ${texto}`;

          alt.appendChild(x);
          alt.appendChild(txt);

          alt.onclick = () => {
            questao.querySelectorAll(".alternativa")
              .forEach(a => a.classList.remove("selecionada"));
            alt.classList.add("selecionada");
          };

          questao.appendChild(alt);
        });

        // BOTÃO RESPONDER
        const btn = document.createElement("button");
        btn.textContent = "Responder";
        btn.onclick = () => {
          const marcada = questao.querySelector(".alternativa.selecionada");
          if (!marcada) {
            alert("Selecione uma alternativa.");
            return;
          }

          if (marcada.dataset.opcao === q.gabarito) {
            marcada.style.background = "#c8f7c5";
            alert("✅ Você acertou!");
          } else {
            marcada.style.background = "#ffd6d6";
            alert(`❌ Você errou. Gabarito: ${q.gabarito}`);
          }
        };

        questao.appendChild(btn);
        container.appendChild(questao);
      });
    });

});
