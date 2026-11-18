/* ==========================================================
   validacion.js (v2) · Formulario de contacto · Rutas del Patrimonio
   Requiere jQuery cargado ANTES de este archivo.
   ========================================================== */
$(function () {
    'use strict';

    // Si ves este mensaje en la consola (F12), el navegador está cargando ESTE archivo.
    console.info('validacion.js v2 cargado');

    /* ---------- Configuración ---------- */
    const EDAD_MAXIMA = 120; // años hacia atrás que se aceptan en la fecha de nacimiento

    /* ---------- Expresiones regulares ---------- */
    // Letras (con tildes, ñ y ü); permite nombres compuestos con espacio, guion o apóstrofe
    const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
    const REGEX_CORREO = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    // Celular chileno, probado sobre los DÍGITOS: 9 + 8 dígitos, con o sin el 56 delante.
    // Así sirven +56 9 1234 5678, +569 12345678, 56912345678, 9 1234 5678, etc.
    const REGEX_CELULAR = /^(?:56)?9\d{8}$/;

    /* ---------- Elementos del formulario ----------
       Se buscan por tipo dentro del formulario, así funcionan aunque los
       ids o los name del HTML cambien (mail/correo, autoSizingSelect/region, Tecnico/educacion). */
    const $form      = $('#formulario');
    const $nombre    = $('#nombre');
    const $apellido  = $('#apellido');
    const $correo    = $('#correo, #mail').first();
    const $telefono  = $('#telefono');
    const $fecha     = $form.find('input[type="date"]').first();
    const $region    = $form.find('select').first();
    const $educacion = $form.find('input[type="radio"]');
    const $mensaje   = $('#mensajeFormulario').length ? $('#mensajeFormulario') : $('<div id="mensajeFormulario" aria-live="polite"></div>').insertAfter($form);

    /* ---------- Utilidades ---------- */
    function limpio($el) {
        return ($el.val() || '').trim();
    }

    function soloDigitos(valor) {
        return valor.replace(/\D/g, '');
    }

    function fechaISO(d) {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return d.getFullYear() + '-' + mm + '-' + dd;
    }

    /* ---------- Validadores: devuelven '' si está bien, o el mensaje de error ---------- */
    function validarNombre($el, etiqueta) {
        const valor = limpio($el);
        if (valor === '') return 'Ingrese su ' + etiqueta + '.';
        if (valor.length < 2) return 'El ' + etiqueta + ' debe tener al menos 2 letras.';
        if (!REGEX_NOMBRE.test(valor)) {
            return 'El ' + etiqueta + ' solo puede contener letras, espacios, guiones o apóstrofes.';
        }
        return '';
    }

    function validarCorreo() {
        const valor = limpio($correo);
        if (valor === '') return 'Ingrese su correo.';
        if (!REGEX_CORREO.test(valor)) return 'Ingrese un correo válido, por ejemplo usuario@gmail.com.';
        return '';
    }

    function validarTelefono() {
        const valor = limpio($telefono);
        if (valor === '') return 'Ingrese su teléfono.';
        if (!REGEX_CELULAR.test(soloDigitos(valor))) {
            return 'Ingrese un celular chileno válido, por ejemplo +56 9 1234 5678.';
        }
        return '';
    }

    function validarFecha() {
        const valor = $fecha.val();
        if (!valor) return 'Seleccione su fecha de nacimiento.';

        const fecha = new Date(valor + 'T00:00:00');
        if (isNaN(fecha.getTime())) return 'La fecha ingresada no es válida.';

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fecha > hoy) return 'La fecha de nacimiento no puede ser futura.';

        const limite = new Date(hoy);
        limite.setFullYear(hoy.getFullYear() - EDAD_MAXIMA);
        if (fecha < limite) return 'Ingrese una fecha de nacimiento válida.';

        return '';
    }

    function validarRegion() {
        // La primera opción ("Seleccione su región") es solo el texto guía
        return $region.prop('selectedIndex') > 0 ? '' : 'Seleccione su región.';
    }

    function validarEducacion() {
        return $educacion.filter(':checked').length ? '' : 'Seleccione su nivel educacional.';
    }

    /* ---------- Definición de campos ----------
       $input   : elemento(s) que reciben las clases is-valid / is-invalid
       $error   : div donde se escribe el mensaje
       validar  : función que devuelve el mensaje ('' = correcto)
       eventos  : cuándo se valida al interactuar con el campo
       recortar : quita espacios sobrantes al salir del campo
       soloError: marca solo los errores (sin el check verde)           */
    const campos = [
        { $input: $nombre,    $error: $('#nombreError'),                validar: function () { return validarNombre($nombre, 'nombre'); },     eventos: 'blur change', recortar: true },
        { $input: $apellido,  $error: $('#apellidoError'),              validar: function () { return validarNombre($apellido, 'apellido'); }, eventos: 'blur change', recortar: true },
        { $input: $correo,    $error: $('#correoError, #emailError'),   validar: validarCorreo,                                                eventos: 'blur change', recortar: true },
        { $input: $telefono,  $error: $('#telefonoError'),              validar: validarTelefono,                                              eventos: 'blur change', recortar: true },
        { $input: $fecha,     $error: $('#fechaError'),                 validar: validarFecha,                                                 eventos: 'blur change' },
        { $input: $region,    $error: $('#regionError'),                validar: validarRegion,                                                eventos: 'blur change' },
        { $input: $educacion, $error: $('#educacionError'),             validar: validarEducacion,                                             eventos: 'change', soloError: true }
    ];

    /* ---------- Mostrar / quitar el resultado de una validación ---------- */
    function revisar(campo) {
        const mensaje = campo.validar();
        const invalido = mensaje !== '';

        campo.$error.text(mensaje);
        campo.$input
            .toggleClass('is-invalid', invalido)
            .toggleClass('is-valid', !invalido && !campo.soloError)
            .attr('aria-invalid', invalido ? 'true' : 'false');

        return !invalido;
    }

    function mostrarError(texto) {
        $mensaje.empty();
        $('<div>', {
            'class': 'alert alert-danger mt-3 mb-0',
            role: 'alert',
            text: texto
        }).appendTo($mensaje);
    }

    function limpiarEstados() {
        campos.forEach(function (campo) {
            campo.$input.removeClass('is-valid is-invalid').removeAttr('aria-invalid');
            campo.$error.text('');
        });
    }

    /* ---------- Ventana emergente "Enviado" (usa las clases de Bootstrap, sin su JS) ---------- */
    const $modalFondo = $('<div class="modal-backdrop show" style="display:none"></div>');
    const $modal = $(
        '<div class="modal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="modalEnviadoTitulo" style="display:none">' +
            '<div class="modal-dialog modal-dialog-centered">' +
                '<div class="modal-content text-center">' +
                    '<div class="modal-body p-4">' +
                        '<h5 class="modal-title mb-2" id="modalEnviadoTitulo">¡Enviado!</h5>' +
                        '<p class="mb-4 modal-texto"></p>' +
                        '<button type="button" class="btn btn-primary px-4 modal-cerrar">Aceptar</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
    const $modalCerrar = $modal.find('.modal-cerrar');
    $('body').append($modalFondo, $modal);

    function abrirModal(nombre) {
        $modal.find('.modal-texto').text('Gracias, ' + nombre + '. Tus datos fueron enviados correctamente.');
        $modalFondo.css('display', 'block');
        $modal.css('display', 'block').addClass('show');
        $('body').css('overflow', 'hidden');
        $modalCerrar.trigger('focus');
    }

    function cerrarModal() {
        $modal.css('display', 'none').removeClass('show');
        $modalFondo.css('display', 'none');
        $('body').css('overflow', '');
        $form.find('[type="submit"]').first().trigger('focus');
    }

    $modalCerrar.on('click', cerrarModal);
    $modal.on('click', function (e) { if (e.target === this) cerrarModal(); });   // clic fuera de la ventana
    $modal.on('keydown', function (e) { if (e.key === 'Tab') { e.preventDefault(); $modalCerrar.trigger('focus'); } });
    $(document).on('keydown', function (e) { if (e.key === 'Escape' && $modal.is(':visible')) cerrarModal(); });

    /* ---------- Validación en vivo ---------- */
    campos.forEach(function (campo) {
        campo.$input.on(campo.eventos, function () {
            if (campo.recortar) campo.$input.val(limpio(campo.$input));
            revisar(campo);
        });

        // Si el campo ya está en rojo, se revalida mientras se corrige
        campo.$input.on('input', function () {
            if (campo.$input.hasClass('is-invalid')) revisar(campo);
        });
    });

    // Teléfono: no deja escribir letras ni símbolos raros
    $telefono.on('input', function () {
        this.value = this.value.replace(/[^\d+\s().-]/g, '');
    });

    // Teléfono: si es válido, lo deja con el formato +56 9 1234 5678
    $telefono.on('blur', function () {
        const digitos = soloDigitos(limpio($telefono));
        if (REGEX_CELULAR.test(digitos)) {
            const d = digitos.slice(-9);
            $telefono.val('+56 ' + d.charAt(0) + ' ' + d.slice(1, 5) + ' ' + d.slice(5));
        }
    });

    // Fecha: el calendario no deja elegir días futuros
    $fecha.attr('max', fechaISO(new Date()));

    /* ---------- Envío ---------- */
    $form.on('submit', function (e) {
        e.preventDefault();
        $mensaje.empty();

        let primerInvalido = null;
        campos.forEach(function (campo) {
            if (!revisar(campo) && primerInvalido === null) {
                primerInvalido = campo.$input.first();
            }
        });

        // Si algo falta o está mal, NO se envía
        if (primerInvalido) {
            primerInvalido.trigger('focus');
            mostrarError('Revise los campos marcados en rojo e inténtelo nuevamente.');
            return;
        }

        const datos = {
            nombre: limpio($nombre),
            apellido: limpio($apellido),
            correo: limpio($correo),
            telefono: limpio($telefono),
            fechaNacimiento: $fecha.val(),
            region: $region.find('option:selected').text(),
            educacion: $educacion.filter(':checked').val()
        };

        // Aquí se enviarían los datos al servidor, por ejemplo:
        // $.post('/ruta-del-servidor', datos);
        console.log('Datos del formulario:', datos);

        $form[0].reset();
        limpiarEstados();
        abrirModal(datos.nombre);
    });
});