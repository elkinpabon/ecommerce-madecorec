# 📚 Madecorec E-commerce API - Documentación Completa

**Versión:** 1.0.0  
**Base URL:** `http://localhost:5000/api`  
**Ambiente:** Desarrollo  
**Última actualización:** 18 de Octubre de 2025

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Endpoints de Autenticación](#endpoints-de-autenticación)
4. [Endpoints de Usuarios](#endpoints-de-usuarios)
5. [Endpoints de Categorías](#endpoints-de-categorías)
6. [Endpoints de Productos](#endpoints-de-productos)
7. [Endpoints de Carrito](#endpoints-de-carrito)
8. [Endpoints de Órdenes](#endpoints-de-órdenes)
9. [Endpoints de Pagos](#endpoints-de-pagos)
10. [Códigos de Estado HTTP](#códigos-de-estado-http)
11. [Manejo de Errores](#manejo-de-errores)
12. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 Introducción

### Base URL
```
http://localhost:5000/api
```

### Headers Requeridos
```
Content-Type: application/json
```

### Respuesta Estándar (Success)
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... },
  "statusCode": 200
}
```

### Respuesta Estándar (Error)
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detalles adicionales"
  },
  "statusCode": 400
}
```

---

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación.

### Obtener Token
1. Hacer login en `/api/auth/login`
2. Guardar el token retornado
3. Incluir en header `Authorization: Bearer {token}`

### Validez del Token
- **Duración:** 7 días
- **Tipo:** JWT (HS256)
- **Ubicación:** Header Authorization

### Renovar Token
```
POST /api/auth/refresh-token
Authorization: Bearer {token}
```

### Roles
- **USER** - Usuario normal
- **ADMIN** - Administrador del sistema

---

## 📤 Endpoints de Autenticación

### 1. Registrar Usuario

**Endpoint:** `POST /api/auth/register`

**Descripción:** Crear una nueva cuenta de usuario

**Permisos:** Público (sin autenticación)

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Validaciones:**
- `first_name` - Requerido, máximo 100 caracteres
- `last_name` - Requerido, máximo 100 caracteres
- `email` - Requerido, formato válido, único
- `password` - Requerido, mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 2,
    "email": "juan@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "role": "USER",
    "created_at": "2025-01-18T10:30:00Z"
  },
  "statusCode": 201
}
```

**Errores posibles:**
- `400` - Email ya existe
- `400` - Contraseña débil
- `422` - Validación fallida

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Descripción:** Autenticar usuario y obtener token

**Permisos:** Público

**Body:**
```json
{
  "email": "admin@madecorec.com",
  "password": "Admin123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@madecorec.com",
      "first_name": "Admin",
      "last_name": "MadeCorec",
      "role": "ADMIN",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": "7d"
  },
  "statusCode": 200
}
```

**Errores posibles:**
- `401` - Email o contraseña incorrectos
- `404` - Usuario no encontrado
- `403` - Cuenta desactivada

**Credenciales de Prueba:**
- Email: `admin@madecorec.com`
- Password: `Admin123!`

---

### 3. Obtener Perfil

**Endpoint:** `GET /api/auth/profile`

**Descripción:** Obtener información del usuario autenticado

**Permisos:** Autenticado (USER, ADMIN)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "admin@madecorec.com",
    "first_name": "Admin",
    "last_name": "MadeCorec",
    "phone": "+593999999999",
    "address": "Dirección Admin",
    "city": "Quito",
    "country": "Ecuador",
    "role": "ADMIN",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-01-18T10:00:00Z",
    "last_login": "2025-01-18T15:30:00Z"
  },
  "statusCode": 200
}
```

---

### 4. Actualizar Perfil

**Endpoint:** `PUT /api/auth/profile`

**Descripción:** Actualizar información del usuario

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+593987654321",
  "address": "Calle Principal 123",
  "city": "Quito",
  "country": "Ecuador"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+593987654321",
    "updated_at": "2025-01-18T15:45:00Z"
  },
  "statusCode": 200
}
```

---

### 5. Cambiar Contraseña

**Endpoint:** `POST /api/auth/change-password`

**Descripción:** Cambiar contraseña del usuario

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "current_password": "Admin123!",
  "new_password": "NuevaPassword123!",
  "confirm_password": "NuevaPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "statusCode": 200
}
```

**Errores posibles:**
- `400` - Contraseña actual incorrecta
- `400` - Contraseñas no coinciden
- `400` - Contraseña débil

---

### 6. Recuperar Contraseña

**Endpoint:** `POST /api/auth/forgot-password`

**Descripción:** Enviar enlace para recuperar contraseña

**Permisos:** Público

**Body:**
```json
{
  "email": "admin@madecorec.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reset password link sent to email",
  "statusCode": 200
}
```

---

### 7. Resetear Contraseña

**Endpoint:** `POST /api/auth/reset-password`

**Descripción:** Establecer nueva contraseña con token

**Permisos:** Público

**Body:**
```json
{
  "token": "token-enviado-por-email",
  "new_password": "NuevaPassword123!",
  "confirm_password": "NuevaPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "statusCode": 200
}
```

---

### 8. Refresh Token

**Endpoint:** `POST /api/auth/refresh-token`

**Descripción:** Obtener nuevo token

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "nuevo-jwt-token",
    "expires_in": "7d"
  },
  "statusCode": 200
}
```

---

### 9. Logout

**Endpoint:** `POST /api/auth/logout`

**Descripción:** Cerrar sesión (invalida el token)

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "statusCode": 200
}
```

---

## 👥 Endpoints de Usuarios

### 1. Obtener Todos los Usuarios

**Endpoint:** `GET /api/users`

**Descripción:** Obtener lista de todos los usuarios

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1              (default: 1)
limit=20            (default: 20, max: 100)
search=juan         (buscar en nombre o email)
role=USER           (USER o ADMIN)
is_active=true      (true o false)
sort_by=created_at  (created_at, email, first_name)
sort_order=DESC     (ASC o DESC)
```

**Ejemplo completo:**
```
GET /api/users?page=1&limit=20&search=juan&role=USER&is_active=true
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 2,
        "email": "juan@ejemplo.com",
        "first_name": "Juan",
        "last_name": "Pérez",
        "phone": "+593999999999",
        "role": "USER",
        "is_active": true,
        "created_at": "2025-01-18T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Usuario por ID

**Endpoint:** `GET /api/users/:id`

**Descripción:** Obtener información de un usuario específico

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Parámetros:**
- `id` - ID del usuario

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 2,
    "email": "juan@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+593999999999",
    "address": "Calle Principal 123",
    "city": "Quito",
    "country": "Ecuador",
    "role": "USER",
    "is_active": true,
    "email_verified": true,
    "last_login": "2025-01-18T15:30:00Z",
    "created_at": "2025-01-18T10:30:00Z",
    "updated_at": "2025-01-18T10:30:00Z"
  },
  "statusCode": 200
}
```

---

### 3. Estadísticas de Usuarios

**Endpoint:** `GET /api/users/stats`

**Descripción:** Obtener estadísticas de usuarios

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User statistics retrieved",
  "data": {
    "total_users": 50,
    "active_users": 45,
    "inactive_users": 5,
    "admin_users": 2,
    "regular_users": 48,
    "new_users_today": 3,
    "new_users_this_week": 15,
    "new_users_this_month": 50
  },
  "statusCode": 200
}
```

---

### 4. Crear Usuario

**Endpoint:** `POST /api/users`

**Descripción:** Crear un nuevo usuario (Admin)

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "first_name": "Carlos",
  "last_name": "López",
  "email": "carlos@ejemplo.com",
  "password": "Password123!",
  "phone": "+593999999999",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 3,
    "email": "carlos@ejemplo.com",
    "first_name": "Carlos",
    "last_name": "López",
    "phone": "+593999999999",
    "role": "USER",
    "is_active": true,
    "created_at": "2025-01-18T16:00:00Z"
  },
  "statusCode": 201
}
```

---

### 5. Actualizar Usuario

**Endpoint:** `PUT /api/users/:id`

**Descripción:** Actualizar información de usuario

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "first_name": "Carlos",
  "last_name": "López",
  "phone": "+593987654321",
  "address": "Nuevo Domicilio",
  "city": "Guayaquil",
  "role": "ADMIN",
  "is_active": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 3,
    "first_name": "Carlos",
    "last_name": "López",
    "updated_at": "2025-01-18T16:15:00Z"
  },
  "statusCode": 200
}
```

