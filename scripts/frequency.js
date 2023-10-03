function frequency() {
  var times = document.getElementsByClassName("text-nowrap hint hint-top");

  for (let index = 0; index < times.length; index++) {
    pElement = document.createElement("p");
    const entryRegex = /Entrada no Terminal: /i;
    const outRegex = /Saída no Terminal: /i;

    var frequency_location = times[index].ariaLabel.replace(entryRegex, '').replace(outRegex, '');
    pElement.innerHTML += " (" + frequency_location + ")";
    times[index].append(pElement);
  }
  document.getElementsByClassName("mostrarTodasObservacoes")[0].click();
}
