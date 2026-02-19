/* ======================
   MARCAÇÃO LIVRE DE TEXTO
====================== */
function aplicarMarcacao(cor) {
  const selecao = window.getSelection();

  if (!selecao || selecao.rangeCount === 0) return;

  const range = selecao.getRangeAt(0);

  if (range.collapsed) return;

  const span = document.createElement("span");
  span.className = `highlight-${cor}`;

  range.surroundContents(span);
  selecao.removeAllRanges();
}
