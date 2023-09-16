# myBank API

Esta é uma API RESTful feita para um banco digital. A API permite a realização de diversas operações bancárias, como listar contas, criar contas, realizar depósitos, saques, transferências, consultar saldos e emitir extratos.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

- `index.js`: O arquivo principal da aplicação.
- `servidor.js`: Configura o servidor Express.
- `rotas.js`: Define as rotas da API.
- `controladores/`: Pasta com os controladores para cada rota.
- `bancodedados.js`: Arquivo que simula a persistência de dados em memória.

## Rotas e Funcionalidades

### Listar Contas Bancárias

Endpoint: `GET /contas?senha_banco=senha-do-banco`

Esta rota permite listar todas as contas bancárias existentes.

Requisição:
- Parâmetro de query `senha_banco` para autenticar a operação.

### Criar Conta Bancária

Endpoint: `POST /contas`

Esta rota permite criar uma nova conta bancária.

Requisição:
- Corpo da requisição com os dados do usuário, como nome, CPF, data de nascimento, telefone, email e senha.

### Atualizar Dados do Usuário da Conta Bancária

Endpoint: `PUT /contas/:numeroConta/usuario`

Esta rota permite atualizar os dados do usuário de uma conta bancária.

Requisição:
- Parâmetro de rota `numeroConta` para identificar a conta.
- Corpo da requisição com os dados a serem atualizados.

### Excluir Conta Bancária

Endpoint: `DELETE /contas/:numeroConta`

Esta rota permite excluir uma conta bancária existente.

Requisição:
- Parâmetro de rota `numeroConta` para identificar a conta.

### Depositar

Endpoint: `POST /transacoes/depositar`

Esta rota permite realizar um depósito em uma conta bancária.

Requisição:
- Corpo da requisição com o número da conta e o valor a ser depositado.

### Sacar

Endpoint: `POST /transacoes/sacar`

Esta rota permite realizar um saque em uma conta bancária.

Requisição:
- Corpo da requisição com o número da conta, o valor a ser sacado e a senha.

### Transferir

Endpoint: `POST /transacoes/transferir`

Esta rota permite realizar uma transferência entre contas bancárias.

Requisição:
- Corpo da requisição com o número da conta de origem, o número da conta de destino, o valor a ser transferido e a senha.

### Consultar Saldo

Endpoint: `GET /contas/saldo?numero_conta=numero-da-conta&senha=senha-da-conta`

Esta rota permite consultar o saldo de uma conta bancária.

Requisição:
- Parâmetros de query `numero_conta` e `senha` para autenticar a operação.

### Emitir Extrato

Endpoint: `GET /contas/extrato?numero_conta=numero-da-conta&senha=senha-da-conta`

Esta rota permite emitir o extrato de transações de uma conta bancária.

Requisição:
- Parâmetros de query `numero_conta` e `senha` para autenticar a operação.

## Status Code

Os status codes utilizados pela API são os seguintes:

- 200 (OK)
- 201 (Created)
- 204 (No Content)
- 400 (Bad Request)
- 401 (Unauthorized)
- 403 (Forbidden)
- 404 (Not Found)
- 500 (Internal Server Error)
  
Lembre-se de verificar a documentação de cada rota para entender os requisitos específicos de validação e os campos necessários em cada requisição.

Este é um projeto piloto, e futuras funcionalidades podem ser adicionadas no futuro.