---

### 6. Cambiar Estado de Usuario

**Endpoint:** `PATCH /api/users/:id/toggle-status`

**Descripción:** Activar/Desactivar usuario

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": 3,
    "is_active": false,
    "updated_at": "2025-01-18T16:20:00Z"
  },
  "statusCode": 200
}
```

---

### 7. Eliminar Usuario

**Endpoint:** `DELETE /api/users/:id`

**Descripción:** Eliminar usuario del sistema

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "statusCode": 200
}
```

---

## 🏷️ Endpoints de Categorías

### 1. Obtener Todas las Categorías

**Endpoint:** `GET /api/categories`

**Descripción:** Obtener lista de categorías

**Permisos:** Público

**Query Parameters:**
```
page=1                (default: 1)
limit=20              (default: 20)
search=sala           (buscar por nombre)
is_active=true        (true o false)
sort_by=sort_order    (name, sort_order, created_at)
sort_order=ASC        (ASC o DESC)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Sala",
        "slug": "sala",
        "description": "Muebles para sala de estar",
        "image_url": null,
        "is_active": true,
        "sort_order": 1,
        "products_count": 5,
        "created_at": "2025-01-18T10:00:00Z",
        "updated_at": "2025-01-18T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Categorías Activas

**Endpoint:** `GET /api/categories/active`

**Descripción:** Obtener solo categorías activas

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Active categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Sala",
      "slug": "sala",
      "description": "Muebles para sala de estar",
      "is_active": true,
      "sort_order": 1
    }
  ],
  "statusCode": 200
}
```

---

### 3. Obtener Categoría por ID

**Endpoint:** `GET /api/categories/:id`

**Descripción:** Obtener una categoría específica

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sala",
    "slug": "sala",
    "description": "Muebles para sala de estar",
    "image_url": null,
    "is_active": true,
    "sort_order": 1,
    "products": [
      {
        "id": 1,
        "name": "Sofá 3 Puestos",
        "price": 650.00
      }
    ]
  },
  "statusCode": 200
}
```

---

### 4. Obtener Categoría por Slug

**Endpoint:** `GET /api/categories/slug/:slug`

**Descripción:** Obtener categoría por slug

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sala",
    "slug": "sala",
    "products": [...]
  },
  "statusCode": 200
}
```

---

### 5. Crear Categoría

**Endpoint:** `POST /api/categories`

**Descripción:** Crear nueva categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Baño",
  "description": "Accesorios y muebles para baño",
  "image_url": "https://ejemplo.com/baño.jpg",
  "is_active": true,
  "sort_order": 6
}
```

**Validaciones:**
- `name` - Requerido, máximo 100 caracteres, único
- `description` - Opcional, máximo 1000 caracteres
- `sort_order` - Opcional, número entero

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 6,
    "name": "Baño",
    "slug": "baño",
    "description": "Accesorios y muebles para baño",
    "is_active": true,
    "sort_order": 6,
    "created_at": "2025-01-18T16:30:00Z"
  },
  "statusCode": 201
}
```

---

### 6. Actualizar Categoría

**Endpoint:** `PUT /api/categories/:id`

**Descripción:** Actualizar información de categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Sala de Estar",
  "description": "Muebles modernos para sala",
  "sort_order": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Sala de Estar",
    "slug": "sala-de-estar",
    "updated_at": "2025-01-18T16:45:00Z"
  },
  "statusCode": 200
}
```

---

### 7. Cambiar Estado de Categoría

**Endpoint:** `PATCH /api/categories/:id/toggle-status`

**Descripción:** Activar/Desactivar categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category status updated successfully",
  "data": {
    "id": 1,
    "is_active": false
  },
  "statusCode": 200
}
```

---

### 8. Eliminar Categoría

**Endpoint:** `DELETE /api/categories/:id`

**Descripción:** Eliminar categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Restricciones:**
- No se puede eliminar si tiene productos asociados

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "statusCode": 200
}
```

---

## 🛍️ Endpoints de Productos

### 1. Obtener Todos los Productos

**Endpoint:** `GET /api/products`

**Descripción:** Obtener lista de productos con filtros

**Permisos:** Público

**Query Parameters:**
```
page=1              (default: 1)
limit=20            (default: 20)
category_id=1       (filtrar por categoría)
search=sofa         (buscar por nombre)
min_price=0         (precio mínimo)
max_price=1000      (precio máximo)
is_featured=true    (solo destacados)
status=ACTIVE       (ACTIVE, INACTIVE, DISCONTINUED)
sort_by=price       (name, price, created_at)
sort_order=ASC      (ASC o DESC)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Sofá 3 Puestos Moderno",
        "slug": "sofa-3-puestos-moderno",
        "description": "Elegante sofá de 3 puestos",
        "price": 650.00,
        "compare_price": 750.00,
        "stock_quantity": 15,
        "category": {
          "id": 1,
          "name": "Sala"
        },
        "is_featured": true,
        "status": "ACTIVE",
        "images": ["url1", "url2"],
        "created_at": "2025-01-18T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Productos Destacados

**Endpoint:** `GET /api/products/featured`

**Descripción:** Obtener solo productos destacados

**Permisos:** Público

**Query Parameters:**
```
limit=8  (cantidad de productos)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Featured products retrieved successfully",
  "data": {
    "products": [...]
  },
  "statusCode": 200
}
```

---

### 3. Buscar Productos

**Endpoint:** `GET /api/products/search`

**Descripción:** Buscar productos

**Permisos:** Público

**Query Parameters:**
```
search=sofa         (término de búsqueda)
category_id=1       (filtro de categoría)
page=1              (página)
limit=20            (items por página)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Products found",
  "data": {
    "products": [...]
  },
  "statusCode": 200
}
```

---

### 4. Obtener Producto por ID

**Endpoint:** `GET /api/products/:id`

**Descripción:** Obtener información detallada de un producto

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sofá 3 Puestos Moderno",
    "slug": "sofa-3-puestos-moderno",
    "description": "Elegante sofá de 3 puestos tapizado en tela de alta calidad",
    "short_description": "Sofá moderno y cómodo para sala",
    "sku": "SOFA-3P-MOD-001",
    "price": 650.00,
    "compare_price": 750.00,
    "cost_price": 400.00,
    "stock_quantity": 15,
    "min_stock_level": 3,
    "weight": 45.50,
    "dimensions": "200x80x85 cm",
    "images": ["url1", "url2"],
    "category": {
      "id": 1,
      "name": "Sala",
      "slug": "sala"
    },
    "status": "ACTIVE",
    "is_featured": true,
    "meta_title": "Sofá 3 Puestos Moderno",
    "meta_description": "Sofá moderno de 3 puestos",
    "rating": 4.5,
    "reviews_count": 12,
    "created_at": "2025-01-18T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### 5. Obtener Producto por Slug

**Endpoint:** `GET /api/products/slug/:slug`

**Descripción:** Obtener producto por slug amigable

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 6. Estadísticas de Productos

**Endpoint:** `GET /api/products/admin/stats`

