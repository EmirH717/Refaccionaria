// Estructuras de datos en Firebase Realtime Database
// Este archivo documenta la estructura de las colecciones

// PRODUCTOS
// Ubicación en Firebase: /products/{productId}
const ProductStructure = {
  id: "uuid",                  // Identificador único
  name: "string",              // Nombre del producto
  category: "string",          // Categoría (ej: "Motores", "Transmisiones")
  stock: "number",             // Cantidad disponible
  price: "number",             // Precio en pesos
  image: "string",             // Ruta relativa a imagen (/uploads/xxx)
  createdAt: "ISO8601"         // Fecha de creación
};

// CITAS
// Ubicación en Firebase: /appointments/{appointmentId}
const AppointmentStructure = {
  id: "uuid",                  // Identificador único
  name: "string",              // Nombre del cliente
  whatsapp: "string",          // Número de WhatsApp
  carModel: "string",          // Modelo del vehículo
  description: "string",       // Descripción del servicio
  notas: "string",             // Notas adicionales (opcional)
  date: "string",              // Fecha (YYYY-MM-DD)
  time: "string",              // Hora (HH:MM)
  createdAt: "ISO8601"         // Fecha de creación
};

module.exports = {
  ProductStructure,
  AppointmentStructure
};
