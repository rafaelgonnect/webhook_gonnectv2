# Estágio 1: Build - Instala dependências e prepara o ambiente
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --only=production

# Estágio 2: Produção - Cria a imagem final e enxuta
FROM node:18-alpine

WORKDIR /app

# Define o usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia as dependências instaladas do estágio de build
COPY --from=builder /app/node_modules ./node_modules

# Copia o código da aplicação
COPY index.js .
COPY .env.example .

# Define as permissões corretas para o usuário não-root
RUN chown -R appuser:appgroup /app

# Muda para o usuário não-root
USER appuser

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Healthcheck para o Easypanel
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD [ "node", "-e", "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" ]

# Comando para iniciar a aplicação
CMD [ "node", "index.js" ]
