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
- `id` (text, auto-generado, nonempty)
- `name` (text, requerido, nonempty)
- `password` (password, requerido, nonempty, hidden)
- `tokenKey` (text, auto-generado, nonempty, hidden)
- `email` (email, requerido, nonempty)
- `emailVisibility` (bool, opcional)
- `verified` (bool, opcional)
- `created` (date, auto-generado)
- `updated` (date, auto-generado)

### categorias (Base Collection)
- `id` (text, auto-generado, nonempty)
- `nombre` (text, requerido, nonempty)
- `created` (date, auto-generado)
- `updated` (date, auto-generado)

### inventario (Base Collection)
- `id` (text, auto-generado, nonempty)
- `name` (text, requerido, nonempty)
- `description` (text, requerido, nonempty)
- `quantity` (number, requerido)
- `unit` (text, requerido, nonempty)
- `categoria` (relation → categorias, single, requerido, nonempty)
- `minStock` (number, opcional, hidden)
- `image` (file, single, opcional, hidden)
- `created` (date, auto-generado)
- `updated` (date, auto-generado)

### stock_history (Base Collection)
- `id` (text, auto-generado, nonempty)
- `user` (relation → empleados, single, requerido, nonempty)
- `action` (select: "entrada" | "salida", single, requerido, nonempty, hidden)
- `item` (relation → inventario, single, requerido, nonempty)
- `quantityChange` (number, requerido, nonempty, hidden)
- `unit` (text, requerido, nonempty, hidden)
- `timestamp` (date, auto-generado con valor "Create")
- `created` (date, auto-generado)
- `updated` (date, auto-generado)

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

## Ejemplos de API

### Crear un item en el inventario
```typescript
const data = {
  name: "Martillo",
  description: "Martillo de acero",
  quantity: 10,
  unit: "unidades",
  categoria: "CATEGORIA_ID", // ID de la categoría
  minStock: 5,
  image: "URL_O_FILE"
};

const record = await pb.collection('inventario').create(data);
```

### Registrar movimiento en el historial
```typescript
const data = {
  user: "USER_ID",           // ID del empleado
  item: "ITEM_ID",           // ID del item de inventario
  action: "entrada",         // o "salida"
  quantityChange: 5,         // cantidad del cambio
  unit: "unidades"           // unidad de medida
};

const record = await pb.collection('stock_history').create(data);
```

### Obtener historial con relaciones expandidas
```typescript
const records = await pb.collection('stock_history').getFullList({
  expand: 'item,user',
  sort: '-created'
});

// Acceder a datos expandidos
records.forEach(record => {
  console.log(record.expand.user.name);      // Nombre del usuario
  console.log(record.expand.item.name);      // Nombre del item
  console.log(record.action);                // entrada o salida
  console.log(record.quantityChange);        // cantidad del cambio
});
```

## Recursos

- [Documentación de PocketBase](https://pocketbase.io/docs/)
- [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)
