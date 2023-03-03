const { contas, depositos, saques, transferencias } = require('../dados/bancodedados');
const { format } = require('date-fns');

let idProximaConta = 1;

const listarContas = (req, res) => {
    return res.json(contas);
}

const validarPreenchimentoBody = (req, res, next) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "O nome deve ser informado." });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: "O CPF deve ser informado." });
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "A data de nascimento deve ser informada." });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "O telefone deve ser informado." });
    }

    if (!email) {
        return res.status(400).json({ mensagem: "O email deve ser informado." });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "A senha deve ser informada." });
    }
    return next();
}

const validarContaExiste = (req, res, next) => {

    const contaExistente = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if (!contaExistente) {
        res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    next();
}

const adicionarConta = (req, res) => {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const resultado = contas.find((conta) => {
        return conta.cpf === cpf
    })
    if (resultado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    const resultadoEmail = contas.find((conta) => {
        return conta.email === email
    })
    if (resultadoEmail) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    const novaConta = {
        numero: idProximaConta,
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        saldo: 0
    }

    idProximaConta++;

    contas.push(novaConta);

    return res.status(201).send();
}

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const resultado = contas.find((conta) => {
        return conta.cpf === cpf && (conta.numero != Number(req.params.numeroConta))
    })
    if (resultado) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    const resultadoEmail = contas.find((conta) => {
        return conta.email === email && (conta.numero != Number(req.params.numeroConta))
    })
    if (resultadoEmail) {
        return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
    }

    const contaExistente = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if (nome) {
        contaExistente.nome = nome;
    }

    if (cpf) {
        contaExistente.cpf = cpf;
    }

    if (data_nascimento) {
        contaExistente.data_nascimento = data_nascimento
    }

    if (telefone) {
        contaExistente.telefone = telefone;
    }

    if (email) {
        contaExistente.email = email;
    }

    if (senha) {
        contaExistente.senha = senha;
    }

    return res.status(201).send();
}

const excluirConta = (req, res) => {
    const indiceConta = contas.findIndex(conta => conta.numero === Number(req.params.numeroConta));

    if (contas[indiceConta].saldo > 0) {
        return res.status(404).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }

    contas.splice(indiceConta, 1);

    return res.status(201).send();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const resultado = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!resultado) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" });
    }

    resultado.saldo += valor;
    const novoDeposito = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    }

    depositos.push(novoDeposito);

    return res.status(201).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, valor e senha são obrigatórios!" });
    }

    const resultado = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!resultado) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (resultado.senha != senha) {
        return res.status(400).json({ mensagem: "A senha informada é inválida!" });
    }

    if (Number(valor) > resultado.saldo) {
        return res.status(400).json({ mensagem: "O valor informado é maior do que o saldo na conta" });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" });
    }

    resultado.saldo -= valor;

    const novoSaque = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor
    };

    saques.push(novoSaque);

    return res.status(201).send();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;


    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "O número da conta de origem, o número da conta de destino, valor e senha são obrigatórios!" });
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    })
    if (!contaOrigem) {
        return res.status(400).json({ mensagem: "Conta bancária de origem não encontrada!" });
    }

    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    })
    if (!contaDestino) {
        return res.status(400).json({ mensagem: "Conta bancária de destino não encontrada!" });
    }

    if (contaOrigem.senha != senha) {
        return res.status(400).json({ mensagem: "A senha informada é inválida!" });
    }

    if (Number(valor) > contaOrigem.saldo) {
        return res.status(400).json({ mensagem: "O valor informado é maior do que o saldo na conta de origem!" });
    }

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const novaTransferencia = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    transferencias.push(novaTransferencia);

    return res.status(201).send();
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e senha são obrigatórios!" });
    }

    const resultado = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!resultado) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (resultado.senha != senha) {
        return res.status(400).json({ mensagem: "A senha informada é inválida!" });
    }

    return res.status(201).json({ saldo: resultado.saldo });

}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e senha são obrigatórios!" });
    }

    const resultado = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    })
    if (!resultado) {
        return res.status(400).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (resultado.senha != senha) {
        return res.status(400).json({ mensagem: "A senha informada é inválida!" });
    }

    const resultadoDeposito = depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta
    })

    const resultadoSaque = saques.filter((saque) => {
        return saque.numero_conta === numero_conta
    })

    const resultadoTransferenciaEnviada = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta
    })

    const resultadoTransferenciaRecebida = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta
    })


    const novoExtrato = {
        depositos: resultadoDeposito,
        saques: resultadoSaque,
        transferenciasEnviadas: resultadoTransferenciaEnviada,
        transferenciasRecebidas: resultadoTransferenciaRecebida
    };

    if (!resultadoDeposito && !resultadoSaque && !resultadoTransferenciaEnviada && !resultadoTransferenciaRecebida) {
        return res.status(400).json({ mensagem: "Não há movimentação nessa conta" });
    }

    return res.status(200).json(novoExtrato);
}

module.exports = {
    listarContas,
    validarPreenchimentoBody,
    validarContaExiste,
    adicionarConta,
    atualizarConta,
    excluirConta,
    depositar,
    transferir,
    sacar,
    saldo,
    extrato
}