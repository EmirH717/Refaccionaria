let allProducts = [];
let currentCategory = 'todos';
let currentSearch = '';

// Cargar productos al iniciar la página
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    allProducts = products || [];
    displayProducts(allProducts);
  } catch (err) {
    console.error('Error cargando productos:', err);
    document.getElementById('lista-productos').innerHTML = '<p style="color: red; grid-column: 1/-1;">Error al cargar productos.</p>';
  }
}

// Mostrar productos en el DOM con diseño profesional
function displayProducts(products) {
  const container = document.getElementById('lista-productos');
  
  if (!products || products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No hay productos disponibles.</p>';
    return;
  }
  
  container.innerHTML = '';
  products.forEach(p => {
    const stockClass = p.stock > 5 ? 'stock-available' : p.stock > 0 ? 'stock-low' : 'stock-unavailable';
    const stockText = p.stock > 5 ? '✓ En stock' : p.stock > 0 ? '⚠️ Stock bajo' : '❌ Sin stock';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      ${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}
      <div class="card-content">
        <h3>${p.name}</h3>
        <p><strong>Categoría:</strong> ${p.category}</p>
        <p><strong>Stock:</strong> ${p.stock} unidades</p>
        <p><strong>Precio:</strong> $${Number(p.price).toFixed(2)}</p>
        <span class="stock-badge ${stockClass}">${stockText}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Filtrar por categoría
function filterCategory(category) {
  // Actualizar botones activos
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  currentCategory = category;
  currentSearch = '';
  document.getElementById('search-input').value = '';
  
  // Filtrar productos
  if (category === 'todos') {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
  }
}

// Buscar productos por nombre
function searchProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  currentSearch = searchTerm;
  
  if (!searchTerm) {
    filterCategory(currentCategory);
    return;
  }

  let filtered = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    p.category.toLowerCase().includes(searchTerm)
  );

  displayProducts(filtered);
}

// Limpiar búsqueda
function clearSearch() {
  document.getElementById('search-input').value = '';
  currentSearch = '';
  filterCategory('todos');
}

// Cargar productos cuando se carga la página
fetchProducts();
