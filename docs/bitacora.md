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
- Como administrador quiero poder asignar categorías a productos ya creados.
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
