# Flask Task and User Management API

## Descripción

Esta aplicación es una API RESTful simple construida con Flask que permite gestionar tareas (tasks) y usuarios (users). Utiliza almacenamiento en memoria (listas Python) para simplicidad, sin base de datos persistente. Incluye soporte para CORS para integración con front-ends.

## Tecnologías Utilizadas

- **Flask**: Framework web para Python.
- **Flask-CORS**: Extensión para manejar CORS (Cross-Origin Resource Sharing).
- **Python**: Lenguaje de programación principal.

## Instalación

1. Asegúrate de tener Python instalado (versión 3.6 o superior).
2. Crea un entorno virtual (opcional pero recomendado):
   ```
   python -m venv my_env
   ```
3. Activa el entorno virtual:
   - En Windows: `my_env\Scripts\activate`
4. Instala las dependencias:
   ```
   pip install flask flask-cors
   ```

## Ejecución

Para ejecutar la aplicación en modo de desarrollo:

```
python app.py
```

La aplicación se ejecutará en `http://127.0.0.1:5000/` con modo debug activado.

## Endpoints de la API

### Tareas (Tasks)

- **GET /tasks**: Obtiene todas las tareas.
  - Respuesta: `{"tasks": [lista de tareas]}`

- **POST /tasks**: Agrega una nueva tarea.
  - Cuerpo JSON requerido: `{"content": "contenido de la tarea"}` (opcional: `{"title": "título"}`)
  - Respuesta: `{"message": "Task added!", "task": tarea_creada}` (201)

- **PUT /tasks/<int:task_id>**: Actualiza una tarea por ID.
  - Cuerpo JSON: campos opcionales `title`, `content`, `done`
  - Respuesta: `{"message": "Task updated!", "task": tarea_actualizada}`

- **DELETE /tasks/<int:task_id>**: Elimina una tarea por ID.
  - Respuesta: `{"message": "Task deleted!", "task": tarea_eliminada}`

- **GET /tasks/<int:task_id>**: Obtiene una tarea específica por ID.
  - Respuesta: `{"task": tarea}`

- **POST /tasksDone/<int:task_id>**: Marca una tarea como completada.
  - Respuesta: `{"message": "Task marked as done!", "task": tarea}`

### Usuarios (Users)

- **GET /users**: Obtiene todos los usuarios.
  - Respuesta: `{"users": [lista de usuarios]}`

- **POST /user**: Agrega un nuevo usuario.
  - Cuerpo JSON requerido: `{"name": "nombre"}` (opcional: `{"lastname": "apellido", "address": {"city": "ciudad", "country": "país", "code": "código"}}`)
  - Respuesta: `{"message": "User added!", "user": usuario_creado}` (201)

- **PUT /user/<int:user_id>**: Actualiza un usuario por ID.
  - Cuerpo JSON: campos opcionales `name`, `lastname`, `address` (con subcampos `city`, `country`, `code`)
  - Respuesta: `{"message": "User updated!", "user": usuario_actualizado}`

- **DELETE /user/<int:user_id>**: Elimina un usuario por ID.
  - Respuesta: `{"message": "User deleted!", "user": usuario_eliminado}`

## Estructura del Proyecto

- `Back-end/app.py`: Código principal de la API Flask.
- `Front-end/`: Archivos del front-end (HTML, CSS, JS) para interactuar con la API.

## Notas

- Los datos se almacenan en memoria y se pierden al reiniciar la aplicación.
- No hay autenticación implementada.
- Para producción, considera agregar una base de datos (ej. SQLite, PostgreSQL) y validaciones adicionales.