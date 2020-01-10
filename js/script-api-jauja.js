/*
 * JS PARA CONECTAR CON API DE JAUJA
*/
//constantes
var idWrapper = 'caj-api-popup';
var idContenido = 'caj-content';
var wrapperPopup = '.wrapper';//la clase o id donde se va a insertar el popup
var classButtonLocal = '.caj-local-sabores';//la clase o id que esta puesta en los botones de ver sabores
var classButtonSabores = '.caj-local-sucursales';//la clase o id que esta puesta en los botones de ver sabores
var urlApiSabores = 'https://jauja.club/api/sucursales/'//+id
var urlApiSucursales = 'https://jauja.club/api/sabores/'//+id

document.addEventListener("DOMContentLoaded", function(event) { 
    init();
});

//inicia el proceso
function init () {
    //crea los click
    var btnsLocales = document.querySelectorAll(classButtonLocal);
    var btnsSabores = document.querySelectorAll(classButtonSabores);

    if (btnsLocales) {
        //pagina de ver sabores

        createPopup();

        for (var i = 0; i < btnsLocales.length; i++) {
            btnsLocales[i].addEventListener('click', function(){
                event.preventDefault();
                var id = this.getAttribute('href');
                caj_openBox();
                getSabores(id);
            });
        }

    }

    if (btnsSabores) {
        //pagina de ubicar sabor en sucursales

        createPopup();

        for (var i = 0; i < btnsSabores.length; i++) {
            btnsSabores[i].addEventListener('click', function(){
                event.preventDefault();
                var id = this.getAttribute('href');
                caj_openBox();
                getSucursales(id);
            });
        }
    }


    
}

/*
 * Función que crea el html vacío del popup, pero no lo abre
*/
function createPopup() {
    var wrapper = document.createElement('div');
    wrapper.setAttribute('class','caj-wrapper-box');
    wrapper.setAttribute('id', idWrapper);

    wrapper.innerHTML = `<div class="caj-outter-wrapper">
                            <div class="caj-inner-wrapper">
                                <div class="lds-dual-ring"></div>
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
    if ( box ) {
        box.classList.remove('open');

        document.querySelector('#'+idContenido).innerHTML = '';
        
        box.querySelector('.lds_dual-ring').style.display = 'inline-block';
    }  
}

function caj_getFromLocalStore(key) {
    var item = localStorage[key];
    if ( typeof item !== 'undefined' ) {
        return item;
    } else {
        return false;
    }
}

/*
 * Save data in Local Storage
 * @param: key & data
*/
function caj_saveInLocalStore(key, data) {
    localStorage.setItem(key, data);
}

function caj_deleteInLocalStore(key) {
    localStorage.removeItem(key);
}

function caj_getJsonFile (id, route) {
    return new Promise(
        function (resolve, reject) {
            
            var jsonFile = caj_getFromLocalStore('sucursal_'+id);
            
            if ( jsonFile ) {
                
                resolve( JSON.parse(jsonFile) );
                
            } else {

                var misCabeceras = new Headers(
                    {
                        'Access-Control-Allow-Origin':'*',
                    }
                );

                var miInit = {
                        method: 'GET',
                        headers: misCabeceras,
                        mode: 'cors',
                        cache: 'default'
                    };

                fetch(route + id, miInit)
                .then(function(response) {
                    
                    if ( response.ok ) {

                        return response.json();

                    } else {
                        
                        caj_closeBox();
                        console.log('response no ok');
                        
                    }
                        
                })
                .then(function(jsonFile){
                    
                    caj_saveInLocalStore('sucursal_'+id, JSON.stringify(jsonFile) );
    
                    resolve( jsonFile );
                })
                .catch(function(error) {
                    console.log('Hubo un problema con la petición Fetch:' + error);
                    caj_closeBox();
                });
    
            }
    
        }
    );
}


/*
 * función que busca los sabores que tiene la sucursal del id
*/
function getSabores(id) {
    id = typeof id !== 'undefined' ?  id : null;

    if(id == null ) {
        return true;
    }
    
    
    //caj_getJsonFile(id ,urlApiSabores).then(function(sucursalInfo) {
    caj_getJsonFile('sucursal.json' ,'https://www.heladosjauja.com.ar/web/wp-content/plugins/connect-api-jauja/ejemplo/').then(function(sucursalInfo) {
        
        var sabores = sucursalInfo.productos_sucursal[2].sabores;

        caj_writeData(sabores);
    })

}

/*
 * función que busca las sucursales que tiene el sabor del id
*/
function getSucursales(id) {
    id = typeof id !== 'undefined' ?  id : null;

    if(id == null ) {
        return true;
    }
    console.log(id);
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
        caj_closeBox();
    }

    var contenedor = document.querySelector('#'+idContenido);
    
    //oculto el spinner
    var box = document.querySelector('#'+idWrapper);
    box.querySelector('.lds-dual-ring').style.display = 'none';

    console.log(data);

    var titulo = document.createElement('h2');
    titulo.setAttribute('class', 'caj-titulo-sabores');
    titulo.innerText = 'Sabores de esta sucursal';

    contenedor.append(titulo);
    
    var ulCategorias = document.createElement('ul');
        ulCategorias.setAttribute('class', 'caj-lista-categoria');

    Object.keys(data).forEach(key => {
        
        var liCategoria = document.createElement('li');
            liCategoria.setAttribute('class', 'caj-li-categoria');
            liCategoria.innerHTML = `<h3 class="titulo-categoria">${data[key].categoria}</h3>`;

        //ahora los sabores
        if ( data[key].sabores ) {
            var ulSabores = document.createElement('ul');
                ulSabores.setAttribute('class', 'caj-lista-sabores');

                Object.keys(data[key].sabores).forEach(k => {
                    data[key].sabores[k]
            
                    var liSabor = document.createElement('li');
                    liSabor.setAttribute('class', 'caj-li-sabores');
                    liSabor.innerHTML = `
                        <h4 class="titulo-sabor">${data[key].sabores[k].sabor}</h4>
                        <p class="descripcion-sabor">${data[key].sabores[k].descripcion}</p>
                        `;
            
                    ulSabores.append(liSabor);
                })

            //agrego los sabores a la categoria
            liCategoria.append(ulSabores);
        }
        //agrego la categoria
        ulCategorias.append(liCategoria);
    });

    
    

    /*for (var i = 0; i < data.length; i++) {
        var liCategoria = document.createElement('li');
            liCategoria.setAttribute('class', 'caj-li-categoria');
            liCategoria.innerText = liCategoria[i].categoria;

        if ( liCategoria[i].sabores.length > 0 ) {
            var ulSabores = document.createElement('ul');
                ulSabores.setAttribute('class', 'caj-lista-sabores');

            for (var a = 0; a < liCategoria[i].sabores.length; a++) {
                var liSabor = document.createElement('li');
                    liSabor.setAttribute('class', 'caj-li-sabores');
                    liSabor.innerHTML = `
                        <h3 class="titulo-sabor">${liCategoria[i].sabores[a].sabor}</h3>
                        <p class="descripcion-sabor">${liCategoria[i].sabores[a].descripcion}</p>
                        `;
            
                ulSabores.append(liSabor);
            }//for gustos de categorias

            liCategoria.append(ulSabores);
        }

        //agrego la categoria
        ulCategorias.append(liCategoria);
        
    }//for categorias*/

    contenedor.append(ulCategorias);
}