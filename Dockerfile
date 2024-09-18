# use the official image of nodej.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package.json yarn.lock ./

# Instalar las dependencias usando Yarn
RUN yarn install --frozen-lockfile

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que la aplicación se ejecutará (por defecto 4000 para NestJS)
EXPOSE 4000


# Comando para iniciar la aplicación con Yarn
CMD ["yarn", "start:prod"]