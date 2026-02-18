document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("questoes");
  if (!container) {
    console.error("Div #questoes não encontrada");
    return;
  }

  let corAtual = "highlight-yellow";

  function aplicarHighlight() {
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

  fetch("questoes.json")
    .then(res => res.json())
    .then(questoes => {
      questoes.forEach(q => {
        const div = document.createElement("div");
        div.className = "questao";

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.innerHTML = `<strong>${q.area}</strong> | ${q.tema} <br>
                          Ano: ${q.ano} | Banca: ${q.banca} | Órgão: ${q.orgao}`;

        const enunciado = document.createElement("div");
        enunciado.className = "enunciado";
        enunciado.textContent = q.enunciado;

        const toolbar = document.createElement("div");
        toolbar.className = "toolbar";

        const cores = [
          ["🟨", "highlight-yellow"],
          ["🟩", "highlight-green"],
          ["🟦", "highlight-blue"]
        ];

        cores.forEach(([emoji, cor]) => {
          const btn = document.createElement("span");
          btn.textContent = emoji;
          btn.onclick = () => corAtual = cor;
          toolbar.appendChild(btn);
        });

        const marcador = document.createElement("span");
        marcador.textContent = "✏️";
        marcador.onclick = aplicarHighlight;
        toolbar.appendChild(marcador);

        div.appendChild(meta);
        div.appendChild(enunciado);
        div.appendChild(toolbar);

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
            div.querySelectorAll(".alternativa")
              .forEach(a => a.classList.remove("selecionada"));
            alt.classList.add("selecionada");
          };

          div.appendChild(alt);
        });

        const btnResp = document.createElement("button");
        btnResp.textContent = "Responder";
        btnResp.onclick = () => {
          alert("Gabarito: " + q.gabarito);
        };

        div.appendChild(btnResp);
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Erro ao renderizar questões:", err);
      alert("Erro ao carregar as questões. Veja o console.");
    });

});
