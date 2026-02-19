let total = 0;
let acertos = 0;
let erros = 0;

fetch("questoes.json")
  .then(r => r.json())
  .then(questoes => {
    total = questoes.length;

    const container = document.getElementById("questoes");
    const placar = document.getElementById("placar");

    function atualizarPlacar() {
      placar.textContent = `Acertos: ${acertos} | Erros: ${erros} | Total: ${total}`;
    }

    atualizarPlacar();

    questoes.forEach(q => {
      let respostaSelecionada = null;
      let respondida = false;
      let marcadaDuvida = false;

      const bloco = document.createElement("div");
      bloco.className = "questao";
      bloco.style.border = "1px solid #ccc";
      bloco.style.padding = "15px";
      bloco.style.marginBottom = "20px";

      // ID
      const id = document.createElement("div");
      id.innerHTML = `<strong>ID ${q.id}</strong>`;
      bloco.appendChild(id);

      // Enunciado
      const enunciado = document.createElement("p");
      enunciado.innerHTML = `<strong>${q.enunciado}</strong>`;
      bloco.appendChild(enunciado);

      // Alternativas
      const lista = document.createElement("div");

      Object.entries(q.alternativas).forEach(([letra, texto]) => {
        const linha = document.createElement("div");
        linha.style.display = "flex";
        linha.style.alignItems = "center";
        linha.style.marginBottom = "6px";

        const botao = document.createElement("button");
        botao.textContent = `${letra}) ${texto}`;
        botao.style.flex = "1";
        botao.style.textAlign = "left";

        // selecionar alternativa
        botao.onclick = () => {
          if (respondida) return;

          respostaSelecionada = letra;

          lista.querySelectorAll("button").forEach(b => {
            b.style.backgroundColor = "";
          });

          botao.style.backgroundColor = "#d0ebff";
        };

        // riscar alternativa
        const riscar = document.createElement("button");
        riscar.textContent = "❌";
        riscar.style.marginLeft = "5px";

        riscar.onclick = () => {
          if (respondida) return;

          botao.style.textDecoration =
            botao.style.textDecoration === "line-through"
              ? "none"
              : "line-through";
        };

        linha.appendChild(botao);
        linha.appendChild(riscar);
        lista.appendChild(linha);
      });

      bloco.appendChild(lista);

      // Botão responder
      const responder = document.createElement("button");
      responder.textContent = "Responder";
      responder.style.marginTop = "10px";

      responder.onclick = () => {
        if (respondida) return;

        if (!respostaSelecionada) {
          alert("Selecione uma alternativa.");
          return;
        }

        respondida = true;

        lista.querySelectorAll("button").forEach(b => b.disabled = true);
        responder.disabled = true;
        responder.textContent = "Respondida";

        if (q.gabarito) {
          if (respostaSelecionada === q.gabarito) {
            acertos++;
          } else {
            erros++;
          }

          lista.querySelectorAll("button").forEach(b => {
            if (b.textContent.startsWith(q.gabarito)) {
              b.style.backgroundColor = "#d3f9d8";
            }
            if (
              b.textContent.startsWith(respostaSelecionada) &&
              respostaSelecionada !== q.gabarito
            ) {
              b.style.backgroundColor = "#ffa8a8";
            }
          });

          atualizarPlacar();
        }
      };

      // Botão dúvida
      const duvida = document.createElement("button");
      duvida.textContent = "📌 Marcar dúvida";
      duvida.style.marginLeft = "10px";

      duvida.onclick = () => {
        marcadaDuvida = !marcadaDuvida;
        bloco.style.border = marcadaDuvida ? "2px solid orange" : "1px solid #ccc";
        duvida.textContent = marcadaDuvida ? "📌 Dúvida marcada" : "📌 Marcar dúvida";
      };

      bloco.appendChild(responder);
      bloco.appendChild(duvida);

      container.appendChild(bloco);
    });
  });
