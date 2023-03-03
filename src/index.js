const express = require("express");
const validaSenha = require("./intermediario");
const rotas = require("./rotas");


const app = express();

app.use(express.json());
app.use(validaSenha);
app.use(rotas);

app.listen(3000);
