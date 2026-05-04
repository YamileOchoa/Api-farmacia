require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicamentos', require('./routes/medicamentos'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/ventas', require('./routes/ventas'));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
});