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

### Resumen
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

## Resumen general
Cantidad total de pruebas: 24.
Cantidad total de pruebas aprobadas: 24.
Cantidad total de pruebas fallidas: 0.