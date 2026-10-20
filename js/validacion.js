$(document).ready(function() {
    $("#nombre").blur(function() {
        var nombre = $.trim($(this).val());
        if (nombre === "") {
            $("#nombreError").text("Por favor, ingresa tu nombre.");
        } else {
            $("#nombreError").text("");
        }
    });

    $("#apellido").blur(function() {
        var apellido = $.trim($(this).val());
        if (apellido === "") {
            $("#apellidoError").text("Por favor, ingresa tu apellido.");
        } else {
            $("#apellidoError").text("");
        }
    });

    $("#telefono").blur(function() {
        var telefono = $.trim($(this).val());
        var telefonoRegex = /^[0-9]{10}$/;
        if (telefono === "") {
            $("#telefonoError").text("Por favor, ingresa tu teléfono.");
        } else if (!telefonoRegex.test(telefono)) {
            $("#telefonoError").text("Por favor, ingresa un número de teléfono válido (10 dígitos).");
        } else {
            $("#telefonoError").text("");
        }
    });

    $("#mail").blur(function() {
        var mail = $.trim($(this).val());
        var mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (mail === "") {
            $("#emailError").text("Por favor, ingresa tu correo electrónico.");
        } else if (!mailRegex.test(mail)) {
            $("#emailError").text("Por favor, ingresa un correo electrónico válido.");
        } else {
            $("#emailError").text("");
        }
    });

    $("#fechaNacimiento").blur(function() {
        var fecha = $.trim($(this).val());
        if (fecha === "") {
            $("#fechaError").text("Por favor, ingresa la fecha.");
        } else {
            $("#fechaError").text("");
        }
    });

    $("#region").blur(function() {
        var region = $.trim($(this).val());
        if (region === "") {
            $("#regionError").text("Por favor, seleccione su región.");
        } else {
            $("#regionError").text("");
        }
    });

    $("#educacion").blur(function() {
        var educacion = $.trim($(this).val());
        if (educacion === "") {
            $("#educacionError").text("Por favor, seleccione su nivel educacional.");
        } else {
            $("#educacionError").text("");
        }
    });

    $("#formulario").submit(function(event) {
        var nombre = $.trim($("#nombre").val());
        var mail = $.trim($("#mail").val());
        var telefono = $.trim($("#telefono").val());
        var apellido = $.trim($("#apellido").val());
        var mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var fecha = $.trim($("#fechaNacimiento").val());
        var region = $.trim($("#region").val());
        var educacion = $.trim($("#educacion").val());

        if (nombre === "" || mail === "" || telefono === "" || apellido === "" || fecha === "" || region === "") {
            if (nombre === "") {
                $("#nombreError").text("Por favor, ingresa tu nombre.");
            }
            if (mail === "") {
                $("#emailError").text("Por favor, ingresa tu correo electrónico.");
            }
            if (telefono === "") {
                $("#telefonoError").text("Por favor, ingresa tu teléfono.");
            }
            if (apellido === "") {
                $("#apellidoError").text("Por favor, ingresa tu apellido.");
            }
            if (fecha === "") {
                $("#fechaError").text("Por favor, ingresa la fecha.");
            }
            if (region === "") {
                $("#regionError").text("Por favor, seleccione su región.");
            }
            if (educacion === "") {
                $("#educacionError").text("Por favor, seleccione su nivel educacional.");
            }
            event.preventDefault();
        } else if (!mailRegex.test(mail)) {
            $("#emailError").text("Por favor, ingresa un correo electrónico válido.");
            event.preventDefault();
        }
    });
});