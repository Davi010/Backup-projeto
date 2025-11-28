FROM node:22

WORKDIR /app

# Copiar apenas os arquivos de dependências
COPY web/package*.json ./

# Remover package-lock.json se existir (para forçar reinstalação)
RUN rm -f package-lock.json || true

# Instalar dependências com flags para garantir dependências opcionais
RUN npm install --legacy-peer-deps --force

# Instalar explicitamente o rollup para Linux
RUN npm install --save-dev @rollup/rollup-linux-x64-gnu --legacy-peer-deps || true

# Copiar o código do projeto (mas não node_modules)
COPY web/ .
RUN rm -rf node_modules package-lock.json || true

# Reinstalar dependências no ambiente Linux
RUN npm install --legacy-peer-deps --force
RUN npm install --save-dev @rollup/rollup-linux-x64-gnu --legacy-peer-deps || true

# Expor a porta
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]