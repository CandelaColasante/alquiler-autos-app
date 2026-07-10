# Bitácora del Proyecto - App de Alquiler de Autos

## Definición del Proyecto

### Nombre del Proyecto
AutoAlquiler - Sistema de Gestión de Alquiler de Vehículos

### Problema a resolver
La empresa no cuenta con un sistema digital para gestionar el alquiler de los vehículos, lo que dificulta el control de disponibilidad y la administración de reservas.

### Solución propuesta
Desarrollar una aplicación web que permita:
- Visualizar catálogo de autos disponibles.
- Administrar vehículos (agregar/eliminar).
- Ver detalles específicos de cada auto.
- Reservar vehículo.

### Tecnologías utilizadas
- Frontend: React + Vite.
- Backend: Spring Boot.
- Base de datos: MySQL.

### Estructura del equipo:
- Scrum Master: Candela Colasante.
- Referente UX/UI: Candela Colasante.
- TL Testing: Candela Colasante.

## Sprint 1 - Configuración Inicial

### Historias de usuario completadas:
- Como usuario quiero ver el catálogo de autos. ✅
- Como administrador quiero agregar nuevos autos, visualizar el listado de todos los autos disponibles y eliminarlos. ✅
- Como usuario quiero ver recomendaciones aleatorias de autos. ✅
- Como usuario quiero ver el detalle de cada auto. ✅

## Sprint 2 - Gestión de Usuarios y Catálogo Avanzado

### Historias de usuario completadas:
- Como administrador quiero poder asignar categorías a productos ya creados. ✅
- Como usuario anónimo quiero poder registrarme en el sitio web para poder acceder a funcionalidades extras. ✅
- Como usuario autenticado quiero poder iniciar sesión para poder gestionar mis reservas, y cerrar sesión de manera segura. ✅
- Como administrador quiero poder otorgar o quitar a un usuario el rol de administrador para acceder a las funcionalidades únicas de ese rol. ✅
- Como administrador quiero poder añadir, editar y eliminar características de un producto, asignandoles un icono a cada una de ellas. ✅
- Como usuario quiero poder visualizar todas las características de un producto. ✅
- Como administrador quiero poder añadir, editar y eliminar categorías de un producto. ✅
- Como administrador quiero poder crear nuevas categorias con titulo, descripción e imagen. ✅
- Como usuario quiero poder filtrar los productos por categoría. ✅

### Mejoras técnicas respecto al Sprint 1:
- Incorporación de DTOs: Se implementaron DTOs (Data Transfer Objects) para controlar qué información
se expone en las respuestas de la API, mejorando la seguridad y evitando enviar datos sensible como la
contraseña del usuario.

## Sprint 3 - Funcionalidades de Usuario y Producto

### Historias de usuario completadas:
- Como usuario quiero poder realizar búsquedas de productos para encontrar los resultados que mejor se adapten a lo que busco. ✅
- Como usuario quiero poder visualizar las fechas disponibles en la ficha del producto para poder acceder a la sección de reservas. ✅
- Como usuario autenticado quiero poder marcar productos como favoritos desde la lista de productos del home para poder acceder a ellos posteriormente. ✅
- Como usuario autenticado quiero poder acceder a mi lista de favoritos para ver los productos que marqué previamente. ✅
- Como usuario quiero poder visualizar la política de uso de un producto para informarme sobre cuidados y precauciones. ✅
- Como usuario quiero compartir productos en las redes sociales para poder recomendarlos a otros usuarios. ✅
- Como usuario que realizó una reserva quiero poder puntuar los productos con estrellas para poder dar mi opinión. ✅
- Como administrador quiero poder eliminar categorías que ya no se utilizarán para mantener el catálogo de productos organizado y actualizado. ✅

### Mejoras técnicas respecto al Sprint 2:
- Implementación de autenticación con JWT (JSON Web Token): al iniciar sesión, el backend genera un token firmado que el frontend almacena y envía en cada petición protegida mediante el header `Authorization: Bearer`. El backend valida el token y el rol del usuario en cada operación, eliminando la dependencia exclusiva del frontend para el control de acceso.
- Protección de endpoints por rol en el backend: los endpoints de administración (crear/editar/eliminar productos, categorías y características) ahora requieren rol `ADMIN` verificado por el servidor, no solo por el frontend.
- Eliminación en cascada de categorías: al eliminar una categoría, se eliminan automáticamente todos los productos asociados junto con sus reseñas, reservas e imágenes.
- Sistema de reseñas y puntuación media dinámica con persistencia en base de datos.
- Configuración centralizada de CORS en Spring Security para soportar el header `Authorization`.

## Sprint 4 - Funcionalidad de Reservas y Mejoras

### Historias de usuario completadas:
- Como usuario quiero poder realizar búsquedas por fecha para encontrar productos que coincidan con mis intereses. ✅
- Como usuario autenticado quiero poder visualizar una página de reservas con el detalle del producto para poder reservarlo. ✅
- Como usuario autenticado quiero poder realizar reservas para poder utilizar los productos. ✅
- Como usuario autenticado quiero poder visualizar mis reservas anteriores para conocer mi historial. ✅
- Como usuario quiero poder comunicarme con el proveedor del producto a través de WhatsApp para poder consultarle si tengo alguna duda. ✅
- Como usuario registrado quiero recibir un correo electrónico con los datos de mi reserva luego de su ejecución para validarlos y encontrarlos fácilmente. ✅

### Mejoras técnicas respecto al Sprint 3:
- Implementación del flujo completo de reservas: validación de fechas, bloqueo de fechas ocupadas y prevención de superposición de reservas en el backend.
- Envío automático de email de confirmación de reserva mediante JavaMail y Gmail SMTP, con credenciales protegidas a través de variables de entorno.
- Integración de botón flotante de WhatsApp con manejo de errores y notificación de éxito.
- Rediseño del panel de administración con menú lateral tipo dashboard, integrando todas las secciones en una sola página sin navegación entre rutas.
- Rediseño del perfil de usuario con menú lateral y secciones de información personal, historial de reservas y favoritos.
- Mejoras de responsive design para compatibilidad con smartphones, tablets y escritorio.
- Seguridad de credenciales de email mediante variables de entorno en lugar de valores hardcodeados.
- Corrección del filtro de búsqueda por disponibilidad de fechas: al buscar por rango de fechas, el sistema consulta al backend qué productos tienen reservas que se superponen con el período seleccionado y los excluye de los resultados. Se corrigió además la lógica de superposición para usar comparaciones inclusivas (`<=` y `>=`), asegurando que productos con reservas en los bordes exactos del rango también sean excluidos correctamente.