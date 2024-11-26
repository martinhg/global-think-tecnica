<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Global Think Technology - Prueba técnica

### Ejecutar en modo desarrollo

1. Clonar el repositorio

2. Tener instalado NestJs
```
npm i -g @nestjs/cli
```

3. Tener instalado Docker (ir a su documentación)

4. Ejecutar el comando
```
npm install
```

5. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```

6. Levantar la base de datos
```
docker-compose up -d
```

7. Levantar el proyecto en el modo desarrollo
```
npm run start:dev
```

8. Documentación disponible en
```
http://localhost:3000/api-docs
```

## Stack usado
* MongoDB
* NestJs
* Joi
* Mongoose
* Class-validator y class-transformer
* Swagger