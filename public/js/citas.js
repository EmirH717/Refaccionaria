// Manejar envío de cita
document.getElementById('form-cita').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button');
  btn.disabled = true;
  
  try {
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    const msg = document.getElementById('cita-msg');
    
    if (data.ok) {
      msg.textContent = '✓ ¡Cita agendada exitosamente! El administrador se contactará vía WhatsApp en breve.';
      msg.style.backgroundColor = '#d4edda';
      msg.style.color = '#155724';
      msg.style.padding = '1rem';
      msg.style.borderRadius = '6px';
      msg.style.marginTop = '1rem';
      msg.style.fontWeight = '500';
      form.reset();
    } else {
      msg.textContent = '✗ Error al agendar la cita. Intenta nuevamente.';
      msg.style.backgroundColor = '#f8d7da';
      msg.style.color = '#721c24';
      msg.style.padding = '1rem';
      msg.style.borderRadius = '6px';
      msg.style.marginTop = '1rem';
    }
  } catch (err) {
    console.error('Error:', err);
    const msg = document.getElementById('cita-msg');
    msg.textContent = '✗ Error de conexión. Verifica tu internet e intenta de nuevo.';
    msg.style.backgroundColor = '#f8d7da';
    msg.style.color = '#721c24';
    msg.style.padding = '1rem';
    msg.style.borderRadius = '6px';
    msg.style.marginTop = '1rem';
  } finally {
    btn.disabled = false;
  }
});
