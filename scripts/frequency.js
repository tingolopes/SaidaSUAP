function frequency() {
  var times = document.getElementsByClassName("text-nowrap hint hint-top");

  for (let index = 0; index < times.length; index++) {
    const pElement = document.createElement("p");
    const entryRegex = /Entrada no Terminal: /i;
    const outRegex = /Saída no Terminal: /i;

    const ariaLabel = times[index].getAttribute("aria-label") || "";
    var frequency_location = ariaLabel.replace(entryRegex, '').replace(outRegex, '');
    if (frequency_location) {
      pElement.innerHTML = " (" + frequency_location + ")";
      times[index].append(pElement);
    }
  }

  const btnObservacoes = document.getElementsByClassName("mostrarTodasObservacoes")[0];
  if (btnObservacoes) {
    btnObservacoes.click();
  }
}

