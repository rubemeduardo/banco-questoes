function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erro = document.getElementById("erro");

  erro.textContent = "";

  if (usuario === "usuario" && senha === "usuario123") {
    localStorage.setItem("perfil", "usuario");
    window.location.href = "questoes.html";
  } else {
    erro.textContent = "Usuário ou senha inválidos.";
  }
}
