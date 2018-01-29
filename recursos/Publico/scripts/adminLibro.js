function deleteLibro(e,object) {
    e.preventDefault();
    //asi miso el formulario yu los datos que estan en el body
	var divpadre = object.parentNode
	var divButton = divpadre.parentNode
    var datos = divButton.parentNode.getElementsByTagName("td")
    console.log(datos)
	var infoHTML = '<form id="deleteForm" action="/deleteLibreria" method="post"><label>Nombre: '+datos[1].innerHTML+
    '</label><br><label>Autor: '+datos[2].innerHTML+'</label>'+
    '<input type="hidden" value="'+datos[1].innerHTML+'" name="nombre"> </form>'
    swal({
        title: '¿Seguro que desea eliminar este Libro?',
        html: infoHTML,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si'
    },
    function(isConfirm) {
        if (isConfirm) {
            var divs = document.getElementsByTagName("div")
                var form;
                for (var i = 0; i < divs.length; i++) {
                    if (divs[i].className=="sweet-content") {
                        if (divs[i].firstChild.id=="deleteForm") {
                            form=divs[i].firstChild;
                            break;
                        };
                    };
                };
            if (form) {
                document.body.appendChild(form);
                form.submit()
            };
        }
    });
}