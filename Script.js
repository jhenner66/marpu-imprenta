
    // --- 1. CONFIGURACIÓN GENERAL ---
    const WHATSAPP_NUMBER = '51972687772'; // REEMPLAZA CON TU NÚMERO REAL

    // Inicializar íconos de Lucide
    lucide.createIcons();

    // Poner año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- 2. LÓGICA DEL MENÚ MÓVIL ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    let isMenuOpen = false;

    function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
    mobileMenu.classList.remove('mobile-menu-hidden');
    // Cambiar el icono visualmente a una 'X' usando la API de Lucide si es necesario,
    // o para mantenerlo simple, solo manejamos la visibilidad.
} else {
    mobileMenu.classList.add('mobile-menu-hidden');
}
}

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en un enlace
    mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if(isMenuOpen) toggleMenu();
    });
});

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
    const displayTotal = document.getElementById('display-total');

    function calcularTotalCotizacion() {
    const idProducto = selectProducto.value;
    const idAcabado = selectAcabado.value;
    const cantidad = parseFloat(selectCantidad.value);

    const producto = datosCotizador.productos[idProducto];
    const acabado = datosCotizador.acabados[idAcabado];

    if (producto && acabado) {
    const total = producto.precioBase * cantidad * acabado.multiplicador;
    displayTotal.textContent = total.toFixed(2);
}
}

    // Escuchar cambios en los selectores
    selectProducto.addEventListener('change', calcularTotalCotizacion);
    selectAcabado.addEventListener('change', calcularTotalCotizacion);
    selectCantidad.addEventListener('change', calcularTotalCotizacion);


    // --- 4. LÓGICA DE REDIRECCIÓN A WHATSAPP ---

    function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

    function enviarWhatsAppGeneral(mensajeOpcional) {
    const mensaje = mensajeOpcional || 'Hola MARPU, quisiera más información sobre sus servicios de imprenta.';
    abrirWhatsApp(mensaje);
}

    function enviarWhatsAppProducto(nombreProducto) {
    const mensaje = `Hola MARPU, me interesa el producto: *${nombreProducto}* que vi en su catálogo. ¿Podrían darme más detalles?`;
    abrirWhatsApp(mensaje);
}

    function enviarCotizacionCalculada() {
    const idProducto = selectProducto.value;
    const idAcabado = selectAcabado.value;
    const cantidad = selectCantidad.options[selectCantidad.selectedIndex].text; // Obtenemos el texto visible (ej. "1 Millar")
    const total = displayTotal.textContent;

    const nombreProducto = datosCotizador.productos[idProducto].nombre;
    const nombreAcabado = datosCotizador.acabados[idAcabado].nombre;

    const mensaje = `¡Hola MARPU! He realizado una cotización en su página web:\n\n*Producto:* ${nombreProducto}\n*Cantidad:* ${cantidad}\n*Acabado:* ${nombreAcabado}\n*Total Estimado:* S/ ${total}\n\nQuisiera proceder con este pedido o recibir más detalles.`;

    abrirWhatsApp(mensaje);
}

