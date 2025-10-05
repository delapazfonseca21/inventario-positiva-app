# Configuración de PocketBase

Este proyecto está configurado para conectarse con PocketBase en modo local.

## Requisitos

1. **PocketBase instalado y corriendo** en `http://127.0.0.1:8090`
2. Las siguientes colecciones creadas en tu PocketBase:
   - `empleados` - Para usuarios/empleados
   - `categorias` - Para categorías de inventario
   - `inventario` - Para items de inventario
   - `stock_history` - Para historial de movimientos

## Estructura de Colecciones

### empleados (Auth Collection)
Esta debe ser una colección de autenticación con los siguientes campos:
- `email` (email, requerido, único)
- `password` (password, requerido)
- `name` (text, requerido)

### categorias
- `nombre` (text, requerido)
- `icono` (text, opcional)
- `color` (text, opcional)

### inventario
- `nombre` (text, requerido)
- `descripcion` (text, opcional)
- `cantidad` (number, requerido)
- `unidad` (text, requerido)
- `categoria` (relation → categorias, requerido)
- `minStock` (number, opcional)
- `imagen` (text/url, opcional)

### stock_history
- `empleado` (relation → empleados, requerido)
- `accion` (select: "entrada" | "salida", requerido)
- `inventario` (relation → inventario, requerido)
- `cantidad` (number, requerido)
- `unidad` (text, requerido)

## Configuración de Autenticación

1. En PocketBase Admin UI, ve a Settings → Collections
2. Selecciona la colección `empleados`
3. En la pestaña "Options", asegúrate de que:
   - "Auth collection" esté habilitado
   - "Auth via email" esté habilitado
   - Los campos `email`, `password` y `name` estén configurados correctamente

## Crear tu primer usuario

Puedes crear un usuario de dos formas:

### 1. Desde PocketBase Admin UI:
1. Ve a Collections → empleados
2. Click en "New record"
3. Ingresa email, password y name
4. Guarda el registro

## Conectar la aplicación

La aplicación está configurada para conectarse automáticamente a:
```
http://127.0.0.1:8090
```

Si tu PocketBase está en otra URL, modifica el archivo `src/lib/pocketbase.ts`:

```typescript
export const pb = new PocketBase('TU_URL_AQUI');
```

## Iniciar PocketBase

```bash
# En el directorio donde tienes PocketBase
./pocketbase serve
```

## Próximos pasos

1. Inicia PocketBase en tu máquina local
2. Accede a la Admin UI en `http://127.0.0.1:8090/_/`
3. Crea las colecciones mencionadas arriba
4. Crea tu primer usuario en la colección `empleados`
5. Inicia tu aplicación React
6. Inicia sesión con las credenciales del usuario que creaste

## Características implementadas

✅ Autenticación con PocketBase
✅ CRUD de inventario conectado a la base de datos
✅ Historial de movimientos desde la base de datos
✅ Tipos TypeScript para todas las colecciones
✅ Hooks personalizados para operaciones de base de datos
✅ Manejo de errores y estados de carga

## Recursos

- [Documentación de PocketBase](https://pocketbase.io/docs/)
- [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)
