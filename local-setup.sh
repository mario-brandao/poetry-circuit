#!/bin/bash

# Criar a chave raiz e o certificado
echo "Criando o certificado raiz..."
openssl genrsa -out root.key 2048
openssl req -x509 -new -nodes -key root.key -sha256 -days 365 -out root.crt -subj "/CN=localhost"

# Criar a chave e o certificado do servidor
echo "Criando o certificado do servidor..."
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/CN=localhost"
openssl x509 -req -in server.csr -CA root.crt -CAkey root.key -CAcreateserial -out server.crt -days 365 -sha256

# Criar o arquivo do servidor
echo "Criando o arquivo server.js..."
cat <<EOL > server.js
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

app.get('/', (req, res) => {
    res.send('Hello, HTTPS World!');
});

https.createServer(options, app).listen(443, () => {
    console.log('Servidor rodando em https://localhost:443');
});
EOL

# Adicionar o certificado raiz ao sistema (apenas para macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Adicionando o certificado raiz ao sistema (macOS)..."
  sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" root.crt
fi

echo "Servidor pronto! Execute o comando abaixo para iniciar o servidor:"
echo "node server.js"
