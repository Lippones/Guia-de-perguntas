const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const perguntaModel = require('./database/Pergunta')
const RespostaModel = require('./database/Resposta')
const Resposta = require('./database/Resposta')


connection
    .authenticate()
    .then(()=>{
        console.log('Conectado ao banco de dados')
    })
    .catch((err)=>{
        console.log(err)
    })


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    perguntaModel.findAll({raw:true, order:[
        ['id','DESC']
    ]}).then(perguntas=>{
        res.render('index',{
            perguntas,
        })
    })
})

app.get('/perguntar',(req,res)=>{
    res.render('perguntar')
})
app.post("/salvarpergunta",(req,res)=>{
    let titulo = req.body.titulo
    let descricao = req.body.descricao
    console.log(descricao)
    perguntaModel.create({
        titulo,
        descricao
    }).then(()=>{
        res.redirect('/')
    })
})

app.get('/pergunta/:id',(req,res)=>{

    perguntaModel.findOne({
        where:{
            id:req.params.id
        }
    }).then(pergunta=>{
        if(pergunta!=undefined){

            Resposta.findAll({
                where:{
                    perguntaId:pergunta.id
                },
                order: [
                    ['id','DESC']
                ]
            }).then(respostas=>{
                res.render("pergunta",{
                    pergunta,
                    respostas
                })
            })
        }else{
            res.redirect('/')
        }
    })
})

app.post('/responder', (req,res)=>{
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta

    Resposta.create({
        corpo,
        perguntaId
    }).then(()=>{
        res.redirect(`/pergunta/${perguntaId}`)
    })
})
app.listen(3333, ()=>{
    console.log("Server is running on port 3333")
})