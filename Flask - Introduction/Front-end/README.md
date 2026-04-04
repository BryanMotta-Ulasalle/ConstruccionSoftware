# Front-end: Task and User Management SPA

## Descripción

Esta es la interfaz de usuario (front-end) para la aplicación de gestión de tareas y usuarios. Es una aplicación de página única (SPA) construida con HTML, CSS (Tailwind CSS) y JavaScript vanilla. Se conecta a la API REST de Flask para realizar operaciones CRUD en tareas y usuarios.

## Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación.
- **CSS3 con Tailwind CSS**: Estilos y diseño responsivo. Incluye configuración personalizada de colores y fuentes.
- **JavaScript (ES6+)**: Lógica de la aplicación, manejo de DOM, fetch API para comunicación con el back-end.
- **Material Symbols**: Iconos de Google para la interfaz.
- **Google Fonts**: Fuentes Manrope e Inter para tipografía.

## Características Principales

### Navegación
- Barra lateral con navegación entre secciones de Tareas y Usuarios.
- Navegación de tipo SPA (sin recargas de página).

### Gestión de Tareas
- **Vista de lista**: Tabla con título, contenido, estado y acciones.
- **Estadísticas**: Contadores de tareas en progreso, completadas y totales.
- **Crear tarea**: Modal con campos para título, contenido y estado.
- **Editar tarea**: Modal pre-llenado para actualizar tareas existentes.
- **Eliminar tarea**: Confirmación antes de eliminar.
- **Marcar como completada**: Endpoint especial para cambiar estado.
- **Estados**: "In Progress" (con indicador animado), "Completed", "Backlog".

### Gestión de Usuarios
- **Vista de lista**: Tabla con nombre, apellido, ciudad, país, código postal y acciones.
- **Estadísticas**: Contador total de usuarios.
- **Crear usuario**: Modal con campos para nombre, apellido y dirección (ciudad, país, código).
- **Editar usuario**: Modal pre-llenado para actualizar usuarios.
- **Eliminar usuario**: Confirmación antes de eliminar.

### Interfaz de Usuario
- **Modales**: Para crear/editar tareas y usuarios, con backdrop y animaciones.
- **Notificaciones Toast**: Mensajes de éxito/error con iconos.
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla.
- **Tema**: Colores personalizados con soporte para modo oscuro (configurado pero no implementado dinámicamente).
- **Animaciones**: Transiciones suaves, hover effects, loading spinners.

## Estructura de Archivos

- `index.html`: Estructura principal de la aplicación, incluyendo modales, sidebar y secciones.
- `index.css`: Estilos adicionales, animaciones (shimmer para loading), y configuraciones de fuentes/iconos.
- `index.js`: Lógica JavaScript completa, incluyendo:
  - Estado global (tasks, users).
  - Funciones de renderizado y actualización de UI.
  - API calls con fetch.
  - Manejo de eventos (clicks, teclas).
  - Navegación SPA.

## Funcionalidades Técnicas

### Comunicación con API
- Base URL: `http://localhost:5000`
- Métodos: GET, POST, PUT, DELETE para tareas y usuarios.
- Manejo de errores: Try/catch con notificaciones toast.
- Normalización de datos: Conversión de campos (ej. `done` a `status`).

### Seguridad y Validación
- Escape de HTML para prevenir XSS en renderizado.
- Validación básica de campos requeridos (título/nombre).
- Confirmaciones para eliminaciones.

### Rendimiento
- Renderizado eficiente con innerHTML y map/join.
- Estados de carga con spinners.
- Actualización selectiva de estadísticas y listas.

## Instalación y Ejecución

1. Asegúrate de que el back-end esté corriendo en `http://localhost:5000`.
2. Abre `index.html` en un navegador web moderno.
3. La aplicación cargará automáticamente las tareas al iniciar.

## Notas

- Requiere un servidor web local o CORS habilitado en el back-end para funcionar correctamente.
- No incluye persistencia local; todos los datos vienen de la API.
- Diseñada para integración con el back-end Flask proporcionado.
- El modo oscuro está configurado en Tailwind pero no activado dinámicamente.