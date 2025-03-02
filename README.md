# Rutas de los endpoinst para los usuarios de tipo inversores

### Obtener todos los inversores
- **Método**: `GET`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/`
- **Descripción**: Lista todos los usuarios

### Registar inversores, clientes
- **Método**: `POST`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/`
- **Descripción**: Registra un inversor,admin, o cliente
- **BodyEjemplo**:
{
  "nombre": "John",
  "apellido": "Doe",
  "correo": "johndofdef@example.comf",
  "codigo_pais": "+1",
  "numero_telefono": "1234567890",
  "pais_residencia": "USA",
  "password": "securepassword123",
  "acepta_terminos": "1",
  "categoria_persona_id":1,
  "rol": "cliente || inversor || admin"
}

### modifica inversores
- **Método**: `PUT`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/investors/id_usuario`
- **Descripción**: Modifica un inversor
- **BodyEjemplo**:
{
  "nombre": "Johnfdsfdsfdsfds",
  "apellido": "Doefdsfdsfds",
  "numero_telefono": "1234567890fdsfdsa",
  "pais_residencia": "USAfdsafds"
}

### modifica el estado de un inversores
- **Método**: `PUT`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/Stateinvestors/id = id del inversor`
- **Descripción**: Modifica el estado de un inversor

### agrega informacion del cliente
- **Método**: `POST`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/info`
- **Descripción**: agrega la tabla informacion a un cliente

### Editar informacion del cliente
- **Método**: `PUT`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/info/id = id del cliente`
- **Descripción**: Modifica la informacion del cliente

### Muestra informacion del cliente por su id
- **Método**: `GET`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/clients/info/id = id del cliente`
- **Descripción**: Modifica la informacion del cliente

### cargar imagen del cliente al servidor
- **Método**: `POST`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/upload/id = colocar el id del cliente`
- **Descripción**: Guarda una imagen en els ervidor en la carpeta uploads/images y ademas agrega el nombre de la imagen encripatada a la tabla de usuarios en imagen

### Url de la imagen del cliente del servidor
- **Método**: `GET`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/image/id = colocar el id del cliente`
- **Descripción**: Crea un enlace para acceder a la imagen dels ervidor

### Obtiene los clientes con su informacion
- **Método**: `GET`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/clients/all`
- **Descripción**: Obtiene cada usuario con su informacion

### Cargar imagen del cliente al servidor Cloudinary
- **Método**: `POST`
- **Ruta**: `https://apitalentos.pruebasdeploy.online/users/cloudinary/id=colocar el id del cliente`
- **Descripción**: Gaurda la imagen en el servidor Cloudinary opcional, tambien modifica la   base de datos del usuario para tener una referencia de la imagen


### NOTA:
- Agregar el campo "estado" de tipo tinyint(1) con valor por defecto de 1 en la tabla usuarios 
- Colocar unique en el nombre de categoria_personas
- crearse una cuenta en Cloudinary y colocar sus credenciales en el .env
