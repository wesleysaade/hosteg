#!/bin/bash
# Mata qualquer processo na porta 3003 e reinicia o servidor
echo "Matando processos na porta 3003..."
lsof -ti :3003 | xargs kill -9 2>/dev/null
sleep 1
echo "Iniciando servidor..."
cd "$(dirname "$0")"
npm run dev -- -p 3003
