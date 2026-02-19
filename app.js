fetch("questoes.json")
  .then(response => response.json())
  .then(questoes => {
    const container = document.getElementById("questoes");

    questoes.forEach(q => {
      const bloco = document.createElement("div");
      bloco.className = "questao";

      // ID da questão
      const id = document.createElement("div");
      id.className = "questao-id";
      id.textContent = `Q${q.id}`;
      bloco.appendChild(id);

      // Enunciado
      const enunciado = document.createElement("p");
      enunciado.innerHTML = `<strong>${q.enunciado}</strong>`;
      bloco.appendChild(enunciado);

      // Container das alternativas
      const lista = document.createElement("div");
      lista.className = "alternativas";

      Object.entries(q.alternativas).forEach(([letra, texto]) => {
        const botao = document.createElement("button");
        botao.textContent = `${letra}) ${texto}`;

        // força ficar um abaixo do outro
        botao.style.display = "block";
        botao.style.margin = "6px 0";
        botao.style.width = "100%";
        botao.style.textAlign = "left";

        botao.onclick = () => {
          // remove seleção de todas as alternativas da questão
          lista.querySelectorAll("button").forEach(b =>
            b.classList.remove("selecionada")
          );

          // marca somente a clicada
          botao.classList.add("selecionada");
        };

        lista.appendChild(botao);
      });

      bloco.appendChild(lista);
      container.appendChild(bloco);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar as questões:", error);
  });
