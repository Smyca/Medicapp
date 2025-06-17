# Medicapp API

Este proyecto expone varios endpoints REST usando Quarkus. A continuación encontrarás cómo levantar la aplicación en modo desarrollo y una descripción de los endpoints disponibles.

---

## Prerrequisitos

- Java 17 o superior
- Maven 3.6+ (incluye `mvn` o el wrapper `./mvnw`)
- Docker (opcional, para contenedores)

---

## Ejecución en modo desarrollo

Para arrancar la aplicación en modo *hot reload* de Quarkus, basta con ejecutar:

```bash
# Usando Maven instalado
mvn quarkus:dev

# O usando el wrapper incluido
./mvnw quarkus:dev
```

Esto iniciará el servidor en `http://localhost:8080` y recargará automáticamente los cambios en el código.

---

## Endpoints disponibles

A continuación se describe cada ruta, el método HTTP asociado y su propósito.

| Ruta                                        | Método | Consumes           | Produces           | Descripción                                                 |
| ------------------------------------------- | ------ | ------------------ | ------------------ | ----------------------------------------------------------- |
| `/auth`                                     | POST   | `application/json` | `application/json` | Autenticación. Recibe credenciales y devuelve un token JWT. |
|                                             |        |                    |                    |                                                             |
| **Info de emergencia**                      |        |                    |                    |                                                             |
| `/info-emergencia`                          | POST   | `application/json` | `application/json` | Crea un registro de info de emergencia para un usuario.     |
| `/info-emergencia`                          | GET    | —                  | `application/json` | Lista todos los registros de info de emergencia.            |
| `/info-emergencia/usuario/{usuarioId}`      | GET    | —                  | `application/json` | Recupera la info de emergencia de un usuario específico.    |
| `/info-emergencia/usuario/{usuarioId}`      | PUT    | `application/json` | `application/json` | Actualiza la info de emergencia de un usuario.              |
| `/info-emergencia/usuario/{usuarioId}`      | DELETE | —                  | —                  | Elimina la info de emergencia de un usuario.                |
|                                             |        |                    |                    |                                                             |
| **Contactos de emergencia**                 |        |                    |                    |                                                             |
| `/contactos-emergencia`                     | POST   | `application/json` | `application/json` | Agrega un contacto de emergencia.                           |
| `/contactos-emergencia`                     | GET    | —                  | `application/json` | Lista todos los contactos de emergencia.                    |
| `/contactos-emergencia/usuario/{usuarioId}` | GET    | —                  | `application/json` | Lista los contactos de emergencia de un usuario.            |
| `/contactos-emergencia/usuario/{usuarioId}` | PUT    | `application/json` | `application/json` | Actualiza un contacto existente de un usuario.              |
| `/contactos-emergencia/usuario/{usuarioId}` | DELETE | —                  | —                  | Elimina un contacto de emergencia de un usuario.            |
|                                             |        |                    |                    |                                                             |
| **Info médica**                             |        |                    |                    |                                                             |
| `/info-medica`                              | POST   | `application/json` | `application/json` | Crea un registro de info médica para un usuario.            |
| `/info-medica`                              | GET    | —                  | `application/json` | Lista todos los registros de info médica.                   |
| `/info-medica/usuario/{usuarioId}`          | GET    | —                  | `application/json` | Recupera la info médica de un usuario específico.           |
| `/info-medica/usuario/{usuarioId}`          | PUT    | `application/json` | `application/json` | Actualiza la info médica de un usuario.                     |
| `/info-medica/usuario/{usuarioId}`          | DELETE | —                  | —                  | Elimina la info médica de un usuario.                       |
|                                             |        |                    |                    |                                                             |
| **Medicamentos**                            |        |                    |                    |                                                             |
| `/medicamentos`                             | POST   | `application/json` | `application/json` | Crea un nuevo medicamento.                                  |
| `/medicamentos`                             | GET    | —                  | `application/json` | Lista todos los medicamentos.                               |
| `/medicamentos/{id}`                        | GET    | —                  | `application/json` | Obtiene los datos de un medicamento por ID.                 |
| `/medicamentos/usuario/{usuarioId}`         | GET    | —                  | `application/json` | Lista medicamentos asociados a un usuario.                  |
| `/medicamentos/{id}`                        | PUT    | `application/json` | `application/json` | Actualiza un medicamento existente.                         |
| `/medicamentos/{id}`                        | DELETE | —                  | —                  | Elimina un medicamento por ID.                              |

---

### Notas

- Todos los endpoints que consumen `application/json` esperan un body válido.
- Asegúrate de incluir el header `Authorization: Bearer <token>` tras autenticación para rutas que lo requieran.
- En modo dev, el log de Quarkus mostrará las rutas y detalles de cada petición.

¡Listo! Con esto tienes una guía rápida para iniciar y usar la API en desarrollo.