**Descripción:** Obtener estadísticas de productos

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product statistics retrieved",
  "data": {
    "total_products": 25,
    "active_products": 23,
    "inactive_products": 2,
    "total_stock": 500,
    "low_stock_products": 5,
    "featured_products": 8,
    "average_price": 450.00,
    "total_value": 11250.00
  },
  "statusCode": 200
}
```

---

### 7. Crear Producto

**Endpoint:** `POST /api/products`

**Descripción:** Crear nuevo producto

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Silla Ejecutiva Premium",
  "description": "Silla ergonómica con ruedas y respaldo alto",
  "short_description": "Silla ejecutiva cómoda",
  "sku": "SILLA-EXEC-PREM-001",
  "price": 250.00,
  "compare_price": 300.00,
  "cost_price": 150.00,
  "stock_quantity": 20,
  "min_stock_level": 5,
  "weight": 15.5,
  "dimensions": "65x65x105 cm",
  "category_id": 4,
  "is_featured": false,
  "meta_title": "Silla Ejecutiva Premium",
  "meta_description": "Silla ergonómica de alta calidad"
}
```

**Validaciones:**
- `name` - Requerido, máximo 200 caracteres
- `sku` - Requerido, único, 3-50 caracteres
- `price` - Requerido, número positivo
- `category_id` - Requerido, categoría debe existir
- `stock_quantity` - Requerido, número entero

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 6,
    "name": "Silla Ejecutiva Premium",
    "slug": "silla-ejecutiva-premium",
    "price": 250.00,
    "sku": "SILLA-EXEC-PREM-001",
    "created_at": "2025-01-18T17:00:00Z"
  },
  "statusCode": 201
}
```

---

### 8. Actualizar Producto

**Endpoint:** `PUT /api/products/:id`

**Descripción:** Actualizar información de producto

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Sofá 3 Puestos Premium",
  "price": 700.00,
  "stock_quantity": 10,
  "is_featured": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Sofá 3 Puestos Premium",
    "updated_at": "2025-01-18T17:15:00Z"
  },
  "statusCode": 200
}
```

---

### 9. Actualizar Stock

**Endpoint:** `PATCH /api/products/:id/stock`

**Descripción:** Actualizar cantidad en stock

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "quantity": 25
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product stock updated successfully",
  "data": {
    "id": 1,
    "stock_quantity": 25,
    "updated_at": "2025-01-18T17:20:00Z"
  },
  "statusCode": 200
}
```

---

### 10. Eliminar Producto

**Endpoint:** `DELETE /api/products/:id`

**Descripción:** Eliminar producto

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "statusCode": 200
}
```

---

## 🛒 Endpoints de Carrito

### 1. Obtener Carrito

**Endpoint:** `GET /api/cart`

**Descripción:** Obtener carrito del usuario autenticado

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_items": 2,
    "subtotal": 1300.00,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Sofá 3 Puestos",
          "price": 650.00
        },
        "quantity": 1,
        "unit_price": 650.00,
        "total_price": 650.00
      },
      {
        "id": 2,
        "product": {
          "id": 2,
          "name": "Mesa de Comedor",
          "price": 420.00
        },
        "quantity": 1,
        "unit_price": 420.00,
        "total_price": 420.00
      }
    ],
    "created_at": "2025-01-18T10:00:00Z",
    "updated_at": "2025-01-18T17:30:00Z"
  },
  "statusCode": 200
}
```

---

### 2. Obtener Cantidad de Items

**Endpoint:** `GET /api/cart/count`

**Descripción:** Obtener número de items en carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart count retrieved",
  "data": {
    "count": 2
  },
  "statusCode": 200
}
```

---

### 3. Validar Carrito

**Endpoint:** `GET /api/cart/validate`

**Descripción:** Validar stock y precios del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart validated successfully",
  "data": {
    "valid": true,
    "errors": [],
    "subtotal": 1300.00
  },
  "statusCode": 200
}
```

---

### 4. Agregar Item al Carrito

**Endpoint:** `POST /api/cart/items`

**Descripción:** Agregar producto al carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Validaciones:**
- `product_id` - Requerido, producto debe existir
- `quantity` - Requerido, mayor a 0, no debe exceder stock

**Response (200/201):**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": 1,
    "product_id": 1,
    "quantity": 2,
    "unit_price": 650.00,
    "total_price": 1300.00,
    "cart_totals": {
      "total_items": 2,
      "subtotal": 1300.00
    }
  },
  "statusCode": 201
}
```

**Errores posibles:**
- `400` - Stock insuficiente
- `404` - Producto no encontrado
- `422` - Validación fallida

---

### 5. Actualizar Cantidad de Item

**Endpoint:** `PUT /api/cart/items/:id`

**Descripción:** Cambiar cantidad de item en carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "quantity": 3,
    "total_price": 1950.00,
    "cart_totals": {
      "total_items": 3,
      "subtotal": 1950.00
    }
  },
  "statusCode": 200
}
```

---

### 6. Eliminar Item del Carrito

**Endpoint:** `DELETE /api/cart/items/:id`

**Descripción:** Eliminar producto del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "cart_totals": {
      "total_items": 1,
      "subtotal": 420.00
    }
  },
  "statusCode": 200
}
```

---

### 7. Limpiar Carrito Completo

**Endpoint:** `DELETE /api/cart`

**Descripción:** Eliminar todos los items del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "statusCode": 200
}
```

---

## 📦 Endpoints de Órdenes

### 1. Obtener Mis Órdenes

**Endpoint:** `GET /api/orders/my-orders`

**Descripción:** Obtener órdenes del usuario autenticado

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1          (default: 1)
limit=20        (default: 20)
status=PENDING  (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
sort_by=created_at
sort_order=DESC
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-001-2025",
        "subtotal": 1300.00,
        "tax": 0.00,
        "shipping_cost": 10.00,
        "total": 1310.00,
        "status": "PENDING",
        "items_count": 2,
        "created_at": "2025-01-18T17:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Orden por Número

**Endpoint:** `GET /api/orders/number/:order_number`

**Descripción:** Obtener orden por número

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-001-2025",
    "subtotal": 1300.00,
    "tax": 0.00,
    "shipping_cost": 10.00,
    "total": 1310.00,
    "status": "PENDING",
    "shipping_address": "Calle Principal 123",
    "notes": "Entregar entre 9-17",
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Sofá 3 Puestos",
          "price": 650.00
        },
        "quantity": 1,
        "unit_price": 650.00,
        "total_price": 650.00
      }
    ],
    "payment": {
      "id": 1,
      "status": "PENDING",
      "amount": 1310.00
    },
    "created_at": "2025-01-18T17:00:00Z"
  },
  "statusCode": 200
}
```

---

### 3. Obtener Orden por ID

**Endpoint:** `GET /api/orders/:id`

**Descripción:** Obtener orden por ID

**Permisos:** Autenticado

**Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 4. Crear Orden

**Endpoint:** `POST /api/orders`

**Descripción:** Crear orden a partir del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "shipping_address": "Calle Principal 123, Apartamento 4B",
  "notes": "Entregar entre las 9-17",
  "tax": 15.50,
  "shipping_cost": 10.00
}
```

**Validaciones:**
- Carrito debe tener items
- Stock debe estar disponible
- `shipping_address` - Requerido

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-001-2025",
    "subtotal": 1300.00,
    "tax": 15.50,
    "shipping_cost": 10.00,
    "total": 1325.50,
    "status": "PENDING",
    "items": [...],
    "created_at": "2025-01-18T17:30:00Z"
  },
  "statusCode": 201
}
```

**Errores posibles:**
- `400` - Carrito vacío
- `400` - Stock insuficiente
- `422` - Validación fallida

---

### 5. Cancelar Orden

**Endpoint:** `PATCH /api/orders/:id/cancel`

**Descripción:** Cancelar una orden

**Permisos:** Autenticado (propietario de la orden o Admin)

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "reason": "Cambié de opinión"
}
```

**Restricciones:**
- Solo órdenes en estado PENDING o CONFIRMED pueden cancelarse

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "id": 1,
    "status": "CANCELLED",
    "reason": "Cambié de opinión"
  },
  "statusCode": 200
}
```

---

### 6. Obtener Todas las Órdenes (Admin)

**Endpoint:** `GET /api/orders/admin/all`

