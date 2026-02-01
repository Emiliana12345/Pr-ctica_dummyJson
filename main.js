const contenedorProductos = document.getElementById("productos");
const seccionDetalle = document.getElementById("detalle");
const detalleContenido = document.querySelector(".detalle-contenido");
const btnVolver = document.getElementById("volver");
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");

// Cargar todos los productos al iniciar
cargarProductos();

function cargarProductos() {
  fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
      mostrarProductos(data.products);
    })
    .catch(err => console.error("Error cargando productos:", err));
}

// Mostrar productos en grid
function mostrarProductos(productos) {
  contenedorProductos.innerHTML = "";

  if (!productos || productos.length === 0) {
    contenedorProductos.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${producto.title}</h3>
      <img src="${producto.thumbnail}" alt="${producto.title}">
      <p>Precio: $${producto.price}</p>
      <p>Categoría: ${producto.category}</p>
      <p class="rating">Rating: ${producto.rating}</p>
      
    `;

    card.addEventListener("click", () => {
      cargarDetalle(producto.id);
    });

    contenedorProductos.appendChild(card);
  });
}

// Cargar detalle de un producto
function cargarDetalle(id) {
  fetch(`https://dummyjson.com/products/${id}`)
    .then(res => res.json())
    .then(producto => {

      contenedorProductos.classList.add("oculto");
      seccionDetalle.classList.remove("oculto");

      // Generar HTML de opiniones 
      let opinionesHTML = "";

      if (producto.reviews && producto.reviews.length > 0) {
        producto.reviews.forEach(review => {
          opinionesHTML += `
            <div class="review">
              <p><strong>${review.reviewerName}</strong></p>
              <p>⭐ ${review.rating}/5</p>
              <p>"${review.comment}"</p>
            </div>
          `;
        });
      } else {
        opinionesHTML = "<p>No hay opiniones disponibles.</p>";
      }

      detalleContenido.innerHTML = `
        <h2>${producto.title}</h2>
        <img src="${producto.thumbnail}" alt="${producto.title}">
        <p><strong>Descripción:</strong> ${producto.description}</p>
        <p><strong>Precio:</strong> $${producto.price}</p>
        <p><strong>Marca:</strong> ${producto.brand}</p>
        <p><strong>Categoría:</strong> ${producto.category}</p>

        <hr>
        <h3>Opiniones de usuarios</h3>
        ${opinionesHTML}
      `;
    })
    .catch(err => console.error("Error cargando detalle:", err));
}

// Volver al listado
btnVolver.addEventListener("click", () => {
  seccionDetalle.classList.add("oculto");
  contenedorProductos.classList.remove("oculto");
});

// Buscar productos
function buscarProductos(texto) {
  if (texto.trim() === "") {
    cargarProductos(); 
    return;
  }

  fetch(`https://dummyjson.com/products/search?q=${texto}`)
    .then(res => res.json())
    .then(data => {
      mostrarProductos(data.products);
    })
    .catch(err => console.error("Error en búsqueda:", err));
}


btnBuscar.addEventListener("click", () => {
  buscarProductos(inputBuscar.value);
});

inputBuscar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    buscarProductos(inputBuscar.value);
  }
});
