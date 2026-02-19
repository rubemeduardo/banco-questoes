let questoes = [];
let acertos = 0;
let respondidas = 0;

fetch("questoes.json")
  .then(res => res.json())
  .then(dados => {
    questoes = dados;
    renderizarQuestoes();
  })
  .catch(err => {
    console.error("Erro ao carregar JSON:", err);
  });

function renderizarQuestoes() {
  const container = document.getElementById("questoes");
  const placar = document.getElementById("placar");

  container.innerHTML = "";
  placar.innerHTML = "";

  questoes.forEach(q => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "15px";
    div.style.marginBottom = "20px";

    div.innerHTML = `
      <h3>Questão ${q.id}</h3>
      <p><strong>${q.enunciado}</strong></p>
    `;

    const form = document.createElement("form");

    Object.entries(q.alternativas).forEach(([letra, texto]) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "5px";

      label.innerHTML = `
        <input type="radio" name="q${q.id}" value="${letra}">
        <strong>${letra})</strong> ${texto}
      `;

      form.appendChild(label);
    });

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "Responder";

    botao.onclick = () => corrigir(q, form, botao);

    div.appendChild(form);
    div.appendChild(botao);

    container.appendChild(div);
  });
}

function corrigir(questao, form, botao) {
  const marcada = form.querySelector("input[type=radio]:checked");

  if (!marcada) {
    alert("Escolha uma alternativa.");
    return;
  }

  respondidas++;

  if (marcada.value === questao.gabarito) {
    acertos++;
    marcada.parentElement.style.color = "green";
  } else {
    marcada.parentElement.style.color = "red";

    const correta = form.querySelector(
      `input[value="${questao.gabarito}"]`
    );
    if (correta) {
      correta.parentElement.style.color = "green";
    }
  }

  botao.disabled = true;
  atualizarPlacar();
}

function atualizarPlacar() {
  document.getElementById("placar").innerHTML = `
    <strong>Respondidas:</strong> ${respondidas} |
    <strong>Acertos:</strong> ${acertos}
  `;
}
