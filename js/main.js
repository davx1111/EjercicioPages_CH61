// ----------------------------
// CONECTAR BOTONES DE AGREGAR AL CARRITO
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar TODOS los botones con clase .btnAgregar
  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Obtener datos del producto desde data-*
      const id = boton.getAttribute("data-id");
      const nombre = boton.getAttribute("data-nombre");
      const precio = parseInt(boton.getAttribute("data-precio")); // Convertir a número
      const imagen = boton.getAttribute("data-img");

      // Agregar al carrito
      agregarAlCarrito(id, nombre, precio, imagen);
    });
  });

  // Cargar carrito si estamos en carrito.html
  mostrarCarrito();
  
  // Manejar botones del carrito
  manejarBotonesCarrito();
});


// ----------------------------
// AGREGAR AL CARRITO
// ----------------------------
function agregarAlCarrito(id, nombre, precio, imagen) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Buscar si el producto ya existe
  const productoExistente = carrito.find(item => item.id === id);

  if (productoExistente) {
    // Si ya existe, aumentar cantidad
    productoExistente.cantidad++;
  } else {
    // Si no existe, agregarlo con cantidad 1
    carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  alert(` ${nombre} agregado al carrito`);
}


// MOSTRAR CARRITO
function mostrarCarrito() {
  const contenedor = document.getElementById("contenedorCarrito");
  const totalSpan = document.getElementById("carrito-total");
  const carritoVacio = document.getElementById("carritoVacio");
  const resumenCarrito = document.getElementById("resumenCarrito");

  // Si no estamos en carrito.html, salir
  if (!contenedor || !totalSpan) return;

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  contenedor.innerHTML = ""; // Limpiar

  // Si el carrito está vacío
  if (carrito.length === 0) {
    carritoVacio?.classList.remove("d-none");
    resumenCarrito?.classList.add("d-none");
    return;
  }

  // Ocultar mensaje de vacío y mostrar resumen
  carritoVacio?.classList.add("d-none");
  resumenCarrito?.classList.remove("d-none");

  let total = 0;

  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.classList.add("col-md-4", "mb-3");

    div.innerHTML = `
      <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="text-muted mb-2">${producto.precio} MXN c/u</p>
          
          <!-- Control de cantidad -->
          <div class="d-flex justify-content-center align-items-center gap-2 mb-3">
            <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidad(${index}, -1)">
              -
            </button>
            <span class="fw-bold fs-5">${producto.cantidad}</span>
            <button class="btn btn-outline-secondary btn-sm" onclick="cambiarCantidad(${index}, 1)">
              +
            </button>
          </div>
          
          <p class="text-primary fw-bold mb-3">Subtotal: ${subtotal} MXN</p>
          <button class="btn btn-danger btn-sm w-100" onclick="eliminarProducto(${index})">
            Eliminar
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(div);
  });

  totalSpan.textContent = `$${total} MXN`; // Sin decimales
}


// CAMBIAR CANTIDAD DE UN PRODUCTO
function cambiarCantidad(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Cambiar la cantidad
  carrito[index].cantidad += cambio;

  // Si la cantidad llega a 0, eliminar el producto
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}


// ELIMINAR UN PRODUCTO

function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
}


// MANEJAR BOTONES DEL CARRITO

function manejarBotonesCarrito() {
  // Botón finalizar compra
  const btnFinalizar = document.getElementById("btnFinalizarCompra");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      
      if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }

      alert("🎉 ¡Gracias por tu compra! Snoopy te agradece.");
      localStorage.removeItem("carrito");
      location.reload();
    });
  }

  // Botón vaciar carrito
  const btnVaciar = document.getElementById("btnVaciarCarrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de vaciar el carrito?")) {
        localStorage.removeItem("carrito");
        mostrarCarrito();
      }
    });
  }
}