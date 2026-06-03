#!/bin/bash
# Levanta el servidor de DB (Prisma) + Next.js dev con un solo comando.
# Requiere Node 22 para el servidor de Prisma (nvm).

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

echo "▶ Iniciando servidor Prisma Postgres (Node 22)..."
nvm exec lts/jod node_modules/.bin/prisma dev &
PRISMA_PID=$!

# Espera a que el servidor esté listo
sleep 6

echo "▶ Iniciando Next.js dev server..."
npm run dev --prefix .

# Al salir de Next.js, también para Prisma
kill $PRISMA_PID 2>/dev/null
