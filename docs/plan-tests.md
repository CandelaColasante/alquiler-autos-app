# Plan de Pruebas - App de Alquiler de Autos

## Historias de usuario a probar
1) Ver catálogo de autos.
2) Agregar auto nuevo (admin).
3) Eliminar auto (admin).
4) Ver detalle de un auto.

## Casos de prueba
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

## Resumen
Fecha de ejecución: 19/04/2026.
Cantidad total de pruebas: 7.
Cantidad de pruebas aprobadas: 7.
Cantidad de pruebas fallidas: 0.
