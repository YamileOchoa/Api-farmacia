# 🌿 API REST - Sistema de Farmacia

> Node.js · Express · Sequelize · MySQL · JWT

**Base URL:** `https://api-farmacia-txlu.onrender.com`

---

## 📋 Descripción

API REST para la gestión de operaciones de una empresa farmacéutica. Permite administrar medicamentos, compras a laboratorios, ventas y usuarios, con autenticación JWT y control de acceso por roles.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y rutas HTTP |
| Sequelize | ORM para base de datos relacional |
| MySQL | Base de datos (hosteada en la nube) |
| JWT (jsonwebtoken) | Autenticación y sesiones |
| bcryptjs | Encriptación de contraseñas |
| dotenv | Variables de entorno |
| Render.com | Despliegue de la API |

---

## 👥 Roles del Sistema

| Rol | Permisos |
|---|---|
| `ADMIN` | Acceso total: medicamentos, compras, ventas, eliminación |
| `VENDEDOR` | Registrar ventas |
| `ALMACEN` | Registrar compras y gestionar medicamentos |

> ⚠️ **IMPORTANTE:** En la base de datos desplegada solo existe el usuario ADMIN. Créalo primero antes de cualquier prueba.

---

## 📡 Endpoints

### 🔐 Autenticación — `/api/auth`

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Login y obtener token JWT | No |

### 💊 Medicamentos — `/api/medicamentos`

| Método | Endpoint | Descripción | Roles |
|---|---|---|---|
| GET | `/api/medicamentos` | Listar todos | Todos |
| POST | `/api/medicamentos` | Crear medicamento | ADMIN, ALMACEN |
| PUT | `/api/medicamentos/:id` | Actualizar medicamento | ADMIN, ALMACEN |
| DELETE | `/api/medicamentos/:id` | Eliminar medicamento | ADMIN |

### 🛒 Compras — `/api/compras`

| Método | Endpoint | Descripción | Roles |
|---|---|---|---|
| POST | `/api/compras` | Registrar orden de compra (actualiza stock) | ADMIN, ALMACEN |

### 💰 Ventas — `/api/ventas`

| Método | Endpoint | Descripción | Roles |
|---|---|---|---|
| POST | `/api/ventas` | Registrar venta (valida y descuenta stock) | ADMIN, VENDEDOR |

---

## 🧪 Casos de Prueba

> El token JWT va en: `Headers → Authorization: Bearer <token>`

### 1. Autenticación

#### 1.1 Registrar usuario ADMIN
```
POST https://api-farmacia-txlu.onrender.com/api/auth/register
```
```json
{
  "nombre": "Admin",
  "email": "admin@farmacia.com",
  "password": "123456",
  "rol": "ADMIN"
}
```
✅ Esperado: `201` — `{ "msg": "Usuario creado", "id": 1 }`

---

#### 1.2 Login y obtener token
```
POST https://api-farmacia-txlu.onrender.com/api/auth/login
```
```json
{
  "email": "admin@farmacia.com",
  "password": "123456"
}
```
✅ Esperado: `200` — `{ "token": "eyJ..." }` → copiar este token

---

#### 1.3 Acceder sin token (debe fallar)
```
GET https://api-farmacia-txlu.onrender.com/api/medicamentos
(sin header Authorization)
```
❌ Esperado: `401` — `{ "msg": "Sin token" }`

---

### 2. Control de Roles

#### 2.1 Registrar usuario VENDEDOR
```
POST https://api-farmacia-txlu.onrender.com/api/auth/register
```
```json
{
  "nombre": "Vendedor Uno",
  "email": "vendedor@farmacia.com",
  "password": "123456",
  "rol": "VENDEDOR"
}
```
✅ Esperado: `201` — Usuario creado

---

#### 2.2 Login como VENDEDOR
```
POST https://api-farmacia-txlu.onrender.com/api/auth/login
```
```json
{
  "email": "vendedor@farmacia.com",
  "password": "123456"
}
```
✅ Copiar el token del vendedor para la siguiente prueba

---

#### 2.3 VENDEDOR intenta eliminar medicamento (debe fallar)
```
DELETE https://api-farmacia-txlu.onrender.com/api/medicamentos/1
Authorization: Bearer <token del vendedor>
```
❌ Esperado: `403` — `{ "msg": "Acceso denegado" }`

---

### 3. Medicamentos

#### 3.1 Crear medicamento — Paracetamol
```
POST https://api-farmacia-txlu.onrender.com/api/medicamentos
Authorization: Bearer <token ADMIN>
```
```json
{
  "nombre": "Paracetamol",
  "precio": 5.50,
  "stock": 100,
  "fecha_vencimiento": "2027-12-31"
}
```
✅ Esperado: `201` — objeto del medicamento creado

---

#### 3.2 Crear medicamento — Ibuprofeno (stock bajo para pruebas)
```
POST https://api-farmacia-txlu.onrender.com/api/medicamentos
Authorization: Bearer <token ADMIN>
```
```json
{
  "nombre": "Ibuprofeno",
  "precio": 8.00,
  "stock": 5,
  "fecha_vencimiento": "2027-06-30"
}
```
✅ Esperado: `201` — objeto del medicamento creado

---

#### 3.3 Listar medicamentos
```
GET https://api-farmacia-txlu.onrender.com/api/medicamentos
Authorization: Bearer <token ADMIN>
```
✅ Esperado: `200` — array con todos los medicamentos

---

