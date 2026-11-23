const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzCKLOq-TdW1zIm3YwGZujAqOgNTOZq9hrI3RpN6oprDM-luEEEE4bY6XYnzudQTWlq/exec";
const TOKEN = "sergio";
const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

$(document).ready(function () {

    function valor(selector) {
        return ($(selector).val() || "").toString().trim();
    }

    function validar(campo, errorId, comprobar) {
        const mensaje = comprobar(valor(campo));
        $(errorId).text(mensaje);
        return mensaje === "";
    }

    const validaciones = {
        nombre: () => validar("#nombre", "#nombreError", v =>
            v === "" ? "Por favor, ingresa tu nombre." : ""),

        apellido: () => validar("#apellido", "#apellidoError", v =>
            v === "" ? "Por favor, ingresa tu apellido." : ""),

        mail: () => validar("#mail", "#emailError", v => {
            if (v === "") return "Por favor, ingresa tu correo electrónico.";
            if (!mailRegex.test(v)) return "Por favor, ingresa un correo electrónico válido.";
            return "";
        }),
        telefono: () => validar("#telefono", "#telefonoError", v => {
            if (v === "") return "Por favor, ingresa tu teléfono.";
            const limpio = v.replace(/[\s\-()]/g, "");
            if (!/^(\+?56)?9\d{8}$/.test(limpio)) return "Ingresa un teléfono válido (ej: +56 9 1234 5678 o 912345678).";
            return "";
        }),

        fecha: () => validar("input[type='date']", "#fechaError", v =>
            v === "" ? "Por favor, ingresa la fecha." : ""),

        region: () => validar("#autoSizingSelect", "#regionError", v =>
            $("#autoSizingSelect").prop("selectedIndex") === 0 ? "Por favor, seleccione su región." : ""),

        educacion: () => validar("input[name='Tecnico']:checked", "#educacionError", v =>
            $("input[name='Tecnico']:checked").length === 0 ? "Por favor, seleccione su nivel educacional." : "")
    };

    $("#nombre").on("blur", validaciones.nombre);
    $("#apellido").on("blur", validaciones.apellido);
    $("#mail").on("blur", validaciones.mail);
    $("#telefono").on("blur", validaciones.telefono);
    $("input[type='date']").on("blur change", validaciones.fecha);
    $("#autoSizingSelect").on("blur change", validaciones.region);
    $("input[name='Tecnico']").on("change", validaciones.educacion);

    function enviarASheets() {
        const radio = $("input[name='Tecnico']:checked");
        const nivel = $("label[for='" + radio.attr("id") + "']").text();

        const datos = new URLSearchParams({
            token: TOKEN,
            nombre: valor("#nombre"),
            apellido: valor("#apellido"),
            correo: valor("#mail"),
            telefono: valor("#telefono"),
            fechaNacimiento: valor("input[type='date']"),
            region: $("#autoSizingSelect option:selected").text(),
            nivelEducacional: nivel
        });

        return fetch(URL_SCRIPT, {
            method: "POST",
            body: datos
        }).then(res => res.text());
    }

    $("#formulario").on("submit", function (event) {
        event.preventDefault();

        const resultados = Object.values(validaciones).map(fn => fn());
        if (resultados.includes(false)) return;

        const boton = $(this).find("button[type=submit]").prop("disabled", true);

        enviarASheets()
            .then((respuesta) => {
                if (respuesta.toLowerCase().includes("error")) {
                    alert("El script respondió: " + respuesta);
                    return;
                }
                alert("¡Datos enviados correctamente!");
                this.reset();
            })
            .catch((error) => {
                console.log(error);
                alert("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.");
            })
            .finally(() => boton.prop("disabled", false));
    });
});