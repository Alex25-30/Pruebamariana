const productos = [
  {
    id: 1,
    nombre: "Guantes de Boxeo",
    precio: 150,
    categoria: "Guantes",
    img: "https://i.postimg.cc/Z51vGXrK/a-photograph-of-a-pair-of-blue-boxing-gl.jpg"
  },
  {
    id: 2,
    nombre: "Vendas para Manos",
    precio: 80,
    categoria: "Accesorios",
    img: "https://i.postimg.cc/LXvtFN9C/Gemini-Generated-Image-a91srsa91srsa91s.jpg"
  },
  {
    id: 3,
    nombre: "Protector Bucal",
    precio: 40,
    categoria: "Protección",
    img: "https://i.postimg.cc/VvVXdvbX/Gemini-Generated-Image-3i8c6h3i8c6h3i8c.jpg"
  },
  {
    id: 4,
    nombre: "Saco de Boxeo",
    precio: 220,
    categoria: "Guantes",
    img: "https://i.postimg.cc/y8FSzvnm/Gemini-Generated-Image-63kfvw63kfvw63kf.jpg"
  },
  {
    id: 5,
    nombre: "Cuerda para Saltar",
    precio: 15,
    categoria: "Accesorios",
    img: "https://i.postimg.cc/bNnZQ377/Gemini-Generated-Image-i16qxli16qxli16q.jpg"
  },
  {
    id: 6,
    nombre: "Casco Protector",
    precio: 96,
    categoria: "Protección",
    img: "https://i.postimg.cc/rpRxzx1j/Gemini-Generated-Image-5238l15238l15238.jpg"
  },
  {
    id: 7,
    nombre: "Botas de Entrenamiento",
    precio: 90,
    categoria: "Accesorios",
    img: "https://i.postimg.cc/Gm1HzvrH/Gemini-Generated-Image-escov3escov3esco.jpg"
  }
];

let carrito = [];

document.addEventListener("DOMContentLoaded", function () {
  filtrarPorCategoria();
  cargarCarrito();
});

function filtrarPorCategoria() {
  const seleccion = document.getElementById("categoria").value;
  const filtrados = seleccion === "todos" ? productos : productos.filter(p => p.categoria === seleccion);

  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  filtrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(nombre, precio) {
  const producto = carrito.find(p => p.nombre === nombre);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
  mostrarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total-carrito");
  const contador = document.getElementById("contador-carrito");
  const botonComprar = document.getElementById("boton-comprar");
  const contenedorPayPal = document.getElementById("paypal-button-container");

  lista.innerHTML = "";
  let total = 0;
  let cantidad = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
      <button onclick="eliminarDelCarrito(${index})">❌</button>
    `;
    lista.appendChild(li);
    total += item.precio * item.cantidad;
    cantidad += item.cantidad;
  });

  totalTexto.textContent = total.toFixed(2);
  contador.textContent = cantidad;
  botonComprar.style.display = carrito.length > 0 ? "block" : "none";
  contenedorPayPal.style.display = carrito.length > 0 ? "block" : "none";

  renderizarBotonPayPal(total);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  alert("Carrito vaciado.");
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  alert("¡Gracias por tu compra! 🥊📦");
  vaciarCarrito();
}

function mostrarCarrito() {
  document.getElementById("carrito-popup").style.bottom = "0";
}

function cerrarCarrito() {
  document.getElementById("carrito-popup").style.bottom = "-100%";
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const data = localStorage.getItem("carrito");
  if (data) {
    carrito = JSON.parse(data);
    actualizarCarrito();
  }
}

function renderizarBotonPayPal(total) {
  const contenedor = document.getElementById("paypal-button-container");
  contenedor.innerHTML = "";

  if (window.paypal && carrito.length > 0) {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: total.toFixed(2) }
          }]
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then(details => {
          alert(`¡Gracias ${details.payer.name.given_name}, tu pago fue exitoso! 🥳`);
          vaciarCarrito();
        });
      },
      onError: err => {
        console.error("Error con PayPal:", err);
        alert("Hubo un problema con el pago.");
      }
    }).render("#paypal-button-container");
  }
}
