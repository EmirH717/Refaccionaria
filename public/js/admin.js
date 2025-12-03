const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const adminMsg = document.getElementById('admin-msg');
const adminProducts = document.getElementById('admin-products');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-product-form');
const cancelEditBtn = document.getElementById('cancel-edit');

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  
  try {
    const form = new FormData(e.target);
    const body = { password: form.get('password') };
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (res.ok) {
      loginSection.style.display = 'none';
      adminSection.style.display = 'block';
      loadProducts();
      e.target.reset();
    } else {
      document.getElementById('login-msg').textContent = '❌ Contraseña incorrecta.';
    }
  } catch (err) {
    console.error('Error login:', err);
    document.getElementById('login-msg').textContent = '❌ Error de conexión.';
  } finally {
    btn.disabled = false;
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    adminSection.style.display = 'none';
    loginSection.style.display = 'block';
    loginForm.reset();
  } catch (err) {
    console.error('Error logout:', err);
  }
});

// Agregar producto
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  btn.disabled = true;
  
  try {
    const fd = new FormData(form);
    const res = await fetch('/api/admin/products', { method: 'POST', body: fd });
    const data = await res.json();
    
    if (data.ok) {
      adminMsg.textContent = '✓ Producto agregado exitosamente.';
      adminMsg.style.color = '#155724';
      adminMsg.style.backgroundColor = '#d4edda';
      form.reset();
      loadProducts();
    } else {
      adminMsg.textContent = '❌ Error agregando producto.';
      adminMsg.style.color = '#721c24';
      adminMsg.style.backgroundColor = '#f8d7da';
    }
  } catch (err) {
    console.error('Error:', err);
    adminMsg.textContent = '❌ Error de conexión.';
    adminMsg.style.color = '#721c24';
    adminMsg.style.backgroundColor = '#f8d7da';
  } finally {
    btn.disabled = false;
  }
});

// Cargar productos
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    adminProducts.innerHTML = '';
    
    if (!products || products.length === 0) {
      adminProducts.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos.</p>';
      return;
    }
    
    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${p.name}</h3>
        <p><strong>Categoría:</strong> ${p.category}</p>
        <p><strong>Stock:</strong> ${p.stock}</p>
        <p><strong>Precio:</strong> $${Number(p.price).toFixed(2)}</p>
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}
        <div class="actions">
          <button data-id="${p.id}" class="edit">✏️ Editar</button>
          <button data-id="${p.id}" class="delete">🗑️ Eliminar</button>
        </div>
      `;
      adminProducts.appendChild(card);
    });

    // Eventos de eliminar
    document.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const id = ev.target.closest('.delete').dataset.id;
        if (!confirm('¿Eliminar este producto?')) return;
        
        try {
          const res = await fetch('/api/admin/products/' + id, { method: 'DELETE' });
          if (res.ok) {
            loadProducts();
            adminMsg.textContent = '✓ Producto eliminado.';
            adminMsg.style.color = '#155724';
            adminMsg.style.backgroundColor = '#d4edda';
          }
        } catch (err) {
          console.error('Error:', err);
        }
      });
    });

    // Eventos de editar
    document.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', async (ev) => {
        const id = ev.target.closest('.edit').dataset.id;
        const product = products.find(p => p.id === id);
        // Open edit modal and populate fields
        editModal.style.display = 'block';
        editForm.elements['id'].value = product.id;
        editForm.elements['name'].value = product.name || '';
        editForm.elements['category'].value = product.category || '';
        editForm.elements['stock'].value = product.stock || 0;
        editForm.elements['price'].value = Number(product.price || 0).toFixed(2);
      });
    });
  
    // Cancel edit
    cancelEditBtn.addEventListener('click', () => {
      editModal.style.display = 'none';
      editForm.reset();
    });

    // Submit edit form
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = editForm.querySelector('button[type="submit"]');
      btn.disabled = true;

      try {
        const id = editForm.elements['id'].value;
        const fd = new FormData(editForm);
        const res = await fetch('/api/admin/products/' + id, { method: 'PUT', body: fd });
        const data = await res.json();

        if (data.ok) {
          adminMsg.textContent = '✓ Producto actualizado.';
          adminMsg.style.color = '#155724';
          adminMsg.style.backgroundColor = '#d4edda';
          editModal.style.display = 'none';
          editForm.reset();
          loadProducts();
        } else {
          adminMsg.textContent = '❌ Error al actualizar producto.';
          adminMsg.style.color = '#721c24';
          adminMsg.style.backgroundColor = '#f8d7da';
        }
      } catch (err) {
        console.error('Error actualizando producto:', err);
        adminMsg.textContent = '❌ Error de conexión.';
        adminMsg.style.color = '#721c24';
        adminMsg.style.backgroundColor = '#f8d7da';
      } finally {
        btn.disabled = false;
      }
    });
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
}
