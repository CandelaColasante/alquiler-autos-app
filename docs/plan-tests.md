# Plan de Pruebas - App de Alquiler de Autos

## Sprint 1
### Historias de usuario a probar
1) Ver catálogo de autos.
2) Agregar auto nuevo (admin).
3) Eliminar auto (admin).
4) Ver detalle de un auto.

### Casos de prueba
1) Ver catálogo:
- Prueba 1: Cargar página principal.
- Pasos: Abrir http://localhost:5173.
- Resultado esperado: Muestra lista de autos.

- Prueba 2: Ver imágenes de autos.
- Pasos: Mirar cada card.
- Resultado esperado: Cada auto tiene su imagen/imagenes.

2) Agregar auto:
- Prueba 3: Agregar auto con datos validos.
- Pasos: 
   1. Ir a /administracion
   2. Completar formulario
   3. Click en "Guardar"
- Resultado esperado: Auto aparece en catálogo.

- Prueba 4: Enviar sin imagenes.
- Pasos: Click en "Guardar" sin seleccionar al menos una imagen.
- Resultado esperado: Muestra error de "Selecciona al menos una imagen".

- Prueba 5: Agregar auto con nombre repetido.
- Pasos: 
   1. Ir a /administracion
   2. Completar formulario con un nombre que ya existe
   3. Click en "Guardar"
- Resultado esperado: Muestra error "Ya existe un producto con ese nombre"

3) Eliminar auto:
- Prueba 6: Eliminar auto existente.
- Pasos: 
   1. Ir a /administracion
   2. Click en botón "Eliminar"
   3. Confirmar
- Resultado esperado: El auto desaparece del listado de todos los autos cargados en el catálogo.

4) Ver detalle de un auto:
- Prueba 7: Ver detalle desde catálogo.
- Pasos: Click en "Ver más" en cualquier auto.
- Resultado esperado: Mostrar nombre, descripción e imágenes.

### Resumen Sprint 1
Fecha de ejecución: 19/04/2026.
Cantidad total de pruebas: 7.
Cantidad de pruebas aprobadas: 7.
Cantidad de pruebas fallidas: 0.

---

## Sprint 2
### Historias de usuario a probar
1) Registro de usuario.
2) Inicio y cierre de sesión.
3) Gestión de roles (administrador).
4) Gestión de categorías.
5) Gestión de características.
6) Filtro por categoría en el home.

### Casos de prueba

1) Registro de usuario:
- Prueba 8: Registro exitoso.
- Pasos:
  1. Ir a /registro
  2. Completar nombre, apellido, email, contraseña
  3. Click en "Registrarse"
- Resultado esperado: Mensaje "Registro exitoso" y redirección al home.

- Prueba 9: Registro con email ya existente.
- Pasos:
  1. Intentar registrar con email ya utilizado
  2. Click en "Registrarse"
- Resultado esperado: Mensaje de error "El email ya está registrado".

- Prueba 10: Registro con contraseña muy corta (menos de 6 caracteres).
- Pasos: 
  1. Completar con contraseña de 5 caracteres o menos.
- Resultado esperado: Mensaje de error "La contraseña debe tener al menos 6 caracteres".

1) Inicio y cierre de sesión
- Prueba 11: Login exitoso.
- Pasos:
  1. Ir a /login
  2. Ingresar email y contraseña válidos
  3. Click en "Iniciar sesión"
- Resultado esperado: Redirección al home y Header muestra avatar y nombre del usuario.

- Prueba 12: Login con credenciales incorrectas.
- Pasos: 
  1. Ingresar email o contraseña inválidos.
- Resultado esperado: Mensaje de error "Email o contraseña incorrectos".

- Prueba 13: Cierre de sesión.
- Pasos:
  1. Estando logueado
  2. Click en "Cerrar sesión"
- Resultado esperado: Header muestra botones de "Crear cuenta" e "Iniciar sesión".

3) Gestión de roles (administrador)
- Prueba 14: Asignar rol de administrador.
- Pasos:
  1. Iniciar sesión como ADMIN
  2. Ir a /admin/usuarios
  3. Click en "Hacer Admin" a un usuario común
- Resultado esperado: El usuario cambia a rol ADMIN y ve el panel de administración.

- Prueba 15: Quitar rol de administrador.
- Pasos: Click en "Quitar Admin" a un usuario ADMIN.
- Resultado esperado: El usuario vuelve a rol USER y ya no ve el panel de administración.

4) Gestión de categorías
- Prueba 16: Crear nueva categoría.
- Pasos:
  1. Ir a /admin/categorias
  2. Click en "Añadir nueva categoría"
  3. Completar nombre, descripción, imagen URL
  4. Click en "Crear"
- Resultado esperado: La categoría aparece en el listado.

- Prueba 17: Editar categoría.
- Pasos: 
  1. Click en "Editar", modificar datos y guardar.
- Resultado esperado: Los cambios se reflejan en el listado.

- Prueba 18: Eliminar categoría.
- Pasos: 
  1. Click en "Eliminar" y confirmar.
- Resultado esperado: La categoría desaparece del listado.

