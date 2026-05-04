require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de farmacia funcionando 🚀');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicamentos', require('./routes/medicamentos'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/ventas', require('./routes/ventas'));

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor en puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al iniciar:', err);
    });