# COMO CONFIGURAR SEU PRÓPRIO FIREBASE

## Passo 1: Criar Projeto no Firebase
1. Acesse https://console.firebase.google.com/
2. Clique em "Criar projeto"
3. Dê um nome ao projeto (ex: "meu-biopage")
4. Siga as instruções na tela

## Passo 2: Adicionar App Web
1. No painel do Firebase, clique em "Adicionar app" (ícone </>)
2. Registre o app com um nome (ex: "Biopage")
3. Copie as configurações que aparecem

## Passo 3: Configurar Banco de Dados
1. No menu esquerdo, clique em "Realtime Database"
2. Clique em "Criar banco de dados"
3. Escolha uma região (ex: southamerica-east1 para Brasil)
4. Na regras de segurança, configure:
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
5. Clique em "Publicar"

## Passo 4: Editar Configurações
1. Abra o arquivo `firebase-config.js`
2. Substitua TODOS os valores pelos que você copiou:

Substitua:
apiKey: "SUA_API_KEY_AQUI"
por:
apiKey: "AIzaSySuaChaveRealAqui12345"

Faça isso para TODOS os campos:
- apiKey
- authDomain
- projectId
- storageBucket
- messagingSenderId
- appId

## Passo 5: Testar
1. Salve o arquivo
2. Abra o index.html no navegador
3. Verifique se o contador de visitas está funcionando