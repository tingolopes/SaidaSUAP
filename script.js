// Capturar o elemento dentro da div com a classe "wrapper"
const parentElement = document.querySelector("div.wrapper dl");
const referenceNode = parentElement.querySelectorAll("dt")[2];
const tempoTrabalhado = parentElement.querySelectorAll("dd")[1].innerText; //total trabalhado hoje em string
let jornadaAtingida = false;
let limiteAtingido = false;

const entradasEsaidas = parentElement.querySelectorAll("dd")[0];
const registros = Array.from(entradasEsaidas.querySelectorAll('span'));

registros.forEach(function(span) {
  if(span.classList.contains('true')){
	  console.log("Entrada");
  }else console.log("Saída");
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
newDd.textContent = calculaHoraEstimadaDeSaida(tempoTrabalhado);
newDd.style.backgroundColor = '#8DE2AA'; //verde claro
newDd.style.borderRadius = '5px';

if (limiteAtingido) {
  newDd.style.backgroundColor = '#FFE9AD'; //amarelo claro
  if (jornadaAtingida) {
    newDd.style.backgroundColor = '#F7B6BC'; //vermelho claro
  }
}

// Inserindo o novo item <dt> antes do nó de referência
parentElement.insertBefore(newDt, referenceNode);

// Inserindo o novo item <dd> depois do novo item <dt>
parentElement.insertBefore(newDd, newDt.nextSibling);

function calculaHoraEstimadaDeSaida(totalTrabalhadoHoje) {
  let duracaoTotal = 8 * 60 * 60; // Duração total desejada em segundos (8 horas)
  
  try{
	console.log(entradasEsaidas.querySelectorAll("span")[1].innerText);
  }catch{
	duracaoTotal = duracaoTotal + 60 * 60;
	console.log("Ainda não fez o intervalo");
  }
  
  const tempoTrabalhadoSegundos = horaMinutoSegundoParaSegundos(totalTrabalhadoHoje);
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
  const horarioAtualSegundos = agora.getHours() * 3600 + agora.getMinutes() * 60 + agora.getSeconds();
  const horarioEstimadoSegundos = horarioAtualSegundos + diferencaSegundos;
  const horasEstimadas = Math.floor(horarioEstimadoSegundos / 3600);
  const minutosEstimados = Math.floor((horarioEstimadoSegundos % 3600) / 60);
  const segundosEstimados = horarioEstimadoSegundos % 60;

  const horaEstimada = padZero(horasEstimadas) + ":" + padZero(minutosEstimados) + ":" + padZero(segundosEstimados);
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