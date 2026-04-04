# Flask Task and User Management Application

## Descripción General

Esta es una aplicación full-stack para la gestión de tareas y usuarios. Consiste en un back-end API REST construido con Flask (Python) y un front-end de aplicación de página única (SPA) desarrollado con HTML, CSS (Tailwind CSS) y JavaScript vanilla.

La aplicación permite crear, leer, actualizar y eliminar (CRUD) tareas y usuarios, con una interfaz intuitiva y responsiva.

## Arquitectura

### Back-end (Flask API)
- **Ubicación**: `Back-end/`
- **Tecnologías**: Python, Flask, Flask-CORS
- **Funcionalidades**:
  - API RESTful para tareas y usuarios.
  - Almacenamiento en memoria (listas Python).
  - Endpoints para CRUD completo.
  - Soporte CORS para integración con front-end.

### Front-end (SPA)
- **Ubicación**: `Front-end/`
- **Tecnologías**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Funcionalidades**:
  - Interfaz de usuario responsiva.
  - Navegación SPA entre secciones de tareas y usuarios.
  - Modales para crear/editar.
  - Estadísticas en tiempo real.
  - Notificaciones toast.
  - Comunicación asíncrona con la API.

## Tecnologías Principales

- **Back-end**: Python 3.6+, Flask 3.1+, Flask-CORS 6.0+
- **Front-end**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS 3.4+
- **Otros**: Material Symbols (iconos), Google Fonts (tipografía)

## Requisitos Previos

- Python 3.6 o superior instalado.
- Navegador web moderno con soporte para ES6+ y fetch API.
- (Opcional) Entorno virtual para Python.

## Instalación y Configuración

### Back-end

1. Navega a la carpeta `Back-end`:
   ```
   cd Back-end
   ```

2. Crea y activa un entorno virtual (recomendado):
   ```
   python -m venv my_env
   # En Windows:
   my_env\Scripts\activate
   # En macOS/Linux:
   source my_env/bin/activate
   ```

3. Instala las dependencias:
   ```
   pip install flask flask-cors
   ```

4. Ejecuta la aplicación:
   ```
   python app.py
   ```
   La API estará disponible en `http://127.0.0.1:5000/`.

### Front-end

1. Navega a la carpeta `Front-end`:
   ```
   cd ../Front-end
   ```

2. Abre `index.html` en un navegador web, o sirve los archivos con un servidor local (ej. Live Server en VS Code).

3. Asegúrate de que el back-end esté corriendo para que la aplicación funcione completamente.

## Uso

1. Inicia el back-end primero.
2. Abre el front-end en el navegador.
3. Usa la barra lateral para navegar entre "Tasks" y "Users".
4. Crea, edita o elimina tareas/usuarios usando los botones y modales.
5. Las estadísticas se actualizan automáticamente.

## Estructura del Proyecto

```
Flask - Introduction/
├── Back-end/
│   ├── app.py              # Código principal de la API Flask
│   ├── my_env/             # Entorno virtual (ignorado en git)
│   └── README.md           # Documentación específica del back-end
├── Front-end/
│   ├── index.html          # Estructura HTML principal
│   ├── index.css           # Estilos adicionales
│   ├── index.js            # Lógica JavaScript
│   └── README.md           # Documentación específica del front-end
└── README.md               # Este archivo
```

## Características Destacadas

- **Full-stack**: Back-end API + Front-end SPA.
- **CRUD completo**: Para tareas y usuarios.
- **Interfaz moderna**: Diseño con Tailwind CSS, iconos Material Symbols.
- **Responsiva**: Funciona en desktop y móvil.
- **Tiempo real**: Estadísticas y listas se actualizan dinámicamente.
- **Validación**: Validaciones básicas en front-end y back-end.
- **Notificaciones**: Feedback visual con toasts.

## Limitaciones y Mejoras Futuras

- **Almacenamiento**: Actualmente en memoria; se pierde al reiniciar. Recomendado: agregar base de datos (SQLite, PostgreSQL).
- **Autenticación**: No implementada. Agregar login/roles para producción.
- **Modo oscuro**: Configurado pero no activado dinámicamente.
- **Pruebas**: Agregar tests unitarios e integración.
- **Despliegue**: Configurar para producción (Gunicorn, Docker).

## Información del Proyecto

Este proyecto fue desarrollado como parte del curso **Construcción de Software** en la **Universidad La Salle**.

**Autor**: Bryan Motta Bedregal

## Contribución

Para contribuir:
1. Fork el repositorio.
2. Crea una rama para tu feature.
3. Realiza commits descriptivos.
4. Envía un pull request.

## Licencia

Este proyecto es de código abierto. Consulta los archivos individuales para detalles de licencia.