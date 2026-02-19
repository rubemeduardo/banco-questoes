document.addEventListener("keydown", function (e) {
  if (!e.altKey) return;

  let classe = null;

  if (e.key === "1") classe = "highlight-yellow";
  if (e.key === "2") classe = "highlight-green";
  if (e.key === "3") classe = "highlight-blue";

  if (!classe) return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement("span");
  span.className = classe;

  try {
    range.surroundContents(span);
    selection.removeAllRanges();
  } catch (err) {
    // fallback seguro (quando o range cruza múltiplos nós)
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
    selection.removeAllRanges();
  }
});


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

