// --- 1. CONFIGURACIÓN E INICIALIZACIÓN ---
const WHATSAPP_NUMBER = '51972687772';

if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- 2. ANIMACIONES AL SCROLLEAR ---
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

// Efecto sombra en el Header al scrollear
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// --- 3. MENÚ MÓVIL ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenu.classList.contains('active') ? 'fa-xmark' : 'fa-bars';
        mobileMenuBtn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    });
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        });
    });
}

// --- 4. LÓGICA DEL COTIZADOR AVANZADO (B2B y B2C) ---
const datosCotizador = {
    productos: {
        'tarjetas': { nombre: 'Tarjetas de Presentación', precioBase: 45 },
        'volantes_a5': { nombre: 'Volantes A5', precioBase: 75 },
        'stickers': { nombre: 'Stickers Personalizados (Ciento)', precioBase: 25 },
        'tazas': { nombre: 'Tazas Personalizadas', precioBase: 12 },
        'gigantografia': { nombre: 'Gigantografía', precioBase: 18 },
        'vinil': { nombre: 'Vinil Impreso', precioBase: 28 },
    },
    acabados: {
        'estandar': { nombre: 'Básico / Estándar', multiplicador: 1 },
        'premium': { nombre: 'Premium (Mate/Brillante)', multiplicador: 1.25 },
        'lujo': { nombre: 'Lujo (Acabados especiales)', multiplicador: 2.5 },
    }
};

const selectProducto = document.getElementById('form-producto');
const selectAcabado = document.getElementById('form-acabado');
const selectCantidad = document.getElementById('form-cantidad');
const displayTotal = document.getElementById('display-total');

function calcularTotalCotizacion() {
    if (!selectProducto || !selectAcabado || !selectCantidad) return;
    const idProducto = selectProducto.value;
    const idAcabado = selectAcabado.value;
    const cantidad = parseFloat(selectCantidad.value);

    const producto = datosCotizador.productos[idProducto];
    const acabado = datosCotizador.acabados[idAcabado];

    if (producto && acabado) {
        let total = producto.precioBase * cantidad * acabado.multiplicador;
        // Descuento automático por volumen
        if (cantidad >= 10) { total = total * 0.9; } // 10% descuento

        if (displayTotal) {
            // Animación de conteo rápido para el precio
            let startTimestamp = null;
            const duration = 500;
            const startValue = parseFloat(displayTotal.textContent) || 0;

            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                displayTotal.textContent = (startValue + progress * (total - startValue)).toFixed(2);
                if (progress < 1) { window.requestAnimationFrame(step); }
            };
            window.requestAnimationFrame(step);
        }
    }
}

if (selectProducto) {
    selectProducto.addEventListener('change', calcularTotalCotizacion);
    selectAcabado.addEventListener('change', calcularTotalCotizacion);
    selectCantidad.addEventListener('change', calcularTotalCotizacion);
    calcularTotalCotizacion(); // Calcular al inicio
}

// --- 5. LÓGICA DE WHATSAPP ---
function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

function enviarWhatsAppGeneral(mensajeOpcional) {
    const mensaje = typeof mensajeOpcional === 'string' ? mensajeOpcional : 'Hola MARPU. Vengo de su página web y me gustaría hacer una consulta sobre un trabajo de impresión.';
    abrirWhatsApp(mensaje);
}

function enviarWhatsAppProducto(nombreProducto) {
    const mensaje = `Hola MARPU. Estoy interesado en el servicio de: *${nombreProducto}*. ¿Podrían enviarme más información y precios?`;
    abrirWhatsApp(mensaje);
}

function enviarCotizacionCalculada() {
    if (!selectProducto) return;
    const idProducto = selectProducto.value;
    const idAcabado = selectAcabado.value;
    const cantidadTexto = selectCantidad.options[selectCantidad.selectedIndex].text;

    const producto = datosCotizador.productos[idProducto];
    const acabado = datosCotizador.acabados[idAcabado];

    const mensaje = `¡Hola MARPU! He cotizado en su web y tengo el siguiente pedido:\n\n`+
        `*Tipo de Trabajo:* ${producto.nombre}\n`+
        `*Calidad requerida:* ${acabado.nombre}\n`+
        `*Cantidad:* ${cantidadTexto}\n`+
        `¿Me pueden confirmar el costo final y cómo envío mi diseño?`;

    abrirWhatsApp(mensaje);
}


