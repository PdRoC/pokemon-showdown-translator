// content.js
async function iniciarTraduccion() {
    // 1. Cargar los datos (suponiendo que compilamos todo a un solo JSON)
    const response = await fetch(chrome.runtime.getURL('data/diccionario.json'));
    const diccionario = await response.json();
    
    // 2. Detectar idioma
    const lang = (navigator.language || navigator.userLanguage).split('-')[0].toUpperCase();
    const traducciones = diccionario[lang] || diccionario['ES'];

    // 3. Función de escaneo
    const traducir = () => {
        // Selectores que cubren botones, nombres de ataques en lista y resultados de búsqueda
        const selectores = [
            'button[name="chooseMove"]', 
            '.movename', 
            '.result .col.movenamecol', 
            '.utilichart .move',
            '.battle-history',
            'span'
        ];
        
        const elementos = document.querySelectorAll(selectores.join(','));
        
        elementos.forEach(el => {
            // En el Teambuilder, el texto a veces está en un nodo hijo o mezclado con iconos
            // Usamos textNodes para no cargar etiquetas de iconos (Tipos)
            let nodes = el.childNodes;
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    let textoOriginal = node.textContent.trim();
                    
                    traducciones.forEach(([en, es]) => {
                        if (textoOriginal === en) {
                            node.textContent = es;
                        }
                    });
                }
            });
        });
    };

    // 4. Observador de cambios
    const observer = new MutationObserver((mutations) => {
        // Pequeño retardo para no colapsar el navegador si hay muchos cambios
        traducir();
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        characterData: true // Esto detecta si cambia el texto dentro de un nodo ya existente
    });
}

iniciarTraduccion();
