# 🚗 Ready 2 Go

Aplicación web para gestión de alquiler de vehículos. Permite a los usuarios registrarse, explorar el catálogo de autos disponibles, filtrar por categoría y fechas, realizar reservas, dejar reseñas y marcar favoritos. Los administradores pueden gestionar productos, categorías, características y usuarios desde un panel dedicado.

---

## ⚙️ Tecnologías

### 🖥️ Frontend
- React 18 + Vite
- React Router DOM
- React Date Range
- Date-fns
- Font Awesome (iconos)
- CSS puro (responsive)

### ☕️ Backend
- Java 24
- Spring Boot 4.0.5
- Spring Security + JWT (jjwt 0.12.6)
- Spring Data JPA
- Spring Mail (JavaMail)
- MySQL 9

---

## 🚀 Instalación local

### 🧩 Requisitos previos
- Node.js 18+
- Java 17+
- MySQL 8+
- IntelliJ IDEA (recomendado)

### 📦 Cloná el repositorio
```bash
git clone https://github.com/CandelaColasante/alquiler-autos-app
cd ready2go
```

---

### 📁 Backend (`/backend`)

```bash
cd backend
```

#### Configurar base de datos:
```sql
CREATE DATABASE alquiler_autos;
```

#### Configurar `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/alquiler_autos?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

server.servlet.encoding.charset=UTF-8
server.servlet.encoding.enabled=true
server.servlet.encoding.force=true
```

#### Configurar variables de entorno en IntelliJ:
En **Run → Edit Configurations → Environment Variables**:
```
MAIL_USERNAME=tu_email@gmail.com;MAIL_PASSWORD=tu_contraseña_de_app
```

#### Correr el backend:
```bash
./mvnw spring-boot:run
```
> El backend estará disponible en `http://localhost:8080`

---

### 🖼️ Frontend (`/frontend`)

```bash
cd frontend
npm install
npm run dev
```
> La aplicación estará disponible en `http://localhost:5173`

---

## 📬 Endpoints (API REST)

| Método | Endpoint                               | Descripción                         | Auth    |
|--------|----------------------------------------|-------------------------------------|----------|
| POST   | /api/auth/register                     | Registro de usuario                 | ❌       |
| POST   | /api/auth/login                        | Login y generación de JWT           | ❌       |
| GET    | /api/products                          | Listado de productos                | ❌       |
| POST   | /api/products                          | Crear producto                      | ✅ ADMIN |
| GET    | /api/products/{id}                     | Detalle de producto                 | ❌       |
| PUT    | /api/products/{id}                     | Editar producto                     | ✅ ADMIN |
| DELETE | /api/products/{id}                     | Eliminar producto                   | ✅ ADMIN |
| GET    | /api/products/{id}/availability        | Fechas ocupadas del producto        | ❌       |
| GET    | /api/products/{id}/reviews             | Reseñas del producto                | ✅       |
| POST   | /api/products/{id}/reviews             | Crear reseña                        | ✅       |
| POST   | /api/products/{productId}/reservations | Crear reserva                       | ✅       |
| GET    | /api/users/{userId}/reservations       | Historial de reservas del usuario   | ✅       |
| GET    | /api/favorites/{productId}             | Verificar favorito                  | ✅       |
| POST   | /api/favorites/{productId}             | Agregar favorito                    | ✅       |
| DELETE | /api/favorites/{productId}             | Quitar favorito                     | ✅       |
| GET    | /api/categories                        | Listado de categorías               | ❌       |
| POST   | /api/categories                        | Crear categoría.                    | ✅ ADMIN |
| PUT    | /api/categories/{id}                   | Editar categoría                    | ✅ ADMIN |
| DELETE | /api/categories/{id}                   | Eliminar categoría                  | ✅ ADMIN |
| GET    | /api/features                          | Listado de características          | ❌       |
| POST   | /api/features                          | Crear característica                | ✅ ADMIN |
| PUT    | /api/features/{id}                     | Editar característica               | ✅ ADMIN |
| DELETE | /api/features/{id}                     | Eliminar característica             | ✅ ADMIN |
| GET    | /api/auth/users                        | Listado de usuarios                 | ✅ ADMIN |
| PUT    | /api/auth/users/role                   | Cambiar rol de usuario              | ✅ ADMIN |
| GET    | /api/availability/unavailable          | Productos no disponibles por fechas | ❌       |

---

## 🔐 Autenticación

La aplicación usa **JWT (JSON Web Token)**. Al iniciar sesión, el backend genera un token firmado que el frontend almacena en `localStorage` y envía en cada petición protegida mediante el header:

```
Authorization: Bearer <token>
```

Los endpoints de administración requieren rol `ADMIN` verificado por el backend.

---

## 📧 Configuración de Email

El sistema envía emails de confirmación de reserva usando **Gmail SMTP**. Para configurarlo:

1. Activar verificación en dos pasos en tu cuenta de Gmail
2. Generar una contraseña de aplicación en **Configuración → Seguridad → Contraseñas de aplicación**
3. Configurar las variables de entorno `MAIL_USERNAME` y `MAIL_PASSWORD` en IntelliJ

---

## 🧪 Testing

El proyecto cuenta con un plan de pruebas manual documentado en `plan-tests.md` con 75 casos de prueba cubriendo los 4 sprints de desarrollo.

---

## 👤 Autora

- **Candela Colasante** — Scrum Master, UX/UI, Development & Testing
- [@CandelaColasante](https://github.com/CandelaColasante)

---

## 📞 Soporte

¿Encontraste un bug o tenés una sugerencia?

- 🐛 Reportar bug
- 💡 Solicitar feature
- 📧 Email: candecolasante@gmail.com