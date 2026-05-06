chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "notificarSaida") {
        const agora = new Date().toLocaleDateString();
        const storageKey = `notificado_${agora}`;

        // Verifica se já notificou hoje para não ser chato
        chrome.storage.local.get([storageKey], (result) => {
            if (!result[storageKey]) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: '../favicons/favicon.png',
                    title: 'Saída Estimada SUAP',
                    message: `Atenção! Faltam apenas 10 minutos para sua saída estimada (${request.hora}).`,
                    priority: 2
                });

                // Marca como notificado hoje
                const data = {};
                data[storageKey] = true;
                chrome.storage.local.set(data);
            }
        });
    }
});