**Descripción:** Obtener todas las órdenes del sistema

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1
limit=20
status=PENDING
user_id=1
sort_by=created_at
sort_order=DESC
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-001-2025",
        "user": {
          "id": 1,
          "name": "Admin User",
          "email": "admin@madecorec.com"
        },
        "total": 1325.50,
        "status": "PENDING",
        "created_at": "2025-01-18T17:30:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 7. Estadísticas de Órdenes (Admin)

**Endpoint:** `GET /api/orders/admin/stats`

**Descripción:** Obtener estadísticas de órdenes

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order statistics retrieved",
  "data": {
    "total_orders": 50,
    "pending_orders": 10,
    "completed_orders": 38,
    "cancelled_orders": 2,
    "total_revenue": 45750.00,
    "average_order_value": 915.00,
    "orders_today": 3,
    "orders_this_week": 15,
    "orders_this_month": 50
  },
  "statusCode": 200
}
```

---

### 8. Actualizar Estado de Orden (Admin)

**Endpoint:** `PATCH /api/orders/admin/:id/status`

**Descripción:** Cambiar estado de orden

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "status": "SHIPPED",
  "notes": "Enviado por DHL - Tracking: DHL123456"
}
```

**Estados válidos:**
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "status": "SHIPPED",
    "notes": "Enviado por DHL - Tracking: DHL123456",
    "updated_at": "2025-01-18T18:00:00Z"
  },
  "statusCode": 200
}
```

---

## 💳 Endpoints de Pagos

### 1. Crear Pago

**Endpoint:** `POST /api/payments`

**Descripción:** Crear pago para una orden

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "order_id": 1,
  "return_url": "http://localhost:3000/payment-success",
  "cancel_url": "http://localhost:3000/payment-cancel"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 1325.50,
    "currency": "USD",
    "status": "PENDING",
    "payment_url": "https://pay.payphoneapp.com/...",
    "created_at": "2025-01-18T18:00:00Z"
  },
  "statusCode": 201
}
```

---

### 2. Obtener Pago por ID

**Endpoint:** `GET /api/payments/:id`

**Descripción:** Obtener información de pago

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": {
    "id": 1,
    "order_id": 1,
    "transaction_id": "TXN-123456",
    "amount": 1325.50,
    "currency": "USD",
    "status": "PENDING",
    "payment_method": null,
    "reference": null,
    "created_at": "2025-01-18T18:00:00Z"
  },
  "statusCode": 200
}
```

---

### 3. Obtener Pago por Orden

**Endpoint:** `GET /api/payments/order/:order_id`

**Descripción:** Obtener pago asociado a una orden

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 4. Obtener Estado de Pago

**Endpoint:** `GET /api/payments/status/:transaction_id`

**Descripción:** Consultar estado de transacción

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment status retrieved",
  "data": {
    "transaction_id": "TXN-123456",
    "status": "COMPLETED",
    "amount": 1325.50,
    "paid_at": "2025-01-18T18:15:00Z"
  },
  "statusCode": 200
}
```

---

### 5. Reintentar Pago

**Endpoint:** `POST /api/payments/retry/:payment_id`

**Descripción:** Reintentar pago fallido

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "return_url": "http://localhost:3000/payment-success",
  "cancel_url": "http://localhost:3000/payment-cancel"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment retry created successfully",
  "data": {
    "id": 1,
    "status": "PENDING",
    "payment_url": "https://pay.payphoneapp.com/..."
  },
  "statusCode": 200
}
```

---

### 6. Obtener Todos los Pagos (Admin)

**Endpoint:** `GET /api/payments/admin/all`

**Descripción:** Obtener todos los pagos

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1
limit=20
status=COMPLETED
sort_by=created_at
sort_order=DESC
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "data": {
    "payments": [
      {
        "id": 1,
        "order": {
          "id": 1,
          "order_number": "ORD-001-2025"
        },
        "amount": 1325.50,
        "status": "COMPLETED",
        "transaction_id": "TXN-123456",
        "paid_at": "2025-01-18T18:15:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "statusCode": 200
}
```

---

### 7. Estadísticas de Pagos (Admin)

**Endpoint:** `GET /api/payments/admin/stats`

**Descripción:** Obtener estadísticas de pagos

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment statistics retrieved",
  "data": {
    "total_payments": 25,
    "completed_payments": 23,
    "pending_payments": 1,
    "failed_payments": 1,
    "total_amount": 45750.00,
    "average_payment": 1830.00,
    "payments_today": 5,
    "payments_this_week": 20,
    "payments_this_month": 25
  },
  "statusCode": 200
}
```

---

### 8. Webhook PayPhone

**Endpoint:** `POST /api/payments/webhook/payphone`

**Descripción:** Recibir notificación de PayPhone

**Permisos:** Público (validado por PayPhone)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "transaction_id": "TXN-123456",
  "order_id": "1",
  "amount": 1325.50,
  "currency": "USD",
  "status": "COMPLETED",
  "reference": "REF-PAY-001",
  "paid_at": "2025-01-18T18:15:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "statusCode": 200
}
```

---

## ✅ Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|------------|-------------|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Sin contenido |
| **400** | Bad Request | Solicitud inválida |
| **401** | Unauthorized | No autenticado |
| **403** | Forbidden | No autorizado |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email duplicado) |
| **422** | Unprocessable Entity | Validación fallida |
| **429** | Too Many Requests | Demasiadas solicitudes |
| **500** | Internal Server Error | Error interno del servidor |
| **503** | Service Unavailable | Servicio no disponible |

---

## ⚠️ Manejo de Errores

### Formato de Error Estándar

```json
{
  "success": false,
  "message": "Error general",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "statusCode": 400
}
```

### Errores Comunes

#### Email Duplicado
```json
{
  "success": false,
  "message": "Email already exists",
  "error": {
    "code": "EMAIL_EXISTS"
  },
  "statusCode": 409
}
```

#### Contraseña Débil
```json
{
  "success": false,
  "message": "Password is too weak",
  "error": {
    "code": "WEAK_PASSWORD",
    "details": "Password must contain uppercase, lowercase, numbers and be at least 8 characters"
  },
  "statusCode": 400
}
```

#### Token Inválido
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": {
    "code": "INVALID_TOKEN"
  },
  "statusCode": 401
}
```

#### Validación Fallida
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "price",
        "message": "Price must be greater than 0"
      }
    ]
  },
  "statusCode": 422
}
```

---

## 🔗 Ejemplos de Uso

### Ejemplo 1: Registro y Login

**1. Registrar usuario:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**2. Hacer login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**3. Guardar token:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Ejemplo 2: Agregar Producto al Carrito y Crear Orden

**1. Ver carrito:**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer {token}"
```

**2. Agregar producto:**
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

**3. Crear orden:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "Calle Principal 123",
    "tax": 15.50,
    "shipping_cost": 10.00
  }'
```

**4. Crear pago:**
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "return_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel"
  }'
```

---

### Ejemplo 3: Operaciones de Admin

**1. Crear categoría:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Baño",
    "description": "Muebles para baño",
    "sort_order": 6
  }'
```

**2. Crear producto:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Espejo Decorativo",
    "description": "Espejo de baño",
    "sku": "ESP-DEC-001",
    "price": 85.00,
    "stock_quantity": 20,
    "category_id": 6
  }'
```

**3. Ver todas las órdenes:**
```bash
curl -X GET "http://localhost:5000/api/orders/admin/all?status=PENDING" \
  -H "Authorization: Bearer {admin_token}"
