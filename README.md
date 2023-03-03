![image](https://user-images.githubusercontent.com/112031138/222728001-d781d97e-9200-4f2a-b25b-a6046d6254b9.png)

# Atividade Final do Módulo 2

Este é o Projeto Final do Módulo 2 do curso de Programação Backend, ministrado pela Cubos Academy.
Consiste em uma API para Banco Digital que permite:

-   Criar conta bancária
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

Foi um projeto muito realizador e envolveu todos os conteúdos que havia visto do curso até o momento.

## Persistências dos dados

Os dados foram persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. 

### Estrutura do objeto no arquivo `bancodedados.js`

```javascript
{
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```
![image](https://user-images.githubusercontent.com/112031138/222761295-21ddafd5-86c2-415a-ac92-89d2ccce64e1.png)
![image](https://user-images.githubusercontent.com/112031138/222761481-59500fb8-fdd8-41b3-b46f-35b98189abad.png)
![image](https://user-images.githubusercontent.com/112031138/222761632-2766db2b-8453-4b10-b973-6b235ac4cf29.png)
![image](https://user-images.githubusercontent.com/112031138/222760771-993c0990-8681-4189-a853-80ab631ac239.png)


## Endpoint 01

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Este endpoint lista todas as contas bancárias existentes.Verifica se a senha do banco foi informada (passado como query params na url) e valida se a senha do banco está correta.

-   **Requisição** - query params (respeitando este nome)

    -   senha_banco

-   **Resposta**
    -   listagem de todas as contas bancárias existentes

#### Exemplo de resposta

```javascript
// HTTP Status 200 / 201 / 204
// 2 contas encontradas
[
    {
        "numero": "1",
        "saldo": 0,
        "usuario": {
            "nome": "Foo Bar",
            "cpf": "00011122233",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar.com",
            "senha": "1234"
        }
    },
    {
        "numero": "2",
        "saldo": 1000,
        "usuario": {
            "nome": "Foo Bar 2",
            "cpf": "00011122234",
            "data_nascimento": "2021-03-15",
            "telefone": "71999998888",
            "email": "foo@bar2.com",
            "senha": "12345"
        }
    }
]

// nenhuma conta encontrada
[]
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A senha do banco informada é inválida!"
}
```

## Endpoint 02

### Criar conta bancária

#### `POST` `/contas`

Esse endpoint cria uma conta bancária, onde é gerado um número único para identificação da conta (número da conta). A conta é criada com saldo inicial igual a 0.

-   **Requisição** - O corpo (body) deve possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf (campo único)
    -   data_nascimento
    -   telefone
    -   email (campo único)
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta é um ***status code*** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que  possui como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /contas
{
    "nome": "Foo Bar 2",
    "cpf": "00011122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar2.com",
    "senha": "12345"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
}
```

## Endpoint 03

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Este endpoint atualiza apenas os dados do usuário de uma conta bancária. 

    -   Verifica se foi passado todos os campos no body da requisição
    -   Verifica se o numero da conta passado como parametro na URL é válida
    -   Se o CPF for informado, verifica se já existe outro registro com o mesmo CPF
    -   Se o E-mail for informado, verifica se já existe outro registro com o mesmo E-mail
    -   Atualiza os dados do usuário de uma conta bancária
    
-   **Requisição** - O corpo (body) deve possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

-   **Resposta**

    Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
    Em caso de **falha na validação**, a resposta possui ***status code*** apropriado, e em seu corpo (body)  um objeto com uma propriedade **mensagem** que  possui como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição
```javascript
// PUT /contas/:numeroConta/usuario
{
    "nome": "Foo Bar 3",
    "cpf": "99911122234",
    "data_nascimento": "2021-03-15",
    "telefone": "71999998888",
    "email": "foo@bar3.com",
    "senha": "12345"
{
```


#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O CPF informado já existe cadastrado!"
}
```

## Endpoint 04

### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Este endpoint exclui uma conta bancária existente. 

    -   Verifica se o numero da conta passado como parametro na URL é válido
    -   Permite excluir uma conta bancária apenas se o saldo for 0 (zero)
    -   Remove  a conta do objeto de persistência de dados.
    
-   **Requisição**

    -   Numero da conta bancária (passado como parâmetro na rota)

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "A conta só pode ser removida se o saldo for zero!"
}
```
## Endpoint 05

### Depositar

#### `POST` `/transacoes/depositar`

Este endpoint somar o valor do depósito ao saldo de uma conta válida e registra essa transação. 

    -   Verifica se o numero da conta e o valor do deposito foram informados no body
    -   Verifica se a conta bancária informada existe
    -   Não permite depósitos com valores negativos ou zerados
    -   Soma o valor de depósito ao saldo da conta encontrada
    
-   **Requisição** - O corpo (body) deve possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor

#### Exemplo de Requisição
```javascript
// POST /transacoes/depositar
{
	"numero_conta": "1",
	"valor": 1900
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O número da conta e o valor são obrigatórios!"
}
```

#### Exemplo do registro de um depósito

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```
## Endpoint 06

### Sacar

#### `POST` `/transacoes/sacar`

Este endpoint realiza o saque de um valor em uma determinada conta bancária e registra essa transação. 

    -   Verifica se o numero da conta, o valor do saque e a senha foram informados no body
    -   Verifica se a conta bancária informada existe
    -   Verifica se a senha informada é uma senha válida para a conta informada
    -   Verifica se há saldo disponível para saque
    -   Subtrai o valor sacado do saldo da conta encontrada

-   **Requisição** - O corpo (body) deve possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha


#### Exemplo de Requisição
```javascript
// POST /transacoes/sacar
{
	"numero_conta": "1",
	"valor": 1900,
    "senha": "123456"
}
```
#### Exemplo de Resposta
```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O valor não pode ser menor que zero!"
}
```

#### Exemplo do registro de um saque

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta": "1",
    "valor": 10000
}
```

## Endpoint 07

### Tranferir

#### `POST` `/transacoes/transferir`

Este endpoint  permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.

    -   Verifica se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body
    -   Verifica se a conta bancária de origem informada existe
    -   Verifica se a conta bancária de destino informada existe
    -   Verifica se a senha informada é uma senha válida para a conta de origem informada
    -   Verifica se há saldo disponível na conta de origem para a transferência
    -   Subtrai o valor da transfência do saldo na conta de origem
    -   Soma o valor da transferência no saldo da conta de destino

-   **Requisição** - O corpo (body) deve possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha


#### Exemplo de Requisição
```javascript
// POST /transacoes/transferir
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}
```
#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Saldo insuficiente!"
}
```

#### Exemplo do registro de uma transferência

```javascript
{
    "data": "2021-08-10 23:40:35",
    "numero_conta_origem": "1",
    "numero_conta_destino": "2",
    "valor": 10000
}
```

## Endpoint 08

### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Este endpoint  retorna o saldo de uma conta bancária.

    -   Verifica se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verifica se a conta bancária informada existe
    -   Verifica se a senha informada é uma senha válida
    -   Exibe o saldo da conta bancária em questão

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**

    -   Saldo da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
    "saldo": 13000
}
```
```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

## Endpoint 09

### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Este endpoint  lista as transações realizadas de uma conta específica.

    -   Verifica se o numero da conta e a senha foram informadas (passado como query params na url)
    -   Verifica se a conta bancária informada existe
    -   Verifica se a senha informada é uma senha válida
    -   Retorna a lista de transferências, depósitos e saques da conta em questão.

-   **Requisição** - query params

    -   numero_conta
    -   senha

-   **Resposta**
    -   Relatório da conta

#### Exemplo de Resposta

```javascript
// HTTP Status 200 / 201 / 204
{
  "depositos": [
    {
      "data": "2021-08-18 20:46:03",
      "numero_conta": "1",
      "valor": 10000
    },
    {
      "data": "2021-08-18 20:46:06",
      "numero_conta": "1",
      "valor": 10000
    }
  ],
  "saques": [
    {
      "data": "2021-08-18 20:46:18",
      "numero_conta": "1",
      "valor": 1000
    }
  ],
  "transferenciasEnviadas": [
    {
      "data": "2021-08-18 20:47:10",
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 5000
    }
  ],
  "transferenciasRecebidas": [
    {
      "data": "2021-08-18 20:47:24",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    },
    {
      "data": "2021-08-18 20:47:26",
      "numero_conta_origem": "2",
      "numero_conta_destino": "1",
      "valor": 2000
    }
  ]
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Conta bancária não encontada!"
}
```

###### tags: `back-end` `módulo 2` `nodeJS` `API REST` `desafio`



