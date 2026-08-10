// --- 1. CONFIGURACIÓN GENERAL ---
const WHATSAPP_NUMBER = '51972687772'; // Tu número real

// Inicializar íconos de Lucide (por si se necesitan)
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Poner año actual en el footer
const yearElement = document.getElementById('current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// --- 2. LÓGICA DEL MENÚ MÓVIL ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        // Tu CSS ahora usa la clase "active" para mostrar el menú
        mobileMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace móvil
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

// --- 3. LÓGICA DEL COTIZADOR ---
const datosCotizador = {
    productos: {
        'tarjetas': { nombre: 'Tarjetas de Presentación', precioBase: 40 },
        'volantes_a5': { nombre: 'Volantes A5', precioBase: 70 },
        'gigantografia': { nombre: 'Gigantografía (m2)', precioBase: 15 },
        'vinil': { nombre: 'Vinil Impreso (m2)', precioBase: 25 },
    },
    acabados: {
        'estandar': { nombre: 'Estándar', multiplicador: 1 },
        'premium': { nombre: 'Premium (Mate/Brillante)', multiplicador: 1.2 },
        'lujo': { nombre: 'Lujo (Sectorizado/Troquel)', multiplicador: 2.5 },
    }
};

const selectProducto = document.getElementById('form-producto');
const selectAcabado = document.getElementById('form-acabado');
const selectCantidad = document.getElementById('form-cantidad');
const displayTotal = document.getElementById('display-total'); // Puede que no exista en el HTML actual, y está bien

function calcularTotalCotizacion() {
    // Si los selectores no existen, detenemos la función para evitar errores
    if (!selectProducto || !selectAcabado || !selectCantidad) return;

    const idProducto = selectProducto.value;
    const idAcabado = selectAcabado.value;
    const cantidad = parseFloat(selectCantidad.value);

    const producto = datosCotizador.productos[idProducto];
    const acabado = datosCotizador.acabados[idAcabado];

    if (producto && acabado) {
        const total = producto.precioBase * cantidad * acabado.multiplicador;

        // Solo intentamos mostrarlo en pantalla si el elemento visual existe
        if (displayTotal) {
            displayTotal.textContent = total.toFixed(2);
        }
    }
}

// Escuchar cambios en los selectores
if (selectProducto && selectAcabado && selectCantidad) {
    selectProducto.addEventListener('change', calcularTotalCotizacion);
    selectAcabado.addEventListener('change', calcularTotalCotizacion);
    selectCantidad.addEventListener('change', calcularTotalCotizacion);
}


// --- 4. LÓGICA DE REDIRECCIÓN A WHATSAPP ---

function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

function enviarWhatsAppGeneral(mensajeOpcional) {
    // Si no le pasan un mensaje, usa el mensaje por defecto
    const mensaje = typeof mensajeOpcional === 'string' ? mensajeOpcional : 'Hola MARPU, quisiera más información sobre sus servicios de imprenta.';
    abrirWhatsApp(mensaje);
}

function enviarWhatsAppProducto(nombreProducto) {
    const mensaje = `Hola MARPU, me interesa el producto: *${nombreProducto}* que vi en su catálogo. ¿Podrían darme más detalles?`;
    abrirWhatsApp(mensaje);
}

function enviarCotizacionCalculada() {
    // Verificamos que los campos del cotizador existan
    if (!selectProducto || !selectAcabado || !selectCantidad) {
        enviarWhatsAppGeneral('Hola, quiero hacer una cotización.');
        return;
    }

    const idProducto = selectProducto.value;
    const idAcabado = selectAcabado.value;

    // Obtenemos el texto visible y el número real
    const cantidadTexto = selectCantidad.options[selectCantidad.selectedIndex].text;
    const cantidadNum = parseFloat(selectCantidad.value);

    const producto = datosCotizador.productos[idProducto];
    const acabado = datosCotizador.acabados[idAcabado];

    if (producto && acabado) {
        // Calculamos el total en el momento exacto de enviar el mensaje
        const total = (producto.precioBase * cantidadNum * acabado.multiplicador).toFixed(2);

        const nombreProducto = producto.nombre;
        const nombreAcabado = acabado.nombre;

        const mensaje = `¡Hola MARPU! He realizado una cotización en su página web:\n\n*Producto:* ${nombreProducto}\n*Cantidad:* ${cantidadTexto}\n*Acabado:* ${nombreAcabado}\n*Total Estimado:* S/ ${total}\n\nQuisiera proceder con este pedido o recibir más detalles.`;

        abrirWhatsApp(mensaje);
    }
}