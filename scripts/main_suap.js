function main_suap() {
  console.log("Saída Estimada SUAP: Iniciando busca pelo quadro de Frequências...");

  function horaMinutoSegundoParaSegundos(hora) {
    if (hora.includes("h")) {
      const parts = hora.match(/(\d+)h\s*(\d+)min\s*(\d+)seg/);
      if (parts) return parseInt(parts[1]) * 3600 + parseInt(parts[2]) * 60 + parseInt(parts[3]);
    }
    const partes = hora.split(":");
    return (parseInt(partes[0]) || 0) * 3600 + (parseInt(partes[1]) || 0) * 60 + (parseInt(partes[2]) || 0);
  }

  function padZero(num) {
    if (num < 0) return "00";
    return num.toString().padStart(2, "0");
  }

  function calculaHoraEstimadaDeSaida(totalTrabalhadoHoje, horasPresenciais, somaIntervalo, qtdRegistros) {
    let duracaoTotal = parseFloat(horasPresenciais) * 3600;
    if (qtdRegistros < 2 && (somaIntervalo === "true" || somaIntervalo === true)) {
      duracaoTotal += 3600;
    }

    const tempoTrabalhadoSegundos = horaMinutoSegundoParaSegundos(totalTrabalhadoHoje);
    let diferencaSegundos = duracaoTotal - tempoTrabalhadoSegundos;

    let status = "normal";
    if (diferencaSegundos < 600) {
      status = "limite";
      if (diferencaSegundos < 0) {
        status = "atingida";
      }
    }

    const agora = new Date();
    const horarioAtualSegundos = agora.getHours() * 3600 + agora.getMinutes() * 60 + agora.getSeconds();
    const horarioEstimadoSegundos = horarioAtualSegundos + diferencaSegundos;
    
    const horasEstimadas = Math.floor(horarioEstimadoSegundos / 3600);
    const minutosEstimados = Math.floor((horarioEstimadoSegundos % 3600) / 60);
    const segundosEstimados = Math.floor(horarioEstimadoSegundos % 60);

    const horaFormatada = padZero(horasEstimadas) + ":" + padZero(minutosEstimados) + ":" + padZero(segundosEstimados);
    return { hora: horaFormatada, status: status };
  }

  function injectEstimatedExit() {
    if (document.getElementsByClassName("chrome-extension").length > 0) {
      return true; 
    }

    let tituloFrequencias = document.querySelector("h3[data-quadro='Frequências']");
    if (!tituloFrequencias) {
      tituloFrequencias = Array.from(document.querySelectorAll("h3, span, div.titulo")).find(el => 
        el.textContent.trim().toLowerCase() === "frequências"
      );
    }

    if (!tituloFrequencias) return false;

    const modulo = tituloFrequencias.closest(".modulo") || tituloFrequencias.closest(".modulo-info");
    if (!modulo) return false;

    const parentElementDl = modulo.querySelector("dl");
    if (!parentElementDl) return false;

    const dts = Array.from(parentElementDl.querySelectorAll("dt"));
    const dtTotalHoje = dts.find(dt => dt.textContent.includes("Total de Hoje"));
    if (!dtTotalHoje) return false;
    
    const ddTotalHoje = dtTotalHoje.nextElementSibling;
    if (!ddTotalHoje) return false;

    const tempoTrabalhado = ddTotalHoje.innerText.trim();
    if (!tempoTrabalhado || tempoTrabalhado === "--:--:--") return false;
    
    const dtHoje = dts.find(dt => dt.textContent.trim().startsWith("Hoje"));
    if (!dtHoje) return false;
    
    const ddHoje = dtHoje.nextElementSibling;
    const registros = Array.from(ddHoje.querySelectorAll("span"));

    chrome.storage.local.get(["horas-presenciais", "soma-intervalo"], function(result) {
      const horasPresenciais = result["horas-presenciais"] || "8";
      const somaIntevalo = result["soma-intervalo"] || "false";

      const resultado = calculaHoraEstimadaDeSaida(tempoTrabalhado, horasPresenciais, somaIntevalo, registros.length);

      // Criamos um span para injetar dentro do DD existente, para não quebrar o layout
      const spanSaida = document.createElement("span");
      spanSaida.textContent = "Saída Estimada: " + resultado.hora;
      spanSaida.setAttribute("class", "chrome-extension");
      spanSaida.style.backgroundColor = "#8DE2AA";
      spanSaida.style.borderRadius = "5px";
      spanSaida.style.padding = "2px 5px";
      spanSaida.style.fontWeight = "bold";
      spanSaida.style.fontSize = "0.9em";
      spanSaida.style.color = "#333";
      spanSaida.style.display = "inline-block";
      spanSaida.style.marginTop = "4px";

      if (resultado.status === "limite") {
        spanSaida.style.backgroundColor = "#FFE9AD";
        // Dispara notificação se estiver no limite (faltando 15 min ou menos)
        chrome.runtime.sendMessage({ action: "notificarSaida", hora: resultado.hora });
      } else if (resultado.status === "atingida") {
        spanSaida.style.backgroundColor = "#F7B6BC";
      }

      // Adiciona uma quebra de linha e o span ao final do DD do "Total de Hoje"
      const br = document.createElement("br");
      br.setAttribute("class", "chrome-extension");
      ddTotalHoje.appendChild(br);
      ddTotalHoje.appendChild(spanSaida);

      console.log("Saída Estimada SUAP: Informações injetadas com sucesso no Total de Hoje!");
    });

    return true;
  }

  if (!injectEstimatedExit()) {
    const observer = new MutationObserver(() => {
      if (injectEstimatedExit()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}






