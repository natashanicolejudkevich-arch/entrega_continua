FROM node:20-alpine AS base

# Etapa 1: Instalar dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Etapa 2: Construir la aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: Imagen de Producción, copiar solo lo necesario
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copiar la carpeta public (si la hay) y los archivos de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# IMPORTANTE: Copiamos la carpeta src para que los archivos JSON locales (base de datos)
# sigan estando accesibles en tiempo de ejecución para tu API.
COPY --from=builder /app/src ./src

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