#### 3.4 Actualizar medicamento
```
PUT https://api-farmacia-txlu.onrender.com/api/medicamentos/1
Authorization: Bearer <token ADMIN>
```
```json
{
  "precio": 6.00,
  "stock": 150
}
```
✅ Esperado: `200` — `{ "msg": "Actualizado" }`

---

#### 3.5 Eliminar medicamento (solo ADMIN)
```
DELETE https://api-farmacia-txlu.onrender.com/api/medicamentos/1
Authorization: Bearer <token ADMIN>
```
✅ Esperado: `200` — `{ "msg": "Eliminado" }`

---

### 4. Compras

> ⚠️ Antes de registrar compras, insertar un laboratorio directo en MySQL:
> ```sql
> INSERT INTO Laboratorios (nombre, direccion, createdAt, updatedAt)
> VALUES ('Lab Bayer', 'Av. Principal 123', NOW(), NOW());
> ```

#### 4.1 Registrar orden de compra
```
POST https://api-farmacia-txlu.onrender.com/api/compras
Authorization: Bearer <token ADMIN>
```
```json
{
  "laboratorioId": 1,
  "detalles": [
    {
      "medicamentoId": 2,
      "cantidad": 50,
      "precio": 4.00
    }
  ]
}
```
✅ Esperado: `201` — Compra registrada

---

#### 4.2 Verificar que el stock aumentó
```
GET https://api-farmacia-txlu.onrender.com/api/medicamentos
Authorization: Bearer <token ADMIN>
```
✅ Esperado: Ibuprofeno con `stock: 55` (5 + 50)

---

### 5. Ventas

#### 5.1 Venta con stock suficiente
```
POST https://api-farmacia-txlu.onrender.com/api/ventas
Authorization: Bearer <token ADMIN>
```
```json
{
  "detalles": [
    {
      "medicamentoId": 2,
      "cantidad": 10,
      "precio": 8.00
    }
  ]
}
```
✅ Esperado: `201` — Venta registrada

---

#### 5.2 Verificar que el stock bajó
```
GET https://api-farmacia-txlu.onrender.com/api/medicamentos
Authorization: Bearer <token ADMIN>
```
✅ Esperado: Ibuprofeno con `stock: 45` (55 - 10)

---

#### 5.3 Venta sin stock suficiente (debe fallar)
```
POST https://api-farmacia-txlu.onrender.com/api/ventas
Authorization: Bearer <token ADMIN>
```
```json
{
  "detalles": [
    {
      "medicamentoId": 2,
      "cantidad": 9999,
      "precio": 8.00
    }
  ]
}
```
❌ Esperado: `400` — `{ "msg": "Stock insuficiente para Ibuprofeno" }`

---

## 📋 Orden Recomendado de Pruebas

| # | Acción | Método | Endpoint | Resultado Esperado |
|---|---|---|---|---|
| 1 | Registrar ADMIN | POST | `/api/auth/register` | 201 - Usuario creado |
| 2 | Login ADMIN | POST | `/api/auth/login` | 200 - token JWT |
| 3 | Sin token → falla | GET | `/api/medicamentos` | 401 - Sin token |
| 4 | Registrar VENDEDOR | POST | `/api/auth/register` | 201 - Usuario creado |
| 5 | Login VENDEDOR | POST | `/api/auth/login` | 200 - token JWT |
| 6 | VENDEDOR elimina → falla | DELETE | `/api/medicamentos/1` | 403 - Acceso denegado |
| 7 | Crear Paracetamol | POST | `/api/medicamentos` | 201 - medicamento |
| 8 | Crear Ibuprofeno (stock 5) | POST | `/api/medicamentos` | 201 - medicamento |
| 9 | Listar medicamentos | GET | `/api/medicamentos` | 200 - array |
| 10 | Actualizar medicamento | PUT | `/api/medicamentos/1` | 200 - Actualizado |
| 11 | Registrar compra (+50) | POST | `/api/compras` | 201 - Compra registrada |
| 12 | Verificar stock subió | GET | `/api/medicamentos` | stock: 55 |
| 13 | Registrar venta (-10) | POST | `/api/ventas` | 201 - Venta registrada |
| 14 | Verificar stock bajó | GET | `/api/medicamentos` | stock: 45 |
| 15 | Venta sin stock → falla | POST | `/api/ventas` | 400 - Stock insuficiente |
| 16 | Eliminar medicamento | DELETE | `/api/medicamentos/1` | 200 - Eliminado |

---

## 📸 Evidencia Obligatoria

- [ ] Login exitoso mostrando el token JWT
- [ ] GET `/api/medicamentos` sin token → 401
- [ ] DELETE con token de VENDEDOR → 403
- [ ] POST `/api/medicamentos` exitoso → 201
- [ ] POST `/api/compras` y GET mostrando stock aumentado
- [ ] POST `/api/ventas` exitosa → 201
- [ ] POST `/api/ventas` con stock insuficiente → 400
- [ ] Colección de Postman exportada en JSON

---

## 🗂️ Estructura del Proyecto

```
farmacia-api/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── medicamentoController.js
│   ├── compraController.js
│   └── ventaController.js
├── middleware/
│   ├── auth.js
│   └── roles.js
├── models/
│   ├── index.js
│   ├── Usuario.js
│   ├── Medicamento.js
│   ├── Laboratorio.js
│   ├── OrdenCompra.js
│   ├── DetalleCompra.js
│   ├── OrdenVenta.js
│   └── DetalleVenta.js
├── routes/
│   ├── auth.js
│   ├── medicamentos.js
│   ├── compras.js
│   └── ventas.js
├── .env
└── server.js
```

---

*API Farmacia — Node.js · Express · Sequelize · MySQL · Render.com*