5) Gestión de características
- Prueba 19: Crear nueva característica con icono.
- Pasos:
  1. Ir a /admin/caracteristicas
  2. Click en "Añadir nueva característica"
  3. Completar nombre y seleccionar icono
  4. Click en "Crear"
- Resultado esperado: La característica aparece en el listado con su icono.

- Prueba 20: Asociar características a un producto.
- Pasos:
  1. Ir a /add-product o /edit-product
  2. Seleccionar una o más características del listado
  3. Guardar el producto
- Resultado esperado: Las características aparecen en el detalle del producto.

6) Filtro por categoría en el home
- Prueba 21: Filtrar productos por una categoría.
- Pasos:
  1. En el home, click en una categoría (ej: "SUV")
- Resultado esperado: Solo se muestran productos de esa categoría.

- Prueba 22: Filtrar por múltiples categorías.
- Pasos: 
  1. Seleccionar 2 o más categorías.
- Resultado esperado: Se muestran productos que pertenecen a cualquiera de las categorías seleccionadas.

- Prueba 23: Limpiar filtros.
- Pasos: 
  1. Click en "Limpiar filtros".
- Resultado esperado: Se muestran todos los productos nuevamente.

- Prueba 24: Ver contador de resultados.
- Pasos: 
  1. Aplicar filtro.
- Resultado esperado: El contador muestra "Mostrando X de Y vehículos".

### Resumen Sprint 2
Fecha de ejecución: 26/04/2026.
Cantidad total de pruebas del Sprint 2: 17 (Pruebas 8 a 24).
Cantidad de pruebas aprobadas: 17.
Cantidad de pruebas fallidas: 0.

## Sprint 3
### Historias de usuario a probar
1) Búsqueda de productos.
2) Visualización de disponibilidad.
3) Marcar como favorito.
4) Listar productos favoritos.
5) Ver bloque de políticas.
6) Compartir en redes sociales.
7) Puntuar producto.
8) Eliminar categoría.

### Casos de prueba

1) Búsqueda de productos:
- Prueba 25: Búsqueda por nombre.
- Pasos:
  1. En el home, escribir el nombre de un vehículo en el buscador.
- Resultado esperado: Se muestran solo los productos que coinciden con el término buscado.

- Prueba 26: Búsqueda sin resultados.
- Pasos:
  1. Ingresar un término que no coincida con ningún producto.
- Resultado esperado: Se muestra mensaje "No hay vehículos que coincidan con tu búsqueda".

- Prueba 27: Sugerencias de autocompletado.
- Pasos:
  1. Comenzar a escribir en el buscador.
- Resultado esperado: Aparecen sugerencias relevantes mientras se escribe.

- Prueba 28: Secciones mantenidas durante búsqueda.
- Pasos:
  1. Realizar una búsqueda desde el home.
- Resultado esperado: Las secciones de categorías y recomendaciones permanecen visibles.

2) Visualización de disponibilidad:
- Prueba 29: Ver calendario de disponibilidad.
- Pasos:
  1. Ir al detalle de un producto.
  2. Click en "Disponibilidad del vehículo".
- Resultado esperado: Se despliega un calendario doble con fechas ocupadas destacadas.

- Prueba 30: Manejo de error en disponibilidad.
- Pasos:
  1. Apagar el backend.
  2. Abrir el calendario de disponibilidad.
- Resultado esperado: Se muestra mensaje de error y botón "Reintentar".

3) Marcar como favorito:
- Prueba 31: Marcar favorito como usuario autenticado.
- Pasos:
  1. Iniciar sesión.
  2. En el home, click en el ícono de corazón de un producto.
- Resultado esperado: El corazón se pinta y el producto queda guardado como favorito.

- Prueba 32: Desmarcar favorito.
- Pasos:
  1. Click nuevamente en el corazón de un producto ya marcado.
- Resultado esperado: El corazón se desmarca y el producto deja de ser favorito.

- Prueba 33: Intentar marcar favorito sin sesión.
- Pasos:
  1. Sin iniciar sesión, click en el corazón de un producto.
- Resultado esperado: Se muestra alerta "Debes iniciar sesión para agregar favoritos".

- Prueba 34: Persistencia del favorito.
- Pasos:
  1. Marcar un producto como favorito.
  2. Recargar la página.
- Resultado esperado: El corazón sigue pintado.

4) Listar productos favoritos:
- Prueba 35: Ver lista de favoritos.
- Pasos:
  1. Iniciar sesión y marcar al menos un favorito.
  2. Ir a "Mi Perfil".
- Resultado esperado: Se muestran los productos marcados como favoritos con imagen, nombre y categoría.

- Prueba 36: Eliminar favorito desde el perfil.
- Pasos:
  1. En "Mi Perfil", click en "Quitar" en un producto favorito.
- Resultado esperado: El producto desaparece de la lista de favoritos sin recargar la página.

- Prueba 37: Lista vacía de favoritos.
- Pasos:
  1. Iniciar sesión con usuario sin favoritos.
  2. Ir a "Mi Perfil".
