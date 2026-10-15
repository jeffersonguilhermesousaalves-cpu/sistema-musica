const express = require('express');
const cors = require('cors');
const conexao = require('./db.js');
const e = require('express');

const app = express();
const PORTA = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API de música funcionando!" });
});

app.get("/artistas", (req, res) => {
    const sql = "SELECT * FROM artistas";

    conexao.query(sql, (erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar artistas." });
        }
        res.status(200).json(resultados);
    })
})

app.get("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql = `SELECT * FROM artistas WHERE id = ${id}`;

    conexao.query(sql, [id],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar artistas." });
        }
        if (resultados.length === 0){
            return res.status(404).json({ erro: "Artista não encontrado." });
        }
        res.status(200).json(resultados[0]);
    })
});
app.post("/artistas", (req, res) => {
    const {nome, genero, pais} = req.body;

    if (!nome || !genero || !pais) {
        return res.status(400).json({
            mensagem: "Informe nome, genero e pais"
        });
    }

    const sql = "INSERT INTO artistas (nome, genero, pais) VALUES (?, ?, ?)";
    conexao.query(sql, [nome, genero, pais],(erro, resultados) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao listar artistas." });
        }
        if (resultados.length === 0){
            return res.status(404).json({ erro: "Artista não encontrado." });
        }
        res.status(201).json({Mensagem: "Artista cadastrado com sucesso!",
        id: resultados.insertId
        });
    })
})

app.delete("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const sql =`DELETE FROM artistas WHERE id = ?`;
    conexao.query(sql,[id],(erro, resultado) =>{
        if(erro){
            return res.status(500).json({ erro: "Erro ao deletar artista." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Artista não encontrado."
            });
        
        };
        res.status(200).json({ msg: "Artista deletado com sucesso!" });
    });
});

app.put("/artistas/:id", (req, res) => {
    const id = Number(req.params.id);
    const {nome, genero, pais} = req.body;
     if (!nome || !genero || !pais) {
        return res.status(400).json({
            mensagem: "Informe nome, genero e pais"
        });
    }
    const sql = "UPDATE artistas SET nome = ?, genero = ?, pais = ? WHERE id = ?";
    conexao.query(sql, [nome, genero, pais, id], (erro, resultado) => {
        if (erro){
            return res.status(500).json({ erro: "Erro ao atualizar artista." });
        }
        if(resultado.affectedRows === 0){
            return res.status(404).json({
                msg: "Artista não encontrado."
            });
        };
        res.status(200).json({ msg: "Artista atualizado com sucesso!" });
    })
});    
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
})