function main_suap() {
  // Capturar o elemento dentro da div com a classe "wrapper"
  // verificar se o elemento class='loader' está com display none para iniciar execução do código
  const loader = document.querySelector(".loader");
  if (loader.style.display !== "none") {
    console.log("Ainda carregando elementos da tela inicial...")
    setTimeout(main_suap, 1000);
    return;
  }

  if (localStorage.getItem("horas-presenciais") === null) {
    localStorage.setItem("horas-presenciais", "8");
  }
  if (localStorage.getItem("soma-intervalo") === null) {
    localStorage.setItem("soma-intervalo", false);
  }

  if (document.getElementsByClassName("chrome-extension").length > 0) {
    let elements = document.getElementsByClassName("chrome-extension");
    while (elements.length > 0) {
      elements[0].remove();
    }
  }

  const horasPresenciais = localStorage.getItem("horas-presenciais");
  const somaIntevalo = localStorage.getItem("soma-intervalo");

  const parentElement = document.querySelector("span[data-quadro='Frequências']").parentElement.nextElementSibling;
  const parentElementDl = parentElement.querySelector("dl");
  const referenceNode = parentElement.querySelectorAll("dt")[2];
  const tempoTrabalhado = parentElement.querySelectorAll("dd")[1].innerText; //total trabalhado hoje em string
  let jornadaAtingida = false;
  let limiteAtingido = false;

  const entradasEsaidas = parentElement.querySelectorAll("dd")[0];
  const registros = Array.from(entradasEsaidas.querySelectorAll("span"));

  registros.forEach(function (span) {
    if (span.classList.contains("true")) {
      console.log("Entrada");
    } else {
      console.log("Saída");
    }
  });

  //console.log(entradasEsaidas.querySelectorAll("span")[0].innerText+":00");
  //console.log(entradasEsaidas.querySelectorAll("span")[1].innerText+":00");
  //console.log(entradasEsaidas.querySelectorAll("span")[2].innerText+":00");
  //console.log(entradasEsaidas.querySelectorAll("span")[3].innerText+":00");

  // Criando o novo item <dt> e definindo seu texto
  const newDt = document.createElement("dt");
  newDt.textContent = "Saída Estimada Hoje: ";

  // Criando o novo item <dd> e definindo seu texto e estilos
  const newDd = document.createElement("dd");
  newDd.textContent = calculaHoraEstimadaDeSaida(tempoTrabalhado, horasPresenciais, somaIntevalo);
  newDd.style.backgroundColor = "#8DE2AA"; //verde claro
  newDd.style.borderRadius = "5px";

  if (limiteAtingido) {
    newDd.style.backgroundColor = "#FFE9AD"; //amarelo claro
    if (jornadaAtingida) {
      newDd.style.backgroundColor = "#F7B6BC"; //vermelho claro
    }
  }

  // Inserindo o novo item <dt> antes do nó de referência
  parentElementDl.insertBefore(newDt, referenceNode);
  newDt.setAttribute("class", "chrome-extension");

  // Inserindo o novo item <dd> depois do novo item <dt>
  parentElementDl.insertBefore(newDd, newDt.nextSibling);
  newDd.setAttribute("class", "chrome-extension");

  function calculaHoraEstimadaDeSaida(totalTrabalhadoHoje, horasPresenciais, somaIntervalo) {
    let duracaoTotal = horasPresenciais * 60 * 60; // Duração total desejada em segundos (padraão = 8 horas)

    if (entradasEsaidas.querySelectorAll("span").length < 2 && somaIntervalo == "true") {
      duracaoTotal = duracaoTotal + 60 * 60;
      console.log("Ainda não fez o intervalo");
    }
    /* try {
      console.log(entradasEsaidas.querySelectorAll("span")[1].innerText);
    } catch {
      duracaoTotal = duracaoTotal + 60 * 60;
      console.log("Ainda não fez o intervalo");
    } */

    const tempoTrabalhadoSegundos =
      horaMinutoSegundoParaSegundos(totalTrabalhadoHoje);
    let diferencaSegundos = duracaoTotal - tempoTrabalhadoSegundos;

    if (diferencaSegundos < 900) {
      console.log("Faltam 15 minutos");
      limiteAtingido = true;
      if (diferencaSegundos < 0) {
        console.log("Hora de sair");
        jornadaAtingida = true;
      }
    }

    const agora = new Date();
    const horarioAtualSegundos =
      agora.getHours() * 3600 + agora.getMinutes() * 60 + agora.getSeconds();
    const horarioEstimadoSegundos = horarioAtualSegundos + diferencaSegundos;
    const horasEstimadas = Math.floor(horarioEstimadoSegundos / 3600);
    const minutosEstimados = Math.floor((horarioEstimadoSegundos % 3600) / 60);
    const segundosEstimados = horarioEstimadoSegundos % 60;

    const horaEstimada =
      padZero(horasEstimadas) +
      ":" +
      padZero(minutosEstimados) +
      ":" +
      padZero(segundosEstimados);
    return horaEstimada;
  }

  function horaMinutoSegundoParaSegundos(hora) {
    const partes = hora.split(":");
    const horas = parseInt(partes[0], 10);
    const minutos = parseInt(partes[1], 10);
    const segundos = parseInt(partes[2], 10);

    return horas * 3600 + minutos * 60 + segundos;
  }

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }
}
