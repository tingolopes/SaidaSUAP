function showOrHidePopup(url) {
    if (url.includes("https://suap.ifms.edu.br/")) {
        document.getElementById("other-pages").style.display = "none";
        document.getElementById("form").style.display = "block";
    } else {
        document.getElementById("other-pages").style.display = "block";
        document.getElementById("form").style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded",  async function() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    showOrHidePopup(tab.url);
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getLocalStorage,
    }).then((injectionResults) => {
        for (const {frameId, result} of injectionResults) {
            document.querySelector('#horas-presenciais').value = result[0];
            if (result[1] === "true") {
                document.querySelector("#intervalo").setAttribute("checked", "checked");
            }else{
                document.querySelector("#intervalo").removeAttribute("checked");
            }
          }
    })
});

document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const horasPresenciais = document.querySelector('#horas-presenciais').value;
    const somaIntervalo = document.querySelector("#intervalo").checked ? "true" : "false";
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setLocalStorage,
        args: [horasPresenciais, somaIntervalo],
    });
});

function getLocalStorage() {
    return [
        localStorage.getItem("horas-presenciais"),
        localStorage.getItem("soma-intervalo")
    ];
}

function setLocalStorage(horasPresenciais, somaIntervalo) {
    localStorage.setItem("horas-presenciais", horasPresenciais);
    localStorage.setItem("soma-intervalo", somaIntervalo);
    main_suap();
}