const Sequelize = require("sequelize")
const connection = require("./database")

const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING,
        allwNull:false

    },
    descricao:{
        type:Sequelize.TEXT,
        allwNull:false
    }
});

Pergunta.sync({force: false}).then(() => {})//caso a tabela ja exista, não força
module.exports = Pergunta