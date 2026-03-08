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
        const elementos = document.querySelectorAll('button, span, .col, .battle-history');
        elementos.forEach(el => {
            if (el.children.length === 0 && el.innerText.trim() !== "") {
                let texto = el.innerText;
                traducciones.forEach(([en, es]) => {
                    const regex = new RegExp('\\b' + en + '\\b', 'g');
                    if (regex.test(texto)) {
                        texto = texto.replace(regex, es);
                    }
                });
                if (el.innerText !== texto) el.innerText = texto;
            }
        });
    };

    // 4. Observador de cambios
    const observer = new MutationObserver(traducir);
    observer.observe(document.body, { childList: true, subtree: true });
    traducir();
}

iniciarTraduccion();
