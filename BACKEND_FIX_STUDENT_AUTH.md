# 🔧 Corrección Backend: Autenticación de Estudiantes

## 📋 Problemas Identificados

### **1. Endpoint `/users/me` no retorna datos completos**

**Problema Actual:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "type": "user",
    "iat": 1761104769,
    "exp": 1761191169
  }
}
```

**Lo que debería retornar:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nua": "1234567890",
    "name": "Juan",
    "lastName": "Pérez",
    "secondLastName": "García",
    "email": "juan.perez@example.com",
    "phone": "4611234567",
    "career": "IS75LI0502",
    "sede": "SALAMANCA",
    "active": true
  }
}
```

### **2. Endpoint `/qr-codes/get-my-qr-codes` no identifica la carrera**

**Error recibido:**
```json
{
  "success": false,
  "message": "NO SE PUDO IDENTIFICAR TU CARRERA"
}
```

**Causa:** El endpoint depende de los datos del usuario autenticado, pero estos no están completos.

---

## ✅ Soluciones Backend

### **Solución 1: Corregir `/users/me`**

#### **Archivo: `userController.js` (o similar)**

```javascript
const getUserProfile = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación (JWT)
    const userId = req.user.id
    
    // Consultar datos completos del usuario en la base de datos
    const query = `
      SELECT 
        use_id as id,
        use_nua as nua,
        use_name as name,
        use_last_name as lastName,
        use_second_last_name as secondLastName,
        use_email as email,
        use_phone as phone,
        use_career as career,
        use_sede as sede,
        use_active as active
      FROM users
      WHERE use_id = ?
    `
    
    const [results] = await pool.query(query, [userId])
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'USUARIO NO ENCONTRADO'
      })
    }
    
    const user = results[0]
    
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error en getUserProfile:', error)
    return res.status(500).json({
      success: false,
      message: 'ERROR AL OBTENER PERFIL DEL USUARIO'
    })
  }
}

module.exports = {
  getUserProfile,
  // ... otros métodos
}
```

#### **Archivo: `userRoutes.js`**

```javascript
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { authenticateToken } = require('../middleware/auth')

// Obtener perfil del usuario autenticado
router.get('/me', authenticateToken, userController.getUserProfile)

// ... otras rutas

module.exports = router
```

---

### **Solución 2: Verificar middleware de autenticación**

#### **Archivo: `middleware/auth.js`**

El middleware debe decodificar el JWT y agregar toda la información del usuario:

```javascript
const jwt = require('jsonwebtoken')

const authenticateToken = async (req, res, next) => {
  try {
    // Obtener token de las cookies o header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'TOKEN NO PROPORCIONADO'
      })
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      type: decoded.type
    }
    
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'TOKEN INVÁLIDO O EXPIRADO'
    })
  }
}

module.exports = { authenticateToken }
```

---

### **Solución 3: Corregir `/qr-codes/get-my-qr-codes`**

#### **Archivo: `qrCodeController.js`**

```javascript
const getMyQRCodes = async (req, res) => {
  try {
    const userId = req.user.id
    
    // Primero, obtener la carrera del usuario
    const userQuery = `
      SELECT use_career as career
      FROM users
      WHERE use_id = ?
    `
    const [userResults] = await pool.query(userQuery, [userId])
    
    if (userResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'USUARIO NO ENCONTRADO'
      })
    }
    
    const userCareer = userResults[0].career
    
    if (!userCareer) {
      return res.status(400).json({
        success: false,
        message: 'NO SE PUDO IDENTIFICAR TU CARRERA'
      })
    }
    
    // Obtener QR codes de la carrera del estudiante (solo activos)
    const qrQuery = `
      SELECT 
        qr_id as id,
        qr_career as career,
        qr_area as area,
        qr_image_path as imagePath,
        qr_description as description,
        qr_active as active,
        qr_created_at as createdAt,
        qr_updated_at as updatedAt,
        qr_created_by as createdBy
      FROM qr_codes
      WHERE qr_career = ? 
        AND qr_active = 1
      ORDER BY qr_area
    `
    
    const [qrResults] = await pool.query(qrQuery, [userCareer])
    
    return res.status(200).json({
      success: true,
      qrCodes: qrResults
    })
  } catch (error) {
    console.error('Error en getMyQRCodes:', error)
    return res.status(500).json({
      success: false,
      message: 'ERROR AL OBTENER LOS CÓDIGOS QR'
    })
  }
}

module.exports = {
  getMyQRCodes,
  // ... otros métodos
}
```

---

## 🔍 Verificación

### **1. Probar endpoint `/users/me`**

```bash
# Con cookie (si usas cookies)
curl -X GET http://localhost:3000/api/users/me \
  -H "Cookie: token=YOUR_JWT_TOKEN"

# Con header Authorization
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "nua": "1234567890",
    "name": "Juan",
    "lastName": "Pérez",
    "secondLastName": "García",
    "email": "juan.perez@example.com",
    "phone": "4611234567",
    "career": "IS75LI0502",
    "sede": "SALAMANCA",
    "active": true
  }
}
```

### **2. Probar endpoint `/qr-codes/get-my-qr-codes`**

```bash
curl -X GET http://localhost:3000/api/qr-codes/get-my-qr-codes \
  -H "Cookie: token=YOUR_JWT_TOKEN"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "qrCodes": [
    {
      "id": 1,
      "career": "IS75LI0502",
      "area": "DP/VSS",
      "imagePath": "/uploads/qr-codes/IS75LI0502_DP-VSS_abc123.jpg",
      "description": "Código QR para desarrollo personal",
      "active": true,
      "createdAt": "2025-10-22",
      "updatedAt": "2025-10-22",
      "createdBy": 1
    },
    // ... más QR codes
  ]
}
```

---

## 🚨 Checklist de Verificación

- [ ] El endpoint `/users/me` retorna datos completos del usuario
- [ ] El campo `career` está presente en la respuesta
- [ ] El middleware `authenticateToken` funciona correctamente
- [ ] El endpoint `/qr-codes/get-my-qr-codes` identifica la carrera
- [ ] Solo retorna QR codes activos (`qr_active = 1`)
- [ ] Solo retorna QR codes de la carrera del estudiante
- [ ] Las rutas están correctamente registradas en el servidor

---

## 📝 Notas Adicionales

1. **Seguridad**: Asegúrate de que el token JWT incluya el ID del usuario
2. **Cookies vs Headers**: Decide si usarás cookies o headers para el token
3. **CORS**: Si usas cookies, configura CORS correctamente con `credentials: true`
4. **Caché**: Considera cachear los datos del usuario para mejorar rendimiento
5. **Validación**: Valida que el usuario tenga una carrera asignada al registrarse

---

## 🔄 Flujo Completo

```
1. Usuario hace login → Backend genera JWT con {id, type}
2. Frontend guarda token (cookie o localStorage)
3. Frontend llama a /users/me → Backend consulta DB → Retorna datos completos
4. Middleware auth-student guarda datos en Vuex
5. Frontend llama a /qr-codes/get-my-qr-codes → Backend usa req.user.id
6. Backend consulta carrera del usuario → Retorna QR codes de esa carrera
7. Frontend muestra QR codes
```
