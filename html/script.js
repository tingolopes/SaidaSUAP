function showOrHidePopup(url) {
    if (url.includes("https://suap.ifms.edu.br/")) {
        document.getElementById("other-pages").style.display = "none";
        document.getElementById("form").style.display = "block";
    } else {
        document.getElementById("other-pages").style.display = "block";
        document.getElementById("form").style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", async function() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    showOrHidePopup(tab.url);

    // Carrega do chrome.storage.local
    chrome.storage.local.get(["horas-presenciais", "soma-intervalo"], (result) => {
        if (result["horas-presenciais"]) {
            document.querySelector('#horas-presenciais').value = result["horas-presenciais"];
        } else {
            document.querySelector('#horas-presenciais').value = "8";
        }

        if (result["soma-intervalo"] === "true" || result["soma-intervalo"] === true) {
            document.querySelector("#intervalo").checked = true;
        } else {
            document.querySelector("#intervalo").checked = false;
        }
    });
});

document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const horasPresenciais = document.querySelector('#horas-presenciais').value;
    const somaIntervalo = document.querySelector("#intervalo").checked ? "true" : "false";

    // Salva no chrome.storage.local
    chrome.storage.local.set({
        "horas-presenciais": horasPresenciais,
        "soma-intervalo": somaIntervalo
    }, async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Avisa a aba para atualizar os dados
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                if (typeof main_suap === 'function') {
                    // Remove o que já existe para forçar re-injeção
                    const elements = document.getElementsByClassName("chrome-extension");
                    while(elements.length > 0) elements[0].remove();
                    main_suap();
                }
            }
        });
        window.close(); // Fecha o popup após salvar
    });
});