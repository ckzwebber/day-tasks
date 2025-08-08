FROM node:20 AS builder
WORKDIR /app

# Copia apenas os arquivos de dependências para otimizar o cache
COPY package*.json tsconfig.json ./

# Instala todas as dependências (incluindo dev) para poder buildar
RUN npm install

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN npm run build

# -----------------------------
# Imagem final para produção
FROM node:20 AS runner
WORKDIR /app

# Copia apenas o necessário da build
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Define variáveis de ambiente padrão
ENV NODE_ENV=production

# Expõe a porta que o app escuta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/index.js"]
