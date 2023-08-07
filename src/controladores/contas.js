let { contas, saques, depositos, transferencias } = require('../bancodedados');
const listarContasBancarias = (req, res) => {
    const listaDeContas = contas;
    return res.status(200).json(listaDeContas);
};

const FormatarData = (data) => {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    const segundo = data.getSeconds().toString().padStart(2, '0');
  
    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
  };

const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ mensagem: 'O nome é obrigatório.' });
    };

    if (!data_nascimento || data_nascimento.trim() === "") {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória.' });
    };

    if (!telefone || telefone.trim() === "") {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório.' });
    };

    if (!email || email.trim() === "") {
        return res.status(400).json({ mensagem: 'O email é obrigatório.' });
    };

    if (!senha || senha.trim() === "") {
        return res.status(400).json({ mensagem: 'A senha é obrigatória.' });
    };


    let numero = contas.length;
    const infoConta = {
        numero: numero + 1,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };
    contas.push(infoConta);
    return res.status(201).json(infoConta);
}

const atualizarContaBancaria = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'O número de conta não existe.' });
    };

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Você precisa mudar pelo menos um dos campos.' });
    };

    if (nome) {
        conta.usuario.nome = nome;
    };

    if (cpf) {
        conta.usuario.cpf = cpf;
    };

    if (data_nascimento) {
        conta.usuario.data_nascimento = data_nascimento;
    };

    if (telefone) {
        conta.usuario.telefone = telefone;
    };

    if (email) {
        conta.usuario.email = email;
    };

    if (senha) {
        conta.usuario.senha = senha;
    };


    return res.status(203).json({ mensagem: 'Conta atualizada com sucesso.' });
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta não existe.' });
    };

    if (conta.saldo === 0) {
        contas = contas.filter((conta) => {
            return conta.numero !== Number(numeroConta);
        });
        return res.status(200).json({ Mensagem: 'Conta excluida com sucesso.' });
    } else {
        return res.status(400).json({ mensagem: 'O seu saldo precisa estar zerado para efetuar a exclusão.' });
    };


};

const depositarSaldo = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta) {
        res.status(400).json({ mensagem: 'Você precisa informar o numero da conta.' });
    };

    if (valor === undefined || valor === null) {
        res.status(400).json({ mensagem: 'Você precisa informar o valor do depósito.' });
    };

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta não existe.' });
    };

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor precisa ser maior que 0.' });
    };

    conta.saldo += valor;
    const registroDeposito = new Date();
    const registroDepositoFormatado = FormatarData(registroDeposito);
    depositos.push({
        data: registroDepositoFormatado,
        numero_conta,
        valor
    });
    
    
    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso.' });
};

const sacarSaldo = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta) {
        res.status(400).json({ mensagem: 'Você precisa informar o numero da conta.' });
    };

    if (valor === undefined || valor === null) {
        res.status(400).json({ mensagem: 'Você precisa informar o valor do saque.' });
    };

    if (!senha) {
        return res.status(401).send({ mensagem: 'A senha não foi informada.' });
    };

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'A conta não existe.' });
    };

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor precisa ser maior que 0.' });
    };

    if (valor > conta.saldo) {
        return res.status(400).json({ mensagem: 'Você não tem saldo suficiente para efetuar o saque.' });
    };

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta. '}); 
    };

    conta.saldo -= valor;
    const registroSaque = new Date();
    const registroSaqueFormatado = FormatarData(registroSaque);
    saques.push({
        data: registroSaqueFormatado,
        numero_conta,
        valor
    });

    return res.status(200).json({ mensagem: 'Saldo realizado com sucesso.' });
};

const transferirSaldo = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha} = req.body;
    if (!numero_conta_origem) {
        res.status(400).json({ mensagem: 'Você precisa informar o numero da conta origem.' });
    };

    if (!numero_conta_destino) {
        res.status(400).json({ mensagem: 'Você precisa informar o numero da conta destino.' });
    };

    if (valor === undefined || valor === null) {
        res.status(400).json({ mensagem: 'Você precisa informar o valor da transferência.' });
    };

    if (!senha) {
        return res.status(401).send({ mensagem: 'A senha não foi informada.' });
    };

    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });

    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    });

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Conta origem não existe.' });
    };

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Conta destino não existe.' });
    };

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta. '});
    };

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor precisa ser maior que 0.' });
    };

    if (valor > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Você não tem saldo suficiente para efetuar a transferência.' });
    };

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const registroTransferencia = new Date();
    const registroTransferenciaFormatado = FormatarData(registroTransferencia);
    transferencias.push({
        data: registroTransferenciaFormatado,
        numero_conta_origem,
        numero_conta_destino,
        valor
    });
    
    return res.status(200).json({ mensagem: 'Transferência realizada com sucesso.' });
};

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O numero da conta não foi informado.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha da conta não foi informada.' });
    }

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'conta não existe.' });
    };

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta. '}); 
    };

    return res.status(200).json(conta.saldo);

};

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O numero da conta não foi informado.' });
    };

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha da conta não foi informada.' });
    };

    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'conta não existe.' });
    };

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta. '});
    };


    const extrato = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: [],
    }

    saques.forEach((saque) => {
        if (saque.numero_conta === numero_conta) {
            extrato.saques.push({ data: saque.data, numero_conta, valor: saque.valor });
        };
    });

    depositos.forEach((deposito) => {
        if (deposito.numero_conta === numero_conta) {
            extrato.depositos.push({ data: deposito.data, numero_conta, valor: deposito.valor });
        };
    });

    transferencias.forEach((transferencia) => {
        if (transferencia.numero_conta_origem === numero_conta) {
            extrato.transferenciasEnviadas.push({ data: transferencia.data, numero_conta_origem: numero_conta, numero_conta_destino: transferencia.numero_conta_destino, valor: transferencia.valor });
        };

        if (transferencia.numero_conta_destino === numero_conta) {
            extrato.transferenciasRecebidas.push({ data: transferencia.data, numero_conta_origem: transferencia.numero_conta_origem, numero_conta_destino: numero_conta, valor: transferencia.valor });
        };

    });

    return res.status(200).json(extrato);
}

module.exports = { listarContasBancarias, criarContaBancaria, atualizarContaBancaria, excluirConta, depositarSaldo, sacarSaldo, transferirSaldo, consultarSaldo, consultarExtrato };