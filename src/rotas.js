const express = require('express')
const rotas = express();
const { listarContasBancarias, criarContaBancaria, atualizarContaBancaria, excluirConta, depositarSaldo, sacarSaldo, transferirSaldo, consultarSaldo, consultarExtrato } = require('./controladores/contas')
const { validarSenha, validarEmail, validarCpf, validarCpfNaAtualizacao, validarEmailNaAtualizacao } = require('./intermediarios');

rotas.get('/contas', validarSenha, listarContasBancarias);
rotas.post('/contas', validarCpf, validarEmail, criarContaBancaria);
rotas.put('/contas/:numeroConta/usuario', validarCpfNaAtualizacao, validarEmailNaAtualizacao, atualizarContaBancaria);
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post('/transacoes/depositar', depositarSaldo);
rotas.post('/transacoes/sacar', sacarSaldo);
rotas.post('/transacoes/transferir', transferirSaldo);
rotas.get('/contas/saldo', consultarSaldo);
rotas.get('/contas/extrato', consultarExtrato);
module.exports = rotas;