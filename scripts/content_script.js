(function() {
  console.log("Saída Estimada SUAP: Extensão carregada.");
  var pathname = window.location.pathname;

  if (pathname === "/" || pathname === "/recursos_humanos/") {
    if (typeof main_suap === "function") main_suap();
  } else if (pathname.startsWith("/ponto/frequencia_funcionario/")) {
    if (typeof frequency === "function") frequency();
  }
})();


