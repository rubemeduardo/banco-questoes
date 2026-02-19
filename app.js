fetch("questoes.json")
  .then(response => response.json())
  .then(questoes => {
    const container = document.getElementById("questoes");

    questoes.forEach(q => {
      let respostaSelecionada = null;
      let respondida = false;

      const bloco = document.createElement("div");
      bloco.className = "questao";
      bloco.style.border = "1px solid #ccc";
      bloco.style.padding = "12px";
      bloco.style.marginBottom = "20px";

      // ID
      const id = document.createElement("div");
      id.textContent = `Questão ${q.id}`;
      id.style.fontWeight = "bold";
      id.style.marginBottom = "6px";
      bloco.appendChild(id);

      // Enunciado
      const enunciado = document.createElement("p");
      enunciado.innerHTML = `<strong>${q.enunciado}</strong>`;
      bloco.appendChild(enunciado);

      // Alternativas
      const lista = document.createElement("div");

      Object.entries(q.alternativas).forEach(([letra, texto]) => {
        const botao = document.createElement("button");
        botao.textContent = `${letra}) ${texto}`;
        botao.style.display = "block";
        botao.style.margin = "6px 0";
        botao.style.width = "100%";
        botao.style.textAlign = "left";

        botao.onclick = () => {
          if (respondida) return;

          respostaSelecionada = letra;

          // limpa seleção visual
          lista.querySelectorAll("button").forEach(b => {
            b.style.backgroundColor = "";
          });

          // marca a selecionada
          botao.style.backgroundColor = "#d0ebff";
        };

        lista.appendChild(botao);
      });

      bloco.appendChild(lista);

      // Botão responder
      const btnResponder = document.createElement("button");
      btnResponder.textContent = "Responder";
      btnResponder.style.marginTop = "10px";

      btnResponder.onclick = () => {
        if (respondida) return;

        if (!respostaSelecionada) {
          alert("Selecione uma alternativa antes de responder.");
          return;
        }

        respondida = true;

        // trava alternativas
        lista.querySelectorAll("button").forEach(b => {
          b.disabled = true;
        });

        btnResponder.disabled = true;
        btnResponder.textContent = "Respondida";
      };

      bloco.appendChild(btnResponder);
      container.appendChild(bloco);
    });
  })
  .catch(err => console.error(err));