```

---

## 📝 Notas Importantes

1. **Token JWT:**
   - El token expira en 7 días
   - Incluir en header: `Authorization: Bearer {token}`
   - Si expira, usar `/api/auth/refresh-token`

2. **Validaciones:**
   - Email debe ser único
   - Contraseña mínimo 8 caracteres con mayúscula y número
   - SKU debe ser único
   - Precios deben ser mayores a 0

3. **Paginación:**
   - Por defecto página 1, 20 items
   - Máximo 100 items por página
   - Retorna `pagination` con total, página, límite, páginas

4. **Stock:**
   - Validado al agregar al carrito
   - No permite cantidades mayores al stock
   - Se actualiza al crear orden

5. **Órdenes:**
   - Pasa por estados: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
   - Se puede cancelar en estado PENDING o CONFIRMED
   - Libera stock al cancelar

6. **Pagos:**
   - Se integ// filepath: API_DOCUMENTATION.md
# 📚 MadeCorec E-commerce API - Documentación Completa

**Versión:** 1.0.0  
**Base URL:** `http://localhost:5000/api`  
**Ambiente:** Desarrollo  
**Última actualización:** 18 de Octubre de 2025

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Endpoints de Autenticación](#endpoints-de-autenticación)
4. [Endpoints de Usuarios](#endpoints-de-usuarios)
5. [Endpoints de Categorías](#endpoints-de-categorías)
6. [Endpoints de Productos](#endpoints-de-productos)
7. [Endpoints de Carrito](#endpoints-de-carrito)
8. [Endpoints de Órdenes](#endpoints-de-órdenes)
9. [Endpoints de Pagos](#endpoints-de-pagos)
10. [Códigos de Estado HTTP](#códigos-de-estado-http)
11. [Manejo de Errores](#manejo-de-errores)
12. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 Introducción

### Base URL
```
http://localhost:5000/api
```

### Headers Requeridos
```
Content-Type: application/json
```

### Respuesta Estándar (Success)
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... },
  "statusCode": 200
}
```

### Respuesta Estándar (Error)
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detalles adicionales"
  },
  "statusCode": 400
}
```

---

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación.

### Obtener Token
1. Hacer login en `/api/auth/login`
2. Guardar el token retornado
3. Incluir en header `Authorization: Bearer {token}`

### Validez del Token
- **Duración:** 7 días
- **Tipo:** JWT (HS256)
- **Ubicación:** Header Authorization

### Renovar Token
```
POST /api/auth/refresh-token
Authorization: Bearer {token}
```

### Roles
- **USER** - Usuario normal
- **ADMIN** - Administrador del sistema

---

## 📤 Endpoints de Autenticación

### 1. Registrar Usuario

**Endpoint:** `POST /api/auth/register`

**Descripción:** Crear una nueva cuenta de usuario

**Permisos:** Público (sin autenticación)

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Validaciones:**
- `first_name` - Requerido, máximo 100 caracteres
- `last_name` - Requerido, máximo 100 caracteres
- `email` - Requerido, formato válido, único
- `password` - Requerido, mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 2,
    "email": "juan@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "role": "USER",
    "created_at": "2025-01-18T10:30:00Z"
  },
  "statusCode": 201
}
```

**Errores posibles:**
- `400` - Email ya existe
- `400` - Contraseña débil
- `422` - Validación fallida

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Descripción:** Autenticar usuario y obtener token

**Permisos:** Público

**Body:**
```json
{
  "email": "admin@madecorec.com",
  "password": "Admin123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@madecorec.com",
      "first_name": "Admin",
      "last_name": "MadeCorec",
      "role": "ADMIN",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": "7d"
  },
  "statusCode": 200
}
```

**Errores posibles:**
- `401` - Email o contraseña incorrectos
- `404` - Usuario no encontrado
- `403` - Cuenta desactivada

**Credenciales de Prueba:**
- Email: `admin@madecorec.com`
- Password: `Admin123!`

---

### 3. Obtener Perfil

**Endpoint:** `GET /api/auth/profile`

**Descripción:** Obtener información del usuario autenticado

**Permisos:** Autenticado (USER, ADMIN)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "admin@madecorec.com",
    "first_name": "Admin",
    "last_name": "MadeCorec",
    "phone": "+593999999999",
    "address": "Dirección Admin",
    "city": "Quito",
    "country": "Ecuador",
    "role": "ADMIN",
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-01-18T10:00:00Z",
    "last_login": "2025-01-18T15:30:00Z"
  },
  "statusCode": 200
}
```

---

### 4. Actualizar Perfil

**Endpoint:** `PUT /api/auth/profile`

**Descripción:** Actualizar información del usuario

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "phone": "+593987654321",
  "address": "Calle Principal 123",
  "city": "Quito",
  "country": "Ecuador"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+593987654321",
    "updated_at": "2025-01-18T15:45:00Z"
  },
  "statusCode": 200
}
```

---

### 5. Cambiar Contraseña

**Endpoint:** `POST /api/auth/change-password`

**Descripción:** Cambiar contraseña del usuario

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "current_password": "Admin123!",
  "new_password": "NuevaPassword123!",
  "confirm_password": "NuevaPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "statusCode": 200
}
```

**Errores posibles:**
- `400` - Contraseña actual incorrecta
- `400` - Contraseñas no coinciden
- `400` - Contraseña débil

---

### 6. Recuperar Contraseña

**Endpoint:** `POST /api/auth/forgot-password`

**Descripción:** Enviar enlace para recuperar contraseña

**Permisos:** Público

**Body:**
```json
{
  "email": "admin@madecorec.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reset password link sent to email",
  "statusCode": 200
}
```

---

### 7. Resetear Contraseña

**Endpoint:** `POST /api/auth/reset-password`

**Descripción:** Establecer nueva contraseña con token

**Permisos:** Público

**Body:**
```json
{
  "token": "token-enviado-por-email",
  "new_password": "NuevaPassword123!",
  "confirm_password": "NuevaPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "statusCode": 200
}
```

---

### 8. Refresh Token

**Endpoint:** `POST /api/auth/refresh-token`

**Descripción:** Obtener nuevo token

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "nuevo-jwt-token",
    "expires_in": "7d"
  },
  "statusCode": 200
}
```

---

### 9. Logout

**Endpoint:** `POST /api/auth/logout`

**Descripción:** Cerrar sesión (invalida el token)

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "statusCode": 200
}
```

---

## 👥 Endpoints de Usuarios

### 1. Obtener Todos los Usuarios

**Endpoint:** `GET /api/users`

**Descripción:** Obtener lista de todos los usuarios

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1              (default: 1)
limit=20            (default: 20, max: 100)
search=juan         (buscar en nombre o email)
role=USER           (USER o ADMIN)
is_active=true      (true o false)
sort_by=created_at  (created_at, email, first_name)
sort_order=DESC     (ASC o DESC)
```

**Ejemplo completo:**
```
GET /api/users?page=1&limit=20&search=juan&role=USER&is_active=true
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 2,
        "email": "juan@ejemplo.com",
        "first_name": "Juan",
        "last_name": "Pérez",
        "phone": "+593999999999",
        "role": "USER",
        "is_active": true,
        "created_at": "2025-01-18T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Usuario por ID

**Endpoint:** `GET /api/users/:id`

**Descripción:** Obtener información de un usuario específico

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Parámetros:**
- `id` - ID del usuario

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 2,
    "email": "juan@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+593999999999",
    "address": "Calle Principal 123",
    "city": "Quito",
    "country": "Ecuador",
    "role": "USER",
    "is_active": true,
    "email_verified": true,
    "last_login": "2025-01-18T15:30:00Z",
    "created_at": "2025-01-18T10:30:00Z",
    "updated_at": "2025-01-18T10:30:00Z"
  },
  "statusCode": 200
}
```

---

### 3. Estadísticas de Usuarios

**Endpoint:** `GET /api/users/stats`

**Descripción:** Obtener estadísticas de usuarios

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User statistics retrieved",
  "data": {
    "total_users": 50,
    "active_users": 45,
    "inactive_users": 5,
    "admin_users": 2,
    "regular_users": 48,
    "new_users_today": 3,
    "new_users_this_week": 15,
    "new_users_this_month": 50
  },
  "statusCode": 200
}
```

---

### 4. Crear Usuario

**Endpoint:** `POST /api/users`

