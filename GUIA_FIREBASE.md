# 🔥 Guía de Configuración Firebase + Netlify

## Paso 1: Crear Proyecto en Firebase

### 1.1 Ir a Firebase Console
- Accede a: https://console.firebase.google.com
- Inicia sesión con tu cuenta Google (crea una si no tienes)

### 1.2 Crear nuevo proyecto
- Haz clic en "Crear proyecto"
- Nombre: `refaccionaria-taller`
- Desactiva "Habilitar Google Analytics" (no necesario)
- Clic en "Crear proyecto"

### 1.3 Esperar a que se cree
- Verás un spinner, espera 1-2 minutos
- Luego haz clic en "Continuar"

---

## Paso 2: Habilitar Realtime Database

### 2.1 Ir a Realtime Database
- En el panel izquierdo, ve a: **Compilación > Realtime Database**

### 2.2 Crear base de datos
- Haz clic en "Crear base de datos"
- Ubicación: **Estados Unidos (us-central1)**
- Reglas: **Comenzar en modo de prueba**
- Haz clic en "Habilitar"

### 2.3 Copiar la URL
- Verás una URL como: `https://refaccionaria-taller.firebaseio.com`
- **Cópiala, la necesitaremos después**

---

## Paso 3: Obtener Credenciales de Servicio

### 3.1 Ir a Configuración
- En el panel izquierdo, haz clic en el ⚙️ (engranaje) > **Configuración del proyecto**

### 3.2 Ir a Cuentas de servicio
- Haz clic en la pestaña **Cuentas de servicio**

### 3.3 Generar clave privada
- Haz clic en **Generar nueva clave privada**
- Se descargará un archivo JSON
- **Abre este archivo con un editor de texto**

---

## Paso 4: Completar firebase-config.js

### 4.1 Abrir el archivo
- Abre: `firebase-config.js` en VS Code

### 4.2 Copiar valores del JSON descargado
Reemplaza estos valores en el archivo:

```javascript
"project_id": "COPIA_EL_VALOR_project_id",
"private_key_id": "COPIA_EL_VALOR_private_key_id",
"private_key": "COPIA_EL_VALOR_private_key", // Mantén los \n
"client_email": "COPIA_EL_VALOR_client_email",
"client_id": "COPIA_EL_VALOR_client_id",
"client_x509_cert_url": "COPIA_EL_VALOR_client_x509_cert_url",

databaseURL: "https://TU_PROJECT_ID.firebaseio.com"
```

**Importante:** El valor `private_key` viene con `\n` (no son barras invertidas, son caracteres de salto de línea)

### 4.3 Ejemplo completo
```javascript
const serviceAccount = {
  "type": "service_account",
  "project_id": "refaccionaria-taller",
  "private_key_id": "abc123def456",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-abc123@refaccionaria-taller.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://refaccionaria-taller.firebaseio.com"
});
```

---

## Paso 5: Probar Localmente

### 5.1 Instalar dependencias
```powershell
npm install
```

### 5.2 Iniciar servidor
```powershell
npm start
```

### 5.3 Verificar
- Deberías ver: `✓ Firebase conectado exitosamente`
- Y: `✓ Servidor iniciado en http://localhost:3000`

### 5.4 Probar endpoints
- Abre en navegador: `http://localhost:3000/public/admin.html`
- Ingresa contraseña: `artemio123`
- Intenta agregar un producto

---

## Paso 6: Desplegar en Netlify

### 6.1 Preparar proyecto para Netlify
- Crea una carpeta llamada: `functions` en la raíz del proyecto
- Mueve los archivos necesarios

### 6.2 Crear cuenta Netlify
- Ve a: https://www.netlify.com
- Haz clic en "Sign up"
- Usa GitHub, Google o correo

### 6.3 Conectar tu repositorio
- Haz clic en "New site from Git"
- Selecciona GitHub
- Autoriza a Netlify

### 6.4 Seleccionar repositorio
- Elige tu repositorio de refaccionaria
- Branch: `main`

### 6.5 Configurar build (importante!)
- Build command: `npm install`
- Publish directory: `public`

### 6.6 Variables de entorno
- Haz clic en "Deploy settings"
- Ve a "Environment"
- Agrega estas variables (copialas de tu `.env` local):
  - `ADMIN_PASS`
  - `SESSION_SECRET`

### 6.7 Desplegar
- Haz clic en "Deploy site"
- Espera 2-3 minutos
- Recibirás un dominio como: `https://tu-sitio-abc123.netlify.app`

---

## Verificar en Firebase

Una vez creado un producto o una cita, ve a:
1. https://console.firebase.google.com
2. Tu proyecto > Realtime Database
3. Verás los datos en tiempo real 🎉

---

## Solución de problemas

### Error: "MONGODB_URI no está configurada"
- Asegúrate de completar `firebase-config.js` correctamente

### Error: "Cannot find module 'firebase-admin'"
- Corre: `npm install`

### No aparecen productos
- Verifica que hayas iniciado sesión como admin (contraseña: artemio123)
- Revisa la consola de Firebase

### El sitio no se abre en Netlify
- Espera 5 minutos después del deploy
- Limpia el cache del navegador (Ctrl+Shift+Delete)

---

## Contacto y Soporte
Para más ayuda, revisa el README.md o contacta al desarrollador.
