const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");



//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão Feita")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

//Estou falando para o Express usar o EJS como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get("/",(req, res) => {
    Pergunta.findAll( {raw : true, order:[
        ['id', 'DESC'] //ASC CRESCENTE, DES DECRECESTE
    ]}).then(perguntas => {// SELECT * ALL FROM perguntas
        
    res.render("index",{
        perguntas: perguntas
    });
    }) 

});
app.get("/perguntar",(req, res) => {
    res.render("perguntar")
});

app.post("/salvarPergunta",(req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/"); //Depois de salvar, redirecionar
    });

});

app.post("/responder",(req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    
    Resposta.create({
        corpo:corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
        console.log(corpo)
    })
})
app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Pergunta.findOne({ //Buscar um dado
        where: {id :id}
    }).then(pergunta => {
        if(pergunta != undefined){ //Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas: respostas
                });
            })
           
        }else{//Não encontrada
            res.redirect("/");

        }
    });
})

app.listen(1000,()=>{
    console.log("Rondando")
})