// Configuración de la API de Gemini
const GEMINI_API_KEY = "AQ.Ab8RN6KwDmfAXfqMpGjfQDKAhYg7USdG_e6RviEZ699VHl9eFQ"; // En Canvas, dejar vacío para usar inyección automática
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

// Instrucciones del sistema
const systemPrompt = `Eres un asesor de ventas y diseñador gráfico experto que trabaja para 'MARPU', una imprenta ubicada en Chiclayo, Perú. 
    Tu objetivo es ayudar a los clientes a tomar decisiones sobre sus proyectos de impresión.
    - Conoces a la perfección tipos de papel (couche, foldcote, bond, opalina, adhesivo, vinil, lona para gigantografías).
    - Conoces de acabados (plastificado mate o brillante, barniz sectorizado, troquelado, empastado).
    - Puedes ayudar a redactar ideas creativas para volantes, tarjetas, invitaciones, etc.
    - Tu tono es profesional, súper amable, persuasivo y comercial.
    - NUNCA des precios exactos, diles que usen la calculadora de la web o el botón de WhatsApp.
    - Al final de buenas recomendaciones, anima al cliente a hacer su pedido contactando al WhatsApp oficial.
    - Mantén las respuestas relativamente cortas y fáciles de leer en un chat.`;

let aiChatHistory = [];

// Elementos del DOM para el chat
const btnToggleChat = document.getElementById('ai-chat-toggle');
const btnCloseChat = document.getElementById('close-ai-chat');
const modalChat = document.getElementById('ai-chat-modal');
const inputChat = document.getElementById('ai-chat-input');
const btnSendChat = document.getElementById('ai-chat-send');
const messagesContainer = document.getElementById('ai-chat-messages');
const typingIndicator = document.getElementById('ai-typing');

// Abrir/Cerrar Modal
btnToggleChat.addEventListener('click', () => {
    modalChat.classList.toggle('active'); // Modificación aquí
    // Solo darle foco al input si se está abriendo
    if (modalChat.classList.contains('active')) {
        inputChat.focus();
    }
});
btnCloseChat.addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir cualquier comportamiento por defecto
    modalChat.classList.remove('active');
});

// Agregar mensaje a la interfaz
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

    // Parse basic markdown like bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    msgDiv.innerHTML = formattedText;

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Retraso para el backoff exponencial
const delay = ms => new Promise(res => setTimeout(res, ms));

// Llamada a Gemini API
async function sendMessageToGemini(userText) {
    if (!userText.trim()) return;

    // 1. Mostrar mensaje del usuario
    appendMessage(userText, 'user');
    inputChat.value = '';
    inputChat.disabled = true;
    btnSendChat.disabled = true;
    typingIndicator.style.display = 'block';

    // 2. Agregar al historial temporal
    aiChatHistory.push({ role: "user", parts: [{ text: userText }] });

    // 3. Preparar el Payload
    const payload = {
        contents: aiChatHistory,
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    let retryCount = 0;
    let success = false;
    let responseData = null;

    // Implementando Exponential Backoff en caso de Throttling
    while (retryCount < 3 && !success) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                responseData = await response.json();
                success = true;
            } else if (response.status === 429) {
                // Too many requests - Exponential Backoff
                retryCount++;
                await delay(Math.pow(2, retryCount) * 1000);
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            if (retryCount >= 2) {
                typingIndicator.style.display = 'none';
                appendMessage("Ups, tuve un problema de conexión. ¿Podrías intentar de nuevo o contactarnos directo por WhatsApp?", 'bot');
                inputChat.disabled = false;
                btnSendChat.disabled = false;
                return;
            }
            retryCount++;
            await delay(Math.pow(2, retryCount) * 1000);
        }
    }

    // 4. Procesar respuesta exitosa
    if (success && responseData && responseData.candidates && responseData.candidates.length > 0) {
        const botReply = responseData.candidates[0].content.parts[0].text;

        // Actualizar UI
        typingIndicator.style.display = 'none';
        appendMessage(botReply, 'bot');

        // Guardar en historial
        aiChatHistory.push({ role: "model", parts: [{ text: botReply }] });
    }

    inputChat.disabled = false;
    btnSendChat.disabled = false;
    inputChat.focus();
}

// Eventos de Envío
btnSendChat.addEventListener('click', () => sendMessageToGemini(inputChat.value));
inputChat.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessageToGemini(inputChat.value);
});
