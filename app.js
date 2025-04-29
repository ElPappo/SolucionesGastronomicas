// Datos de usuarios
const usuarios = [
    { usuario: 'admin', password: 'elpappo', perfil: 'admin' },
    { usuario: 'matias', password: '12345', perfil: 'vendedor' },
    { usuario: 'martin', password: '12345', perfil: 'vendedor' },
    { usuario: 'domingo', password: '12345', perfil: 'vendedor' },
    { usuario: 'ignacio', password: '12345', perfil: 'vendedor' }
];

let usuarioLogueado = null;
let stock = { papas: 10, aceite: 50 };
const precios = { papas: 20000, aceite: 12000 };
let ventas = [];
let clientes = ['Enri´s', 'Brother', 'Cliente nuevo'];

// Login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.password === password);
    
    if (usuarioEncontrado) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        usuarioLogueado = usuarioEncontrado;
        document.getElementById('vendedor-actual').innerText = `Vendedor: ${usuarioLogueado.usuario}`;

        if (usuarioEncontrado.perfil === 'admin') {
            document.getElementById('carga-stock-container').style.display = 'block';
        }
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

// Mostrar stock al seleccionar producto
document.getElementById('producto').addEventListener('change', function () {
    const producto = this.value;
    document.getElementById('stock-container').innerHTML = `Stock disponible: ${stock[producto]} unidades`;
    document.getElementById('descuento-container').style.display = (producto === 'papas') ? 'block' : 'none';
});

// Mostrar campos si cliente es nuevo
document.getElementById('cliente').addEventListener('change', function () {
    document.getElementById('nuevo-cliente-container').style.display = (this.value === 'cliente3') ? 'block' : 'none';
});

// Calcular precio total
function actualizarPrecioTotal() {
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10) || 0;
    const descuento = parseInt(document.getElementById('descuento')?.value || 0, 10);

    let precioUnitario = precios[producto] || 0;
    let total = precioUnitario * cantidad;

    if (descuento > 0) {
        total -= total * descuento / 100;
    }

    document.getElementById('total-price').innerText = `Precio Total: $${total}`;
}

// Confirmar venta
document.getElementById('confirmar-btn').addEventListener('click', function () {
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);
    const cliente = document.getElementById('cliente').value;
    const metodoPago = document.getElementById('metodo-pago').value;
    const descuento = parseInt(document.getElementById('descuento').value, 10);
    const total = parseFloat(document.getElementById('total-price').innerText.replace('Precio Total: $', ''));

    const datosVenta = {
        vendedor: usuarioLogueado.usuario,
        cliente: cliente,
        producto: producto,
        cantidad: cantidad,
        pago: metodoPago,
        fecha: new Date().toLocaleString(),
        descuento: descuento,
        total: total
    };

    // Guardar local
    ventas.push(datosVenta);

    // Mostrar en tabla
    const ventasTable = document.getElementById('ventas-table').getElementsByTagName('tbody')[0];
    const nuevaFila = ventasTable.insertRow();
    nuevaFila.insertCell(0).textContent = datosVenta.vendedor;
    nuevaFila.insertCell(1).textContent = datosVenta.cliente;
    nuevaFila.insertCell(2).textContent = datosVenta.producto;
    nuevaFila.insertCell(3).textContent = datosVenta.cantidad;
    nuevaFila.insertCell(4).textContent = datosVenta.pago;
    nuevaFila.insertCell(5).textContent = datosVenta.fecha;
    nuevaFila.insertCell(6).textContent = `${datosVenta.descuento}%`;
    nuevaFila.insertCell(7).textContent = `$${datosVenta.total}`;
    
    // Enviar a Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwKRxPhe89p_AGi3D7cHxysef3ttOl_o6oHx8VrxZYJAz11xNp-u9r511x9BQsTtAu-vg/exec", 
         {
        method: "POST",
        body: JSON.stringify(datosVenta),
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.text())
    .then(respuesta => console.log("Respuesta Sheets:", respuesta))
    .catch(err => console.error("Error al enviar a Sheets:", err));
});

// Actualizar precio en tiempo real
document.getElementById('cantidad').addEventListener('input', actualizarPrecioTotal);
document.getElementById('descuento').addEventListener('change', actualizarPrecioTotal);

// Exportar ventas a CSV local
function exportarVentasCSV() {
    const ventasCSV = ventas.map(venta => {
        return [
            venta.vendedor,
            venta.cliente,
            venta.producto,
            venta.cantidad,
            venta.pago,
            venta.fecha,
            venta.descuento,
            venta.total
        ].join(',');
    }).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + ventasCSV;
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'ventas.csv');
    link.click();
}
