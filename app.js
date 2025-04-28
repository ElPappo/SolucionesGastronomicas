// Datos de usuario (simulados)
const usuarios = [
    { usuario: 'admin', password: 'elpappo', perfil: 'admin' },
    { usuario: 'matias', password: '12345', perfil: 'vendedor' },
    { usuario: 'martin', password: '12345', perfil: 'vendedor' },
    { usuario: 'domingo', password: '12345', perfil: 'vendedor' },
    { usuario: 'ignacio', password: '12345', perfil: 'vendedor' }
];

// Stock inicial de productos
let stock = {
    papas: 100,
    aceite: 50
};

// Ventas realizadas
let ventas = [];
let clientes = ['Enri´s', 'Brother', 'Cliente nuevo'];

// Manejo del login
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const usuario = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario && u.password === password);
    
    if (usuarioEncontrado) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        
        if (usuarioEncontrado.perfil === 'admin') {
            document.getElementById('carga-stock-container').style.display = 'block';
        }
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
});

// Mostrar stock al seleccionar un producto
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

// Mostrar campo de teléfono si el cliente es nuevo
document.getElementById('cliente').addEventListener('change', function () {
    if (this.value === 'cliente3') {
        document.getElementById('nuevo-cliente-container').style.display = 'block';
    } else {
        document.getElementById('nuevo-cliente-container').style.display = 'none';
    }
});

// Confirmar venta
document.getElementById('confirmar-btn').addEventListener('click', function () {
    const perfil = document.getElementById('perfil').value;
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const cliente = document.getElementById('cliente').value;
    const metodoPago = document.getElementById('metodo-pago').value;
    const descuento = parseInt(document.getElementById('descuento').value);
    
    let precio = producto === 'papas' ? 20000 : 0;

    if (descuento === 8) {
        precio -= precio * 0.08;
    } else if (descuento === 12) {
        precio -= precio * 0.12;
    }
    
    if (cantidad > stock[producto]) {
        alert('No hay suficiente stock para realizar esta venta.');
        return;
    }

    // Registrar la venta
    const venta = {
        perfil: usuarios[perfil - 1].usuario,  // Asignar nombre del vendedor
        cliente,
        producto,
        cantidad,
        metodoPago,
        descuento: `${descuento}%`,
        fecha: new Date().toLocaleString(),
        total: precio * cantidad
    };
    ventas.push(venta);
    
    // Actualizar el stock
    stock[producto] -= cantidad;
    
    // Mostrar la venta en la tabla
    const ventasTable = document.getElementById('ventas-table').getElementsByTagName('tbody')[0];
    const row = ventasTable.insertRow();
    row.insertCell(0).textContent = venta.perfil; // Vendedor
    row.insertCell(1).textContent = cliente;
    row.insertCell(2).textContent = producto;
    row.insertCell(3).textContent = cantidad;
    row.insertCell(4).textContent = metodoPago;
    row.insertCell(5).textContent = venta.fecha;
    row.insertCell(6).textContent = `${descuento}%`;

    document.getElementById('venta-form').reset();
    document.getElementById('stock-container').textContent = `Stock disponible: ${stock[producto]} unidades`;
});

// Exportar ventas a CSV
function exportarVentasCSV() {
    const cabecera = ['Vendedor', 'Cliente', 'Producto', 'Cantidad Vendida', 'Pago', 'Fecha', 'Descuento', 'Total'];
    const contenido = ventas.map(venta => [
        venta.perfil,
        venta.cliente,
        venta.producto,
        venta.cantidad,
        venta.metodoPago,
        venta.fecha,
        venta.descuento,
        venta.total
    ]);

    const csvContent = [cabecera, ...contenido].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'ventas.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
