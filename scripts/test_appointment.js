(async()=>{
  try{
    const res = await fetch('http://localhost:3000/api/appointments',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        name: 'Cliente Prueba',
        whatsapp: '5512345678',
        carModel: 'Nissan Versa',
        description: 'Cambio de aceite',
        date: '2025-12-15',
        time: '09:30'
      })
    });
    const j = await res.json();
    console.log('Respuesta cita:', j);
  } catch(e) {
    console.error('Error al crear cita:', e);
  }
})();
