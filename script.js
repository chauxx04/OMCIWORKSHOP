const carrito = document.getElementById("carrito");
const elementos1 = document.getElementById("productos");
const lista = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

// Cargar eventos solo si los elementos existen
if (elementos1 && carrito && lista && vaciarCarritoBtn) {
    cargarEventListeners();
}

function cargarEventListeners() {
    elementos1.addEventListener("click", comprarElemento);
    carrito.addEventListener("click", eliminarElemento);
    vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains("agregar-carrito")) {
        const elemento = e.target.closest(".product");
        if (elemento) {
            leerDatosElemento(elemento);
        }
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector("img").src,
        titulo: elemento.querySelector("h3").textContent,
        precio: elemento.querySelector(".price").textContent,
        talla: elemento.querySelector(".talla") ? elemento.querySelector(".talla").value : "",
        id: elemento.querySelector("a").getAttribute("data-id")
    };
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><img src="${elemento.imagen}" width="100" /></td>
        <td>${elemento.titulo}</td>
        <td>${elemento.talla}</td>
        <td>${elemento.precio}</td>
        <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains("borrar")) {
        e.target.parentElement.parentElement.remove();
    }
}

function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}

function generarRecibo() {
    let recibo = 'Recibo de compra OMCI\n\n';
    recibo += 'Producto\tTalla\tPrecio\n';
    const filas = lista.querySelectorAll('tr');
    filas.forEach(fila => {
        const columnas = fila.querySelectorAll('td');
        if (columnas.length >= 4) {
            const nombre = columnas[1].textContent.trim();
            const talla = columnas[2].textContent.trim();
            const precio = columnas[3].textContent.trim();
            recibo += `${nombre}\t${talla}\t${precio}\n`;
        }
    });
    return recibo;
}

document.getElementById('descargar-recibo').addEventListener('click', function() {
    const recibo = generarRecibo();
    const blob = new Blob([recibo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo_omci.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('copiar-recibo').addEventListener('click', function() {
    const recibo = generarRecibo();
    navigator.clipboard.writeText(recibo).then(() => {
        alert('¡Recibo copiado al portapapeles!');
    });
});