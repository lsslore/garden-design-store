// Clave en localStorage
const CLAVE_CARRITO = "carrito";

// Estado
let carrito = [];

// Elementos
const botonCarrito = document.getElementById("boton-carrito");
const panelCarrito = document.getElementById("panel-carrito");
const fondoCarrito = document.getElementById("fondo-carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const vaciarCarrito = document.getElementById("vaciar-carrito");
const contadorCarrito = document.getElementById("contador-carrito");

// Utilidades
const guardarCarrito = () => localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
const cargarCarrito = () => {
  const datos = localStorage.getItem(CLAVE_CARRITO);
  carrito = datos ? JSON.parse(datos) : [];
};
const totalUnidades = () => carrito.reduce((s, i) => s + i.cantidad, 0);
const totalDinero = () => carrito.reduce((s, i) => s + i.price * i.cantidad, 0);
const formatearARS = n => "$" + n.toLocaleString("es-AR");

// Render
function renderizarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p style="font-size:16px;color:#fff;">Carrito Vacío</p>';
  } else {
    carrito.forEach(item => {
      const fila = document.createElement("div");
      fila.className = "item-carrito";
      fila.dataset.id = String(item.id);
      fila.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="titulo">${item.name}</div>
        <div class="controles">
          <button class="menos">-</button>
          <input type="number" min="1" value="${item.cantidad}" class="cantidad">
          <button class="mas">+</button>
          <button class="boton-eliminar" title="Eliminar">Eliminar</button>
        </div>
        <div class="precio">${formatearARS(item.price * item.cantidad)}</div>
      `;
      listaCarrito.appendChild(fila);
    });
  }

  totalCarrito.textContent = formatearARS(totalDinero());
  contadorCarrito.textContent = totalUnidades();
}

// Operaciones
function agregarProducto(producto) {
  const existe = carrito.find(p => String(p.id) === String(producto.id));
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  renderizarCarrito();

  alert(`${producto.name} se agregó al carrito`);
  
}

function cambiarCantidad(id, nueva) {
  const item = carrito.find(p => String(p.id) === String(id));
  if (!item) return;
  item.cantidad = Math.max(1, Number(nueva) || 1);
  guardarCarrito();
  renderizarCarrito();
}
function eliminarProducto(id) {
  carrito = carrito.filter(p => String(p.id) !== String(id));
  guardarCarrito();
  renderizarCarrito();
}
function vaciarTodo() {
  carrito = [];
  guardarCarrito();
  renderizarCarrito();
  
}

// Eventos panel
botonCarrito.addEventListener("click", e => {
  e.preventDefault();
  panelCarrito.classList.add("abierto");
  panelCarrito.setAttribute("aria-hidden", "false");
  fondoCarrito.hidden = false;
});
cerrarCarrito.addEventListener("click", () => {
  panelCarrito.classList.remove("abierto");
  panelCarrito.setAttribute("aria-hidden", "true");
  fondoCarrito.hidden = true;
});
fondoCarrito.addEventListener("click", () => {
  panelCarrito.classList.remove("abierto");
  panelCarrito.setAttribute("aria-hidden", "true");
  fondoCarrito.hidden = true;
});

vaciarCarrito.addEventListener("click", vaciarTodo);

// Delegación lista
listaCarrito.addEventListener("click", e => {
  const fila = e.target.closest(".item-carrito");
  if (!fila) return;
  const id = fila.dataset.id;

  if (e.target.classList.contains("menos")) {
    const item = carrito.find(p => String(p.id) === String(id));
    if (item) cambiarCantidad(id, item.cantidad - 1);
  }
  if (e.target.classList.contains("mas")) {
    const item = carrito.find(p => String(p.id) === String(id));
    if (item) cambiarCantidad(id, item.cantidad + 1);
  }
  if (e.target.classList.contains("boton-eliminar")) {
    eliminarProducto(id);
  }
});
listaCarrito.addEventListener("change", e => {
  if (e.target.classList.contains("cantidad")) {
    const fila = e.target.closest(".item-carrito");
    const id = fila?.dataset.id;
    cambiarCantidad(id, e.target.value);
  }
});

// Generar catálogo dinámicamente desde productos.js
function cargarCatalogo() {
  const contenedor = document.querySelector(".productos-container");
  contenedor.innerHTML = "";

  productos.forEach(prod => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "card";
    tarjeta.dataset.id = prod.id;
    tarjeta.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <h3 class="nombre">${prod.name}</h3>
      <p class="description">${prod.description}</p>
      <h4 class="precio">$${prod.price.toLocaleString("es-AR")}</h4>
      <button class="agregar-carrito">Agregar al carrito</button>
    `;
    contenedor.appendChild(tarjeta);

    tarjeta.querySelector(".agregar-carrito").addEventListener("click", () => {
      agregarProducto({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image
      });
    });
  });
}

// Inicio
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  cargarCatalogo();   // genera las cards desde el array
  renderizarCarrito();
});
