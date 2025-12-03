# Instrucciones de uso - Refaccionaria y Taller Guerrero

## ✅ Tu sitio web está completamente funcional

### 📋 Resumen de cambios

1. **Página de citas separada** ✓
   - Apartado independiente en `/public/citas.html`
   - Formulario mejorado con opciones predefinidas de servicios
   - Información de horarios y contacto

2. **Sistema de categorías** ✓
   - Mangueras
   - Tomas de agua
   - Filtros de aire
   - Filtros de gasolina
   - Filtros de aceite
   - Aceites
   - Refrigerantes

3. **Filtrado de productos** ✓
   - Botones para filtrar por categoría en la página de inicio
   - Botón "Todos" para ver todos los productos

4. **Datos de prueba** ✓
   - 8 productos de ejemplo con las categorías solicitadas
   - Listos para que edites o agregues más

---

## 🚀 Para ejecutar el sitio

### Opción 1: Windows (Batch)
```batch
C:\Users\kevin\Downloads\REFACCIONARIAtaller\iniciar.bat
```

### Opción 2: PowerShell
```powershell
cd "C:\Users\kevin\Downloads\REFACCIONARIAtaller"
node server.js
```

El servidor estará disponible en: **http://localhost:3000**

---

## 📍 URLs del sitio

| Sección | URL |
|---------|-----|
| **Productos** | http://localhost:3000/public/index.html |
| **Agendar Cita** | http://localhost:3000/public/citas.html |
| **Admin** | http://localhost:3000/public/admin.html |

---

## 🔐 Credenciales Admin

**Contraseña:** `artemio123` (cambiable)

---

## 💡 Funcionalidades

✅ **Usuarios pueden:**
- Ver productos disponibles
- Filtrar por categoría
- Agendar citas con detalles del servicio
- Ver información de contacto

✅ **Admin (Artemio) puede:**
- Agregar productos (nombre, categoría, stock, precio, imagen)
- Editar productos
- Eliminar productos
- Ver todas las citas en `data/appointments.json`

✅ **Sistema automático:**
- Citas se guardan en `data/appointments.json`
- Emails automáticos (si configuras SMTP)
- Imágenes se almacenan en `uploads/`

---

## 🔧 Cambiar contraseña admin

En PowerShell, antes de iniciar el servidor:

```powershell
$env:ADMIN_PASS="tu_nueva_contraseña"
node server.js
```

---

## 📧 Configurar emails automáticos (opcional)

Para recibir citas automáticamente en tu correo:

```powershell
$env:SMTP_HOST="smtp.gmail.com"
$env:SMTP_PORT="587"
$env:SMTP_USER="tu_email@gmail.com"
$env:SMTP_PASS="tu_app_password"
$env:FROM_EMAIL="tu_email@gmail.com"
$env:ADMIN_EMAIL="yairivanyanez23@cbtis179.edu.mx"
node server.js
```

**Para Gmail:** Necesitas generar una contraseña de aplicación en https://myaccount.google.com/apppasswords

---

## 📁 Archivos principales

- `server.js` - Backend
- `public/index.html` - Catálogo de productos
- `public/citas.html` - Formulario de citas
- `public/admin.html` - Panel de administrador
- `data/products.json` - Base de datos de productos
- `data/appointments.json` - Registro de citas

---

¡Tu sitio está 100% funcional y listo para usar! 🎉
