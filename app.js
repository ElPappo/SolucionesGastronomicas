// Variables globales
let usuarioLogueado = null;

// Datos de usuarios (como ya tenías)
const usuarios = [
    { usuario: 'admin', password: 'elpappo', perfil: 'admin' },
    { usuario: 'matias', password: '12345', perfil: 'vendedor' },
    { usuario: 'martin', password: '12345', perfil: 'vendedor' },
    { usuario: 'domingo', password: '12345', perfil: 'vendedor' },
    { usuario: 'ignacio', password: '12345', perfil: 'vendedor' }
];

let stock = { papas: 10, aceite: 50 };
const precios = { papas: 20000, aceite: 12000 };
let ventas = [];
let clientes = ['Enri´s', 'Brother', 'Cliente nuevo'];

// Manejo del login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.password === password);
    
    if (usuarioEncontrado) {
        usuarioLogueado = usuarioEncontrado;

        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';

        document.getElementById('vendedor-actual').innerText = `Vendedor: ${usuarioLogueado.usuario}`;

        if (usuarioEncontrado.perfil === 'admin') {
            document.getElementById('carga-stock-container').style.display = 'block';
        }
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

// Mostrar stock disponible
document.getElementById('producto').addEventListener('change', function () {
    const producto = this.value;
    const stockContainer = document.getElementById('stock-container');
    stockContainer.innerHTML = `Stock disponible: ${stock[producto]} unidades`;

    if (producto === 'papas') {
        document.getElementById('descuento-container').style.display = 'block';
    } else {
        document.getElementById('descuento-container').style.display = 'none';
    }
});

// Mostrar campos si cliente es nuevo
document.getElementById('cliente').addEventListener('change', function () {
    if (this.value === 'cliente3') {
        document.getElementById('nuevo-cliente-container').style.display = 'block';
    } else {
        document.getElementById('nuevo-cliente-container').style.display = 'none';
    }
});

// Actualizar precio
function actualizarPrecioTotal() {
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10) || 0;
    const descuento = parseInt(document.getElementById('descuento')?.value || 0, 10);

    let precioUnitario = precios[producto] || 0;
    let total = precioUnitario * cantidad;

    if (descuento > 0) {
        total = total - (total * descuento / 100);
    }

    document.getElementById('total-price').innerText = `Precio Total: $${total.toLocaleString()}`;
}

document.getElementById('cantidad').addEventListener('input', actualizarPrecioTotal);
document.getElementById('producto').addEventListener('change', actualizarPrecioTotal);
document.getElementById('descuento')?.addEventListener('change', actualizarPrecioTotal);

actualizarPrecioTotal();

// Confirmar venta
document.getElementById('confirmar-btn').addEventListener('click', function () {
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    let clienteSeleccionado = document.getElementById('cliente').value;
    const metodoPago = document.getElementById('metodo-pago').value;
    const descuento = parseInt(document.getElementById('descuento').value) || 0;

    if (clienteSeleccionado === 'cliente3') {
        clienteSeleccionado = document.getElementById('nuevo-cliente-nombre').value;
    }

    if (cantidad > stock[producto]) {
        alert('No hay suficiente stock para realizar esta venta.');
        return;
    }

    let precioUnitario = precios[producto] || 0;
    let total = precioUnitario * cantidad;

    if (descuento > 0) {
        total = total - (total * descuento / 100);
    }

    const venta = {
        perfil: usuarioLogueado.usuario,
        cliente: clienteSeleccionado,
        producto,
        cantidad,
        metodoPago,
        descuento: `${descuento}%`,
        fecha: new Date().toLocaleString(),
        total
    };
    ventas.push(venta);

    stock[producto] -= cantidad;

    const ventasTable = document.getElementById('ventas-table').getElementsByTagName('tbody')[0];
    const row = ventasTable.insertRow();
    row.insertCell(0).textContent = venta.perfil;
    row.insertCell(1).textContent = venta.cliente;
    row.insertCell(2).textContent = venta.producto;
    row.insertCell(3).textContent = venta.cantidad;
    row.insertCell(4).textContent = venta.metodoPago;
    row.insertCell(5).textContent = venta.fecha;
    row.insertCell(6).textContent = venta.descuento;
    row.insertCell(7).textContent = `$${venta.total.toLocaleString()}`;

    document.getElementById('venta-form').reset();
    document.getElementById('stock-container').textContent = `Stock disponible: ${stock[producto]} unidades`;

    actualizarPrecioTotal();
});
