/*
 * JS PARA CONECTAR CON API DE JAUJA
*/
//constantes
var idWrapper = 'caj-api-popup';
var idContenido = 'caj-content';
var wrapperPopup = '';
console.log('script api');

/*
 * Función que crea el html vacío del popup, pero no lo abre
*/
function createPopup() {
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class','caj-wrapper-box');
    wrapper.setAttribute('id', idWrapper);

    wrapper.innerHTML = `<div class="caj-outter-wrapper">
                            <div class="caj-inner-wrapper">
                                <button id="caj-close-popup"></button>
                                <div id="${idContenido}" class="caj-content"></div>
                            </div>
                        </div>`;

    if (wrapperPopup == '') {
        document.body.appendChild(wrapper);
    } else {
        document.querySelector(wrapperPopup).appendChild(wrapper);
    }

    //setea el clic del boton de cerrar caja
    setTimeout(function(){
        document.querySelector('#caj-close-popup').addEventListener('click', function(){
            
            caj_closeBox();

        });
    },200);
    
}//createPopup()


/*
 * funcion que abre el popup 
 */
function caj_openBox() {
    var box = document.querySelector('#'+idWrapper);
    if ( box != null ) {
        box.classList.add('open');
    }
}

 /*
  * función que cierra el popup y remueve el contenido
  */
function caj_closeBox() {
    var box = document.querySelector('#'+idWrapper);
    if ( box != null ) {
        box.classList.remove('open');

        var element = document.querySelector('#'+idContenido);
        element.parentNode.removeChild(element);
    }  
}

 /*
  * función que inserta el contenido
  * recibe el objeto
  */
function caj_writeData(data) {
    data = typeof data !== 'undefined' ?  data : null;

    if ( data == null ) {
        return true;
        console.error('no hay data para escribir');
    }
}

