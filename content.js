const DiccionarioMaestro = new Map();

async function cargarArchivo(nombreArchivo) {
    try {
        const url = chrome.runtime.getURL(`data/${nombreArchivo}.csv`);
        const response = await fetch(url);
        const data = await response.text();
        
        data.split('\n').forEach((linea, index) => {
            if (index === 0 || !linea.trim()) return;
            const [en, es] = linea.split(';');
            if (en && es) DiccionarioMaestro.set(en.trim(), es.trim());
        });
    } catch (e) {
        console.error(`Error cargando ${nombreArchivo}:`, e);
    }
}

function traducirNodo(nodo) {
    if (nodo.nodeType === Node.TEXT_NODE) {
        let textoOriginal = nodo.textContent.trim();
        
        // 1. Intentar traducir la frase completa (Ej: "Body Slam")
        if (DiccionarioMaestro.has(textoOriginal)) {
            nodo.textContent = DiccionarioMaestro.get(textoOriginal);
            return; // Si coincide el bloque completo, terminamos aquí
        }

        // 2. Si no hay coincidencia exacta, aplicar la traducción por palabras 
        // (útil para descripciones o textos largos)
        const palabras = nodo.textContent.split(/(\W+)/);
        const traducido = palabras.map(palabra => {
            return DiccionarioMaestro.has(palabra) ? DiccionarioMaestro.get(palabra) : palabra;
        }).join('');

        if (traducido !== nodo.textContent) {
            nodo.textContent = traducido;
        }
    } else {
        nodo.childNodes.forEach(hijo => traducirNodo(hijo));
    }
}

function iniciarObservador() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                // Traducimos el nuevo nodo y todos sus hijos
                traducirNodo(node);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Carga secuencial de datos
async function inicializar() {
    console.log("Cargando diccionarios...");
    await cargarArchivo('moves');
    await cargarArchivo('items');
    await cargarArchivo('abilities');
    console.log("Diccionario completo:", DiccionarioMaestro.size, "entradas.");
    
    // Traducir lo que ya existe
    traducirNodo(document.body);
    
    // Escuchar cambios futuros
    iniciarObservador();
}

inicializar();