**Descripción:** Crear un nuevo usuario (Admin)

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "first_name": "Carlos",
  "last_name": "López",
  "email": "carlos@ejemplo.com",
  "password": "Password123!",
  "phone": "+593999999999",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 3,
    "email": "carlos@ejemplo.com",
    "first_name": "Carlos",
    "last_name": "López",
    "phone": "+593999999999",
    "role": "USER",
    "is_active": true,
    "created_at": "2025-01-18T16:00:00Z"
  },
  "statusCode": 201
}
```

---

### 5. Actualizar Usuario

**Endpoint:** `PUT /api/users/:id`

**Descripción:** Actualizar información de usuario

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "first_name": "Carlos",
  "last_name": "López",
  "phone": "+593987654321",
  "address": "Nuevo Domicilio",
  "city": "Guayaquil",
  "role": "ADMIN",
  "is_active": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 3,
    "first_name": "Carlos",
    "last_name": "López",
    "updated_at": "2025-01-18T16:15:00Z"
  },
  "statusCode": 200
}
```

---

### 6. Cambiar Estado de Usuario

**Endpoint:** `PATCH /api/users/:id/toggle-status`

**Descripción:** Activar/Desactivar usuario

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "id": 3,
    "is_active": false,
    "updated_at": "2025-01-18T16:20:00Z"
  },
  "statusCode": 200
}
```

---

### 7. Eliminar Usuario

**Endpoint:** `DELETE /api/users/:id`

**Descripción:** Eliminar usuario del sistema

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "statusCode": 200
}
```

---

## 🏷️ Endpoints de Categorías

### 1. Obtener Todas las Categorías

**Endpoint:** `GET /api/categories`

**Descripción:** Obtener lista de categorías

**Permisos:** Público

**Query Parameters:**
```
page=1                (default: 1)
limit=20              (default: 20)
search=sala           (buscar por nombre)
is_active=true        (true o false)
sort_by=sort_order    (name, sort_order, created_at)
sort_order=ASC        (ASC o DESC)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Sala",
        "slug": "sala",
        "description": "Muebles para sala de estar",
        "image_url": null,
        "is_active": true,
        "sort_order": 1,
        "products_count": 5,
        "created_at": "2025-01-18T10:00:00Z",
        "updated_at": "2025-01-18T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Categorías Activas

**Endpoint:** `GET /api/categories/active`

**Descripción:** Obtener solo categorías activas

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Active categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Sala",
      "slug": "sala",
      "description": "Muebles para sala de estar",
      "is_active": true,
      "sort_order": 1
    }
  ],
  "statusCode": 200
}
```

---

### 3. Obtener Categoría por ID

**Endpoint:** `GET /api/categories/:id`

**Descripción:** Obtener una categoría específica

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sala",
    "slug": "sala",
    "description": "Muebles para sala de estar",
    "image_url": null,
    "is_active": true,
    "sort_order": 1,
    "products": [
      {
        "id": 1,
        "name": "Sofá 3 Puestos",
        "price": 650.00
      }
    ]
  },
  "statusCode": 200
}
```

---

### 4. Obtener Categoría por Slug

**Endpoint:** `GET /api/categories/slug/:slug`

**Descripción:** Obtener categoría por slug

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sala",
    "slug": "sala",
    "products": [...]
  },
  "statusCode": 200
}
```

---

### 5. Crear Categoría

**Endpoint:** `POST /api/categories`

**Descripción:** Crear nueva categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Baño",
  "description": "Accesorios y muebles para baño",
  "image_url": "https://ejemplo.com/baño.jpg",
  "is_active": true,
  "sort_order": 6
}
```

**Validaciones:**
- `name` - Requerido, máximo 100 caracteres, único
- `description` - Opcional, máximo 1000 caracteres
- `sort_order` - Opcional, número entero

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 6,
    "name": "Baño",
    "slug": "baño",
    "description": "Accesorios y muebles para baño",
    "is_active": true,
    "sort_order": 6,
    "created_at": "2025-01-18T16:30:00Z"
  },
  "statusCode": 201
}
```

---

### 6. Actualizar Categoría

**Endpoint:** `PUT /api/categories/:id`

**Descripción:** Actualizar información de categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Sala de Estar",
  "description": "Muebles modernos para sala",
  "sort_order": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Sala de Estar",
    "slug": "sala-de-estar",
    "updated_at": "2025-01-18T16:45:00Z"
  },
  "statusCode": 200
}
```

---

### 7. Cambiar Estado de Categoría

**Endpoint:** `PATCH /api/categories/:id/toggle-status`

**Descripción:** Activar/Desactivar categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category status updated successfully",
  "data": {
    "id": 1,
    "is_active": false
  },
  "statusCode": 200
}
```

---

### 8. Eliminar Categoría

**Endpoint:** `DELETE /api/categories/:id`

**Descripción:** Eliminar categoría

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Restricciones:**
- No se puede eliminar si tiene productos asociados

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "statusCode": 200
}
```

---

## 🛍️ Endpoints de Productos

### 1. Obtener Todos los Productos

**Endpoint:** `GET /api/products`

**Descripción:** Obtener lista de productos con filtros

**Permisos:** Público

**Query Parameters:**
```
page=1              (default: 1)
limit=20            (default: 20)
category_id=1       (filtrar por categoría)
search=sofa         (buscar por nombre)
min_price=0         (precio mínimo)
max_price=1000      (precio máximo)
is_featured=true    (solo destacados)
status=ACTIVE       (ACTIVE, INACTIVE, DISCONTINUED)
sort_by=price       (name, price, created_at)
sort_order=ASC      (ASC o DESC)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Sofá 3 Puestos Moderno",
        "slug": "sofa-3-puestos-moderno",
        "description": "Elegante sofá de 3 puestos",
        "price": 650.00,
        "compare_price": 750.00,
        "stock_quantity": 15,
        "category": {
          "id": 1,
          "name": "Sala"
        },
        "is_featured": true,
        "status": "ACTIVE",
        "images": ["url1", "url2"],
        "created_at": "2025-01-18T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Productos Destacados

**Endpoint:** `GET /api/products/featured`

**Descripción:** Obtener solo productos destacados

**Permisos:** Público

**Query Parameters:**
```
limit=8  (cantidad de productos)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Featured products retrieved successfully",
  "data": {
    "products": [...]
  },
  "statusCode": 200
}
```

---

### 3. Buscar Productos

**Endpoint:** `GET /api/products/search`

**Descripción:** Buscar productos

**Permisos:** Público

**Query Parameters:**
```
search=sofa         (término de búsqueda)
category_id=1       (filtro de categoría)
page=1              (página)
limit=20            (items por página)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Products found",
  "data": {
    "products": [...]
  },
  "statusCode": 200
}
```

---

### 4. Obtener Producto por ID

**Endpoint:** `GET /api/products/:id`

**Descripción:** Obtener información detallada de un producto

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Sofá 3 Puestos Moderno",
    "slug": "sofa-3-puestos-moderno",
    "description": "Elegante sofá de 3 puestos tapizado en tela de alta calidad",
    "short_description": "Sofá moderno y cómodo para sala",
    "sku": "SOFA-3P-MOD-001",
    "price": 650.00,
    "compare_price": 750.00,
    "cost_price": 400.00,
    "stock_quantity": 15,
    "min_stock_level": 3,
    "weight": 45.50,
    "dimensions": "200x80x85 cm",
    "images": ["url1", "url2"],
    "category": {
      "id": 1,
      "name": "Sala",
      "slug": "sala"
    },
    "status": "ACTIVE",
    "is_featured": true,
    "meta_title": "Sofá 3 Puestos Moderno",
    "meta_description": "Sofá moderno de 3 puestos",
    "rating": 4.5,
    "reviews_count": 12,
    "created_at": "2025-01-18T10:00:00Z"
  },
  "statusCode": 200
}
```

---

### 5. Obtener Producto por Slug

**Endpoint:** `GET /api/products/slug/:slug`

**Descripción:** Obtener producto por slug amigable

**Permisos:** Público

**Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 6. Estadísticas de Productos

**Endpoint:** `GET /api/products/admin/stats`

**Descripción:** Obtener estadísticas de productos

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product statistics retrieved",
  "data": {
    "total_products": 25,
    "active_products": 23,
    "inactive_products": 2,
    "total_stock": 500,
    "low_stock_products": 5,
    "featured_products": 8,
    "average_price": 450.00,
    "total_value": 11250.00
  },
  "statusCode": 200
}
```

---

### 7. Crear Producto

**Endpoint:** `POST /api/products`

**Descripción:** Crear nuevo producto

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Silla Ejecutiva Premium",
  "description": "Silla ergonómica con ruedas y respaldo alto",
  "short_description": "Silla ejecutiva cómoda",
  "sku": "SILLA-EXEC-PREM-001",
  "price": 250.00,
  "compare_price": 300.00,
  "cost_price": 150.00,
  "stock_quantity": 20,
  "min_stock_level": 5,
  "weight": 15.5,
  "dimensions": "65x65x105 cm",
  "category_id": 4,
  "is_featured": false,
  "meta_title": "Silla Ejecutiva Premium",
  "meta_description": "Silla ergonómica de alta calidad"
}
```

**Validaciones:**
- `name` - Requerido, máximo 200 caracteres
- `sku` - Requerido, único, 3-50 caracteres
- `price` - Requerido, número positivo
- `category_id` - Requerido, categoría debe existir
- `stock_quantity` - Requerido, número entero

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 6,
    "name": "Silla Ejecutiva Premium",
    "slug": "silla-ejecutiva-premium",
    "price": 250.00,
    "sku": "SILLA-EXEC-PREM-001",
    "created_at": "2025-01-18T17:00:00Z"
  },
  "statusCode": 201
}
```

---

### 8. Actualizar Producto

**Endpoint:** `PUT /api/products/:id`

**Descripción:** Actualizar información de producto

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Sofá 3 Puestos Premium",
  "price": 700.00,
  "stock_quantity": 10,
  "is_featured": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Sofá 3 Puestos Premium",
    "updated_at": "2025-01-18T17:15:00Z"
  },
  "statusCode": 200
}
```

---

### 9. Actualizar Stock

**Endpoint:** `PATCH /api/products/:id/stock`

**Descripción:** Actualizar cantidad en stock

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "quantity": 25
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product stock updated successfully",
  "data": {
    "id": 1,
    "stock_quantity": 25,
    "updated_at": "2025-01-18T17:20:00Z"
  },
  "statusCode": 200
}
```

---

### 10. Eliminar Producto

**Endpoint:** `DELETE /api/products/:id`

**Descripción:** Eliminar producto

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "statusCode": 200
}
```

---

## 🛒 Endpoints de Carrito

### 1. Obtener Carrito

**Endpoint:** `GET /api/cart`

**Descripción:** Obtener carrito del usuario autenticado

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "total_items": 2,
    "subtotal": 1300.00,
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Sofá 3 Puestos",
          "price": 650.00
        },
        "quantity": 1,
        "unit_price": 650.00,
        "total_price": 650.00
      },
      {
        "id": 2,
        "product": {
          "id": 2,
          "name": "Mesa de Comedor",
          "price": 420.00
        },
        "quantity": 1,
        "unit_price": 420.00,
        "total_price": 420.00
      }
    ],
    "created_at": "2025-01-18T10:00:00Z",
    "updated_at": "2025-01-18T17:30:00Z"
  },
  "statusCode": 200
}
```

---

### 2. Obtener Cantidad de Items

**Endpoint:** `GET /api/cart/count`

**Descripción:** Obtener número de items en carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart count retrieved",
  "data": {
    "count": 2
  },
  "statusCode": 200
}
```

---

### 3. Validar Carrito

**Endpoint:** `GET /api/cart/validate`

**Descripción:** Validar stock y precios del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart validated successfully",
  "data": {
    "valid": true,
    "errors": [],
    "subtotal": 1300.00
  },
  "statusCode": 200
}
```

---

### 4. Agregar Item al Carrito

**Endpoint:** `POST /api/cart/items`

**Descripción:** Agregar producto al carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Validaciones:**
- `product_id` - Requerido, producto debe existir
- `quantity` - Requerido, mayor a 0, no debe exceder stock

**Response (200/201):**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "id": 1,
    "product_id": 1,
    "quantity": 2,
    "unit_price": 650.00,
    "total_price": 1300.00,
    "cart_totals": {
      "total_items": 2,
      "subtotal": 1300.00
    }
  },
  "statusCode": 201
}
```

**Errores posibles:**
- `400` - Stock insuficiente
- `404` - Producto no encontrado
- `422` - Validación fallida

---

### 5. Actualizar Cantidad de Item

**Endpoint:** `PUT /api/cart/items/:id`

**Descripción:** Cambiar cantidad de item en carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "quantity": 3,
    "total_price": 1950.00,
    "cart_totals": {
      "total_items": 3,
      "subtotal": 1950.00
    }
  },
  "statusCode": 200
}
```

---

### 6. Eliminar Item del Carrito

**Endpoint:** `DELETE /api/cart/items/:id`

**Descripción:** Eliminar producto del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "cart_totals": {
      "total_items": 1,
      "subtotal": 420.00
    }
  },
  "statusCode": 200
}
```

---

### 7. Limpiar Carrito Completo

**Endpoint:** `DELETE /api/cart`

**Descripción:** Eliminar todos los items del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "statusCode": 200
}
```

---

## 📦 Endpoints de Órdenes

### 1. Obtener Mis Órdenes

**Endpoint:** `GET /api/orders/my-orders`

**Descripción:** Obtener órdenes del usuario autenticado

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1          (default: 1)
limit=20        (default: 20)
status=PENDING  (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
sort_by=created_at
sort_order=DESC
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-001-2025",
        "subtotal": 1300.00,
        "tax": 0.00,
        "shipping_cost": 10.00,
        "total": 1310.00,
        "status": "PENDING",
        "items_count": 2,
        "created_at": "2025-01-18T17:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 2. Obtener Orden por Número

**Endpoint:** `GET /api/orders/number/:order_number`

**Descripción:** Obtener orden por número

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-001-2025",
    "subtotal": 1300.00,
    "tax": 0.00,
    "shipping_cost": 10.00,
    "total": 1310.00,
    "status": "PENDING",
    "shipping_address": "Calle Principal 123",
    "notes": "Entregar entre 9-17",
    "items": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Sofá 3 Puestos",
          "price": 650.00
        },
        "quantity": 1,
        "unit_price": 650.00,
        "total_price": 650.00
      }
    ],
    "payment": {
      "id": 1,
      "status": "PENDING",
      "amount": 1310.00
    },
    "created_at": "2025-01-18T17:00:00Z"
  },
  "statusCode": 200
}
```

---

### 3. Obtener Orden por ID

**Endpoint:** `GET /api/orders/:id`

**Descripción:** Obtener orden por ID

**Permisos:** Autenticado

**Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 4. Crear Orden

**Endpoint:** `POST /api/orders`

**Descripción:** Crear orden a partir del carrito

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "shipping_address": "Calle Principal 123, Apartamento 4B",
  "notes": "Entregar entre las 9-17",
  "tax": 15.50,
  "shipping_cost": 10.00
}
```

**Validaciones:**
- Carrito debe tener items
- Stock debe estar disponible
- `shipping_address` - Requerido

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-001-2025",
    "subtotal": 1300.00,
    "tax": 15.50,
    "shipping_cost": 10.00,
    "total": 1325.50,
    "status": "PENDING",
    "items": [...],
    "created_at": "2025-01-18T17:30:00Z"
  },
  "statusCode": 201
}
```

**Errores posibles:**
- `400` - Carrito vacío
- `400` - Stock insuficiente
- `422` - Validación fallida

---

### 5. Cancelar Orden

**Endpoint:** `PATCH /api/orders/:id/cancel`

**Descripción:** Cancelar una orden

**Permisos:** Autenticado (propietario de la orden o Admin)

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "reason": "Cambié de opinión"
}
```

**Restricciones:**
- Solo órdenes en estado PENDING o CONFIRMED pueden cancelarse

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "id": 1,
    "status": "CANCELLED",
    "reason": "Cambié de opinión"
  },
  "statusCode": 200
}
```

---

### 6. Obtener Todas las Órdenes (Admin)

**Endpoint:** `GET /api/orders/admin/all`

**Descripción:** Obtener todas las órdenes del sistema

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1
limit=20
status=PENDING
user_id=1
sort_by=created_at
sort_order=DESC
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1,
        "order_number": "ORD-001-2025",
        "user": {
          "id": 1,
          "name": "Admin User",
          "email": "admin@madecorec.com"
        },
        "total": 1325.50,
        "status": "PENDING",
        "created_at": "2025-01-18T17:30:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "statusCode": 200
}
```

---

### 7. Estadísticas de Órdenes (Admin)

**Endpoint:** `GET /api/orders/admin/stats`

**Descripción:** Obtener estadísticas de órdenes

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order statistics retrieved",
  "data": {
    "total_orders": 50,
    "pending_orders": 10,
    "completed_orders": 38,
    "cancelled_orders": 2,
    "total_revenue": 45750.00,
    "average_order_value": 915.00,
    "orders_today": 3,
    "orders_this_week": 15,
    "orders_this_month": 50
  },
  "statusCode": 200
}
```

---

### 8. Actualizar Estado de Orden (Admin)

**Endpoint:** `PATCH /api/orders/admin/:id/status`

**Descripción:** Cambiar estado de orden

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "status": "SHIPPED",
  "notes": "Enviado por DHL - Tracking: DHL123456"
}
```

**Estados válidos:**
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "status": "SHIPPED",
    "notes": "Enviado por DHL - Tracking: DHL123456",
    "updated_at": "2025-01-18T18:00:00Z"
  },
  "statusCode": 200
}
```

---

## 💳 Endpoints de Pagos

### 1. Crear Pago

**Endpoint:** `POST /api/payments`

**Descripción:** Crear pago para una orden

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "order_id": 1,
  "return_url": "http://localhost:3000/payment-success",
  "cancel_url": "http://localhost:3000/payment-cancel"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 1325.50,
    "currency": "USD",
    "status": "PENDING",
    "payment_url": "https://pay.payphoneapp.com/...",
    "created_at": "2025-01-18T18:00:00Z"
  },
  "statusCode": 201
}
```

---

### 2. Obtener Pago por ID

**Endpoint:** `GET /api/payments/:id`

**Descripción:** Obtener información de pago

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": {
    "id": 1,
    "order_id": 1,
    "transaction_id": "TXN-123456",
    "amount": 1325.50,
    "currency": "USD",
    "status": "PENDING",
    "payment_method": null,
    "reference": null,
    "created_at": "2025-01-18T18:00:00Z"
  },
  "statusCode": 200
}
```

---

### 3. Obtener Pago por Orden

**Endpoint:** `GET /api/payments/order/:order_id`

**Descripción:** Obtener pago asociado a una orden

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment retrieved successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 4. Obtener Estado de Pago

**Endpoint:** `GET /api/payments/status/:transaction_id`

**Descripción:** Consultar estado de transacción

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment status retrieved",
  "data": {
    "transaction_id": "TXN-123456",
    "status": "COMPLETED",
    "amount": 1325.50,
    "paid_at": "2025-01-18T18:15:00Z"
  },
  "statusCode": 200
}
```

---

### 5. Reintentar Pago

**Endpoint:** `POST /api/payments/retry/:payment_id`

**Descripción:** Reintentar pago fallido

**Permisos:** Autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "return_url": "http://localhost:3000/payment-success",
  "cancel_url": "http://localhost:3000/payment-cancel"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment retry created successfully",
  "data": {
    "id": 1,
    "status": "PENDING",
    "payment_url": "https://pay.payphoneapp.com/..."
  },
  "statusCode": 200
}
```

---

### 6. Obtener Todos los Pagos (Admin)

**Endpoint:** `GET /api/payments/admin/all`

**Descripción:** Obtener todos los pagos

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
page=1
limit=20
status=COMPLETED
sort_by=created_at
sort_order=DESC
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payments retrieved successfully",
  "data": {
    "payments": [
      {
        "id": 1,
        "order": {
          "id": 1,
          "order_number": "ORD-001-2025"
        },
        "amount": 1325.50,
        "status": "COMPLETED",
        "transaction_id": "TXN-123456",
        "paid_at": "2025-01-18T18:15:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "statusCode": 200
}
```

---

### 7. Estadísticas de Pagos (Admin)

**Endpoint:** `GET /api/payments/admin/stats`

**Descripción:** Obtener estadísticas de pagos

**Permisos:** Admin

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment statistics retrieved",
  "data": {
    "total_payments": 25,
    "completed_payments": 23,
    "pending_payments": 1,
    "failed_payments": 1,
    "total_amount": 45750.00,
    "average_payment": 1830.00,
    "payments_today": 5,
    "payments_this_week": 20,
    "payments_this_month": 25
  },
  "statusCode": 200
}
```

---

### 8. Webhook PayPhone

**Endpoint:** `POST /api/payments/webhook/payphone`

**Descripción:** Recibir notificación de PayPhone

**Permisos:** Público (validado por PayPhone)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "transaction_id": "TXN-123456",
  "order_id": "1",
  "amount": 1325.50,
  "currency": "USD",
  "status": "COMPLETED",
  "reference": "REF-PAY-001",
  "paid_at": "2025-01-18T18:15:00Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "statusCode": 200
}
```

---

## ✅ Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|------------|-------------|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Sin contenido |
| **400** | Bad Request | Solicitud inválida |
| **401** | Unauthorized | No autenticado |
| **403** | Forbidden | No autorizado |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email duplicado) |
| **422** | Unprocessable Entity | Validación fallida |
| **429** | Too Many Requests | Demasiadas solicitudes |
| **500** | Internal Server Error | Error interno del servidor |
| **503** | Service Unavailable | Servicio no disponible |

---

## ⚠️ Manejo de Errores

### Formato de Error Estándar

```json
{
  "success": false,
  "message": "Error general",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "statusCode": 400
}
```

### Errores Comunes

#### Email Duplicado
```json
{
  "success": false,
  "message": "Email already exists",
  "error": {
    "code": "EMAIL_EXISTS"
  },
  "statusCode": 409
}
```

#### Contraseña Débil
```json
{
  "success": false,
  "message": "Password is too weak",
  "error": {
    "code": "WEAK_PASSWORD",
    "details": "Password must contain uppercase, lowercase, numbers and be at least 8 characters"
  },
  "statusCode": 400
}
```

#### Token Inválido
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": {
    "code": "INVALID_TOKEN"
  },
  "statusCode": 401
}
```

#### Validación Fallida
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "price",
        "message": "Price must be greater than 0"
      }
    ]
  },
  "statusCode": 422
}
```

---

## 🔗 Ejemplos de Uso

### Ejemplo 1: Registro y Login

**1. Registrar usuario:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**2. Hacer login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "MiPassword123!"
  }'
```

**3. Guardar token:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Ejemplo 2: Agregar Producto al Carrito y Crear Orden

**1. Ver carrito:**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer {token}"
```

**2. Agregar producto:**
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

**3. Crear orden:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "Calle Principal 123",
    "tax": 15.50,
    "shipping_cost": 10.00
  }'
```

**4. Crear pago:**
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "return_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel"
  }'
```

---

### Ejemplo 3: Operaciones de Admin

**1. Crear categoría:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Baño",
    "description": "Muebles para baño",
    "sort_order": 6
  }'
```

**2. Crear producto:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Espejo Decorativo",
    "description": "Espejo de baño",
    "sku": "ESP-DEC-001",
    "price": 85.00,
    "stock_quantity": 20,
    "category_id": 6
  }'
```

**3. Ver todas las órdenes:**
```bash
curl -X GET "http://localhost:5000/api/orders/admin/all?status=PENDING" \
  -H "Authorization: Bearer {admin_token}"
```

---
