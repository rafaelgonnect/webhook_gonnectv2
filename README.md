# Webhook V2

Versão simplificada e refatorada do webhook, projetada para deploy fácil no Easypanel.

## Funcionalidades

- Endpoint `/webhook` para receber, logar e salvar eventos em um banco de dados MongoDB.
- Endpoint `/health` para monitoramento de saúde, compatível com Easypanel.
- Estrutura de código mínima e focada.
- Dockerfile otimizado para segurança e performance.

## Como Rodar Localmente

1.  **Clone o repositório:**
    ```sh
    git clone <url-do-seu-repositorio>
    cd webhook_v2
    ```

2.  **Crie um arquivo `.env`** a partir do exemplo:
    ```sh
    cp .env.example .env
    ```

3.  **Edite o arquivo `.env`** e adicione sua string de conexão do MongoDB:
    ```
    PORT=3000
    MONGODB_URI="sua_string_de_conexao_aqui"
    ```

4.  **Instale as dependências:**
    ```sh
    npm install
    ```

5.  **Inicie o servidor:**
    ```sh
    npm start
    ```

## Deploy no Easypanel

1.  **Crie um novo projeto** no Easypanel, linkando para o seu repositório do GitHub.

2.  **Configure o Build:**
    - **Build Type:** `Dockerfile`
    - **Dockerfile Path:** `./Dockerfile` (ou apenas `Dockerfile`)

3.  **Configure as Variáveis de Ambiente:**
    - Vá para a aba "Environment Variables".
    - Adicione as seguintes variáveis:
      - `PORT`: `3000`
      - `MONGODB_URI`: `sua_string_de_conexao_do_mongodb`

4.  **Configure a Porta:**
    - Na aba "Settings", garanta que a porta exposta (Exposed Port) é `3000`.

5.  **Clique em "Deploy".**

O Easypanel irá construir a imagem Docker a partir do `Dockerfile` e iniciar o container com as variáveis de ambiente que você forneceu. O Health Check (`/health`) garantirá que o deploy só seja considerado bem-sucedido quando a aplicação estiver pronta e conectada ao banco de dados.
