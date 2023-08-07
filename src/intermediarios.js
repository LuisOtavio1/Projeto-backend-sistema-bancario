let {contas} = require('./bancodedados');

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).send({ mensagem: "A senha não foi informada." })
    };

    if (senha_banco !== "123") {
        return res.status(401).send({ mensagem: "A senha digitada está incorreta." });
    };

    next();
}

const validarCpf = (req, res, next) => {
    const { cpf } = req.body;
    if (!cpf || cpf.trim().length !== 11) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório e precisa ter 11 dígitos' });
    };   

    const cpfTemCadastro = contas.some((conta) => conta.usuario.cpf === cpf);
    if(cpfTemCadastro){
        return res.status(400).json({ mensagem: 'CPF já cadastrado' });
    };
        
        
    next();
};

const validarCpfNaAtualizacao = (req, res, next) => {
    const { cpf } = req.body;
    if (cpf && cpf.trim().length !== 11) {
        return res.status(400).json({ mensagem: 'O cpf precisa ter 11 dígitos' });
    };

    const cpfTemCadastro = contas.some((conta) => conta.usuario.cpf === cpf);
    if(cpfTemCadastro){
        return res.status(400).json({ mensagem: 'CPF já cadastrado' });
    };
        
        
    next();
};

const validarEmail = (req, res, next) => {
    const { email } = req.body;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const teste = regexEmail.test(email);

    if(!teste) {
        return res.status(400).json({ mensagem: 'Email inválido'});
    };

    const emailEmUso = contas.some((conta) => conta.usuario.email === email);
    if(emailEmUso){
        return res.status(400).json({ mensagem: 'Email já cadastrado' });
    };

    next();
}

const validarEmailNaAtualizacao = (req, res, next) => {
    const { email } = req.body;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const teste = regexEmail.test(email);

    if(email && !teste) {
        return res.status(400).json({ mensagem: 'Email inválido'});
    };

    const emailEmUso = contas.some((conta) => conta.usuario.email === email);
    if(emailEmUso){
        return res.status(400).json({ mensagem: 'Email já cadastrado' });
    };

    next();
}

module.exports = { validarSenha, validarCpf, validarCpfNaAtualizacao, validarEmail, validarEmailNaAtualizacao };