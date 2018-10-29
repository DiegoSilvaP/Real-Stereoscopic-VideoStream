function upload(input) {

    var ArchivoFoto = document.forms["form1"]["file"].value;
    var OpcionOficina = document.forms["form1"]["oficina"].value;
    var OpcionCarpeta = document.forms["form1"]["carpeta"].value;
    // console.log("INPUT: ", ArchivoFoto)
    if (ArchivoFoto == "") {
        alert("Por favor, selecciona una foto!");
        return false;
    }
    if (OpcionOficina == "0" || OpcionOficina == "") {
        alert("Por favor, selecciona una oficina!");
        return false;
    }
    if (OpcionCarpeta == "0" || OpcionCarpeta == "") {
        alert("Por favor, selecciona una carpeta!");
        return false;
    } else {
        var modal = document.querySelector('ons-modal');
        modal.show();
        var xhr = new XMLHttpRequest();
        // xhr.open("POST", "http://192.168.1.8:8080/file/upload/", true);
        // xhr.open("POST", "http://10.0.82.113:8080/file/upload/", true);
        xhr.open("POST", "http://infile.co/file/upload/", true);
        xhr.onload = function (event) {
            toast("Documento cargado correctamente");
            modal.hide();
            document.getElementById('photo').src = null;
            document.getElementById("photo").style.display = "none";
            document.forms["form1"]["file"].value = "";
            $("#selectOficinas").val('');
            $("#selectCarpetas").append("<option value=''>-- Selecciona una carpeta --</option>");
            $("#selectCarpetas").val('');
        };
        xhr.onerror = function (event) {
            toast("Error al subir el documento");
            modal.hide();
        }
        xhr.send(new FormData(input.parentElement));
    }
}




let app = {
    init: function () {
        document.getElementById('btn').addEventListener('click', app.takephoto);

        // $.getJSON("http://192.168.1.8:8080/file/oficinas/", function (data) {
        // $.getJSON("http://10.0.82.113:8080/file/oficinas/", function (data) {
            $.getJSON("http://infile.co/file/oficinas/", function (data) {
            // var items = [];
            $.each(data, function (key, val) {
                $("#selectOficinas").append("<option  value='" + val.id + "'>" + val.nombre + "</option>");
                // console.log("OFICINAS: ", val.id, " - ", val.nombre)
            });
            $("#selectOficinas").change();
        });

        $('#selectOficinas').change(function () {
            // $.post('http://192.168.1.8:8080/file/carpetas/', {
            // $.post('http://10.0.82.113:8080/file/carpetas/', {
                    $.post('http://infile.co/file/carpetas/', {
                    oficina: $('#selectOficinas').val(),
                },
                function (returnedData) {
                    $("#selectCarpetas").empty();
                    $.each(returnedData, function (key, val) {
                        $("#selectCarpetas").append("<option value='" + val.id + "'>" + val.nombre + "</option>");
                    });
                });
        });
    },
    takephoto: function () {
        let opts = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            mediaType: Camera.MediaType.PICTURE,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: Camera.Direction.BACK,
            targetWidth: 1366,
            targetHeight: 768
        };

        navigator.camera.getPicture(app.ftw, app.wtf, opts);
    },
    ftw: function (imgURI) {
        document.getElementById('photo').src = "data:image/jpeg;base64," + imgURI;
        document.getElementById("photo").style.display = "block";
        document.getElementById('msg').value = imgURI;
        toast("Imagen cargada");
    },
    wtf: function (msg) {
        document.getElementById('msg').textContent = msg;
    }
};


function toast(mensaje) {
    ons.notification.toast(mensaje, {
        timeout: 3500,
        animation: 'fall',

    })
}

document.addEventListener('deviceready', app.init);
