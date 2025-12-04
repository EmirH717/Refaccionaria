require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

let db;
try {
  const firebaseConfig = require('./firebase-config');
  db = firebaseConfig.db;
  console.log('✓ Firebase conectado exitosamente');
} catch (err) {
  console.error('✗ Error al cargar Firebase:', err.message);
  console.log('ℹ Por favor, configura firebase-config.js con tus credenciales');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'refaccionaria-secret',
  resave: false,
  saveUninitialized: false,
}));

// Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
  }
});
const upload = multer({ storage });

// ============== PRODUCTOS ==============

// Validación de producto
function validateProduct(data) {
  const errors = [];
  if (!data.name || data.name.trim().length === 0) errors.push('El nombre es requerido');
  if (!data.category || data.category.trim().length === 0) errors.push('La categoría es requerida');
  if (!data.stock || isNaN(data.stock) || data.stock < 0) errors.push('El stock debe ser un número válido');
  if (!data.price || isNaN(data.price) || data.price < 0) errors.push('El precio debe ser un número válido');
  return errors;
}

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.ref('products').orderByChild('createdAt').once('value');
    const products = [];
    snapshot.forEach((child) => {
      products.unshift(child.val());
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Admin auth
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const ADMIN_PASS = process.env.ADMIN_PASS || 'artemio123';
  if (password === ADMIN_PASS) {
    req.session.isAdmin = true;
    res.json({ ok: true });
  } else res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(403).json({ ok: false, message: 'Acceso denegado' });
}

// POST new product (admin)
app.post('/api/admin/products', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, category, stock, price } = req.body;

    const errors = validateProduct({ name, category, stock, price });
    if (errors.length > 0) {
      return res.status(400).json({ ok: false, error: 'Validación fallida', details: errors });
    }

    const id = uuidv4();
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const createdAt = new Date().toISOString();

    const product = {
      id,
      name: name.trim(),
      category: category.trim(),
      stock: Number(stock),
      price: Number(price),
      image,
      createdAt
    };

    await db.ref(`products/${id}`).set(product);
    res.json({ ok: true, product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ ok: false, error: 'Error al crear producto' });
  }
});

// PUT update product (admin)
app.put('/api/admin/products/:id', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, stock, price } = req.body;

    if (!id || id.trim().length === 0) {
      return res.status(400).json({ ok: false, error: 'ID de producto inválido' });
    }

    const errors = validateProduct({ name, category, stock, price });
    if (errors.length > 0) {
      return res.status(400).json({ ok: false, error: 'Validación fallida', details: errors });
    }

    const snapshot = await db.ref(`products/${id}`).once('value');
    const product = snapshot.val();
    
    if (!product) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }

    let image = product.image;
    if (req.file) {
      if (product.image) {
        try { fs.unlinkSync(path.join(__dirname, product.image)); } catch (e) {}
      }
      image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = {
      id,
      name: name.trim(),
      category: category.trim(),
      stock: Number(stock),
      price: Number(price),
      image,
      createdAt: product.createdAt
    };

    await db.ref(`products/${id}`).update(updatedProduct);
    res.json({ ok: true, product: updatedProduct });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ ok: false, error: 'Error al actualizar producto' });
  }
});

// DELETE product (admin)
app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.trim().length === 0) {
      return res.status(400).json({ ok: false, error: 'ID de producto inválido' });
    }

    const snapshot = await db.ref(`products/${id}`).once('value');
    const product = snapshot.val();
    
    if (!product) {
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    }

    if (product.image) {
      try { fs.unlinkSync(path.join(__dirname, product.image)); } catch (e) {}
    }

    await db.ref(`products/${id}`).remove();
    res.json({ ok: true, message: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ ok: false, error: 'Error al eliminar producto' });
  }
});

// ============== CITAS ==============

// Validación de cita
function validateAppointment(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('El nombre es requerido');
  }
  
  if (!data.whatsapp || data.whatsapp.trim().length === 0) {
    errors.push('El WhatsApp es requerido');
  } else if (!/^\d{10,}$/.test(data.whatsapp.replace(/\D/g, ''))) {
    errors.push('El WhatsApp debe tener al menos 10 dígitos');
  }
  
  if (!data.carModel || data.carModel.trim().length === 0) {
    errors.push('El modelo del vehículo es requerido');
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('La descripción del servicio es requerida');
  }
  
  if (!data.date || data.date.trim().length === 0) {
    errors.push('La fecha es requerida');
  }
  
  if (!data.time || data.time.trim().length === 0) {
    errors.push('La hora es requerida');
  }
  
  return errors;
}

// POST new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { name, whatsapp, carModel, description, date, time, notas } = req.body;
    
    const errors = validateAppointment({ name, whatsapp, carModel, description, date, time });
    if (errors.length > 0) {
      return res.status(400).json({ ok: false, error: 'Validación fallida', details: errors });
    }
    
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const appointment = {
      id,
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      carModel: carModel.trim(),
      description: description.trim(),
      notas: notas || '',
      date: date.trim(),
      time: time.trim(),
      createdAt
    };

    await db.ref(`appointments/${id}`).set(appointment);

    // Send email to configured admin email
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'refacctaller23@gmail.com';

    const smtpHost = process.env.SMTP_HOST;
    if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { rejectUnauthorized: false }
      });

      const html = `<h2>Nueva cita - Refaccionaria y Taller Guerrero</h2>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Modelo del vehículo:</strong> ${carModel}</p>
        <p><strong>Tipo de servicio:</strong> ${description}</p>
        ${notas ? `<p><strong>Notas adicionales:</strong> ${notas}</p>` : ''}
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${time}</p>
        <hr>
        <p style="color: #666; font-size: 0.9em;">Cita recibida: ${new Date().toLocaleString('es-MX')}</p>`;

      transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to: ADMIN_EMAIL,
        subject: `Nueva cita: ${name} - ${date} ${time}`,
        html
      }).then(() => {
        res.json({ ok: true, emailed: true });
      }).catch(err => {
        console.error('Error sending mail', err);
        res.json({ ok: true, emailed: false, error: String(err) });
      });
    } else {
      console.warn('SMTP no configurado. La cita se guardó en Firebase pero no se envió correo.');
      res.json({ ok: true, emailed: false, message: 'SMTP no configurado. Revisa README para configurar.' });
    }
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ ok: false, error: 'Error al crear cita' });
  }
});

// GET all appointments (admin)
app.get('/api/admin/appointments', requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.ref('appointments').orderByChild('createdAt').once('value');
    const appointments = [];
    snapshot.forEach((child) => {
      appointments.unshift(child.val());
    });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

// Serve static files
app.get('*', (req, res) => {
  if (req.path === '/' || req.path === '/index.html') return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.status(404).send('Not found');
});

// Start server
app.listen(PORT, () => console.log(`\n✓ Servidor iniciado en http://localhost:${PORT}\n`));
