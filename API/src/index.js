const express = require('express'); 
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-gateway' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`API Gateway corriendo en el puerto ${port}`);
});
