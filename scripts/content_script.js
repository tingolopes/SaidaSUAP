var pathname = window.location.pathname;

switch (pathname) {
  case "/":
    main_suap();
    break;

  case "/ponto/frequencia_funcionario/":
    frequency();
    break;

  default:
    break;
}
