function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erro = document.getElementById("erro");

  erro.textContent = "";

  // PERFIL ÚNICO: USUÁRIO
  if (usuario === "usuario" && senha === "usuario123") {
    localStorage.setItem("perfil", "usuario");
    window.location.href = "questoes.html";
    return;
  }

  erro.textContent = "Usuário ou senha inválidos.";
}
