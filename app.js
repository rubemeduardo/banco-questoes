document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("questoes");
  if (!container) {
    alert("Erro: div #questoes não encontrada");
    return;
  }

  /* ===============================
     CONTROLE DE CORES (HIGHLIGHT)
     =============================== */
  let corAtual = "highlight-yellow";

  function marcarTextoSelecionado() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    // garante que é texto puro (evita erro de DOM)
    if (
      range.startContainer.nodeType !== Node.TEXT_NODE ||
      range.endContainer.nodeType !== Node.TEXT_NODE
    ) {
      alert("Selecione apenas texto contínuo.");
      return;
    }

    const span = document.createElement("span");
    span.className = corAtual;
    span.style.padding = "2px 4px";
    span.style.borderRadius = "4px";

    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();
  }

  /* ===============================
     CARREGAMENTO DAS QUESTÕES
     =============================== */
  fetch("questoes.json")
    .then(res => {
      if (!res.ok) throw new Error("Erro ao carregar questoes.json");
      return res.json();
    })
    .then(questoes => {

      questoes.forEach(q => {
        const questao = document.createElement("div");
        questao.className = "questao";

        /* ---------- META + ENUNCIADO ---------- */
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

        /* ---------- TOOLBAR ---------- */
        const toolbar = questao.querySelector(".toolbar");

        toolbar.querySelectorAll("span[data-cor]").forEach(btn => {
          btn.addEventListener("click", () => {
            corAtual = btn.dataset.cor;
          });
        });

        toolbar.querySelector(".marcar")
               .addEventListener("click", marcarTextoSelecionado);

        /* ---------- ALTERNATIVAS ---------- */
        Object.entries(q.alternativas).forEach(([letra, texto]) => {
          const alt = document.createElement("div");
          alt.className = "alternativa";
          alt.dataset.opcao = letra;

          const x = document.createElement("span");
          x.textContent = "❌";
          x.style.cursor = "pointer";
          x.onclick = e => {
            e.stopPropagation();
            alt.classList.toggle("errada");
          };

          const txt = document.createElement("span");
          txt.innerHTML = `<strong>${letra})</strong> ${texto}`;

          alt.appendChild(x);
          alt.appendChild(txt);

          // marcar como resposta escolhida
          alt.onclick = () => {
            questao.querySelectorAll(".alternativa")
              .forEach(a => a.classList.remove("selecionada"));
            alt.classList.add("selecionada");
          };

          questao.appendChild(alt);
        });

        /* ---------- BOTÃO RESPONDER ---------- */
        const btnResponder = document.createElement("button");
        btnResponder.textContent = "Responder";

        btnResponder.onclick = () => {
          const selecionada = questao.querySelector(".alternativa.selecionada");

          if (!selecionada) {
            alert("Selecione uma alternativa.");
            return;
          }

          // limpa cores anteriores
          questao.querySelectorAll(".alternativa")
            .forEach(a => a.style.background = "");

          if (selecionada.dataset.opcao === q.gabarito) {
            selecionada.style.background = "#c8f7c5";
            alert("✅ Você acertou!");
          } else {
            selecionada.style.background = "#ffd6d6";
            alert(`❌ Você errou. Gabarito: ${q.gabarito}`);
          }
        };

        questao.appendChild(btnResponder);
        container.appendChild(questao);
      });

    })
    .catch(err => {
      console.error(err);
      alert("Erro ao carregar as questões. Veja o console.");
    });

});