- Resultado esperado: Se muestra mensaje "No tenés vehículos favoritos todavía".

5) Ver bloque de políticas:
- Prueba 38: Ver políticas del producto.
- Pasos:
  1. Ir al detalle de un producto.
  2. Click en "Políticas del producto".
- Resultado esperado: Se despliegan las políticas distribuidas en columnas con título y descripción.

- Prueba 39: Verificar título subrayado.
- Pasos:
  1. Abrir el bloque de políticas.
- Resultado esperado: El título "Políticas del producto" aparece claramente subrayado.

6) Compartir en redes sociales:
- Prueba 40: Abrir modal de compartir.
- Pasos:
  1. Ir al detalle de un producto.
  2. Click en el botón "Compartir".
- Resultado esperado: Se abre una ventana emergente con imagen, descripción y enlace del producto.

- Prueba 41: Compartir en Facebook.
- Pasos:
  1. En el modal, click en "Facebook".
- Resultado esperado: Se abre una nueva ventana con el publicador de Facebook con el enlace del producto.

- Prueba 42: Compartir en Twitter/X.
- Pasos:
  1. En el modal, click en "Twitter / X".
- Resultado esperado: Se abre una nueva ventana con el publicador de Twitter con el mensaje y enlace.

- Prueba 43: Compartir en WhatsApp.
- Pasos:
  1. En el modal, click en "WhatsApp".
- Resultado esperado: Se abre WhatsApp Web con el mensaje y enlace listos para enviar.

- Prueba 44: Copiar enlace para Instagram.
- Pasos:
  1. En el modal, click en "Instagram".
- Resultado esperado: Se muestra "¡Enlace copiado!" y el enlace queda en el portapapeles.

- Prueba 45: Agregar mensaje personalizado.
- Pasos:
  1. En el modal, escribir un mensaje en el campo de texto.
  2. Click en "Facebook" o "Twitter".
- Resultado esperado: El mensaje personalizado se incluye en el contenido compartido.

7) Puntuar producto:
- Prueba 46: Ver sección de reseñas en el detalle.
- Pasos:
  1. Ir al detalle de cualquier producto.
- Resultado esperado: Se muestra la sección "Valoraciones y reseñas" con puntuación media y cantidad.

- Prueba 47: Publicar reseña con usuario con reserva finalizada.
- Pasos:
  1. Iniciar sesión con usuario que tiene reserva finalizada.
  2. Ir al detalle del producto reservado.
  3. Seleccionar 4 estrellas, escribir comentario y click en "Publicar reseña".
- Resultado esperado: La reseña aparece en el listado con nombre, fecha, estrellas y comentario. La puntuación media se actualiza.

- Prueba 48: Intentar reseñar sin reserva finalizada.
- Pasos:
  1. Iniciar sesión con usuario sin reservas.
  2. Ir al detalle de un producto.
- Resultado esperado: Se muestra mensaje informativo indicando que solo usuarios con reserva finalizada pueden reseñar.

- Prueba 49: Puntuación media visible en el home.
- Pasos:
  1. Ver las cards de productos en el home.
- Resultado esperado: Cada card muestra la puntuación media y cantidad de valoraciones.

8) Eliminar categoría:
- Prueba 50: Eliminar categoría sin productos.
- Pasos:
  1. Ir a /admin/categorias.
  2. Click en "Eliminar" en una categoría sin productos.
  3. Confirmar en el modal.
- Resultado esperado: La categoría desaparece del listado.

- Prueba 51: Eliminar categoría con productos — verificar advertencia.
- Pasos:
  1. Ir a /admin/categorias.
  2. Click en "Eliminar" en una categoría con productos asociados.
- Resultado esperado: El modal muestra el nombre de la categoría, la cantidad de productos asociados y advierte que también se eliminarán.

- Prueba 52: Confirmar eliminación de categoría con productos.
- Pasos:
  1. En el modal de confirmación, click en "Sí, eliminar".
- Resultado esperado: La categoría y todos sus productos asociados desaparecen del sistema.

- Prueba 53: Cancelar eliminación de categoría.
- Pasos:
  1. En el modal de confirmación, click en "Cancelar".
- Resultado esperado: El modal se cierra y la categoría permanece sin cambios.

- Prueba 54: Verificar seguridad JWT — operación sin token válido.
- Pasos:
  1. Cerrar sesión.
  2. En la consola del navegador ejecutar: `localStorage.setItem('user', JSON.stringify({id: 999, role: 'ADMIN', firstName: 'Falso'}))`
  3. Recargar la página e intentar eliminar un producto.
- Resultado esperado: El backend devuelve error 403 — la operación es rechazada aunque el frontend muestre el panel de admin.

### Resumen Sprint 3
Fecha de ejecución: 18/06/2026.
Cantidad total de pruebas del Sprint 3: 30 (Pruebas 25 a 54).
Cantidad de pruebas aprobadas: 30.
Cantidad de pruebas fallidas: 0.

## Resumen general
Cantidad total de pruebas: 54.
Cantidad total de pruebas aprobadas: 54.
Cantidad total de pruebas fallidas: 0.