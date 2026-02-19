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

      // Enunciado em negrito
      const enunciado = document.createElement("p");
      enunciado.innerHTML = `<strong>${q.enunciado}</strong>`;
      bloco.appendChild(enunciado);

      // Alternativas
      const lista = document.createElement("div");
      lista.className = "alternativas";

      Object.entries(q.alternativas).forEach(([letra, texto]) => {
        const botao = document.createElement("button");
        botao.textContent = `${letra}) ${texto}`;
        botao.onclick = () => {
          botao.classList.toggle("selecionada");
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
