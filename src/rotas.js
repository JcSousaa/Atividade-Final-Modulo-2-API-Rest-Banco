const express = require('express');
const { listarContas, validarPreenchimentoBody, adicionarConta, atualizarConta, excluirConta, validarContaExiste, depositar, sacar, transferir, saldo, extrato } = require('./controladores/bancodedados');
const rotas = express.Router();



rotas.get("/contas", listarContas);
rotas.post("/contas", validarPreenchimentoBody, adicionarConta);
rotas.put("/contas/:numeroConta/usuario", validarContaExiste, validarPreenchimentoBody, atualizarConta);
rotas.delete("/contas/:numeroConta", validarContaExiste, excluirConta);
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", sacar);
rotas.post("/transacoes/transferir", transferir);
rotas.get("/contas/saldo", saldo);
rotas.get("/contas/extrato", extrato);
module.exports = rotas;