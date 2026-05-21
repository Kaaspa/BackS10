require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());
// Serve os arquivos da pasta 'public' (onde vai ficar nosso HTML)
app.use(express.static(path.join(__dirname, 'public')));

// CONEXÃO COM O BANCO DE DADOS
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado ao MongoDB Atlas!'))
    .catch(err => console.error('❌ Erro de conexão:', err));

// SCHEMA (Tratamento de dados)
const atletaSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    esportePrincipal: { type: String, required: true, enum: ['Futebol', 'Basquete', 'Vôlei', 'Outros'] },
    idade: { type: Number, min: 10, max: 100 }
}, { timestamps: true });

const Atleta = mongoose.model('Atleta', atletaSchema);

// ROTAS DA API
app.post('/api/atletas', async (req, res) => {
    try {
        const novoAtleta = new Atleta(req.body);
        const resultado = await novoAtleta.save();
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

app.get('/api/atletas', async (req, res) => {
    try {
        const atletas = await Atleta.find().sort({ createdAt: -1 }); // Mostra os mais recentes primeiro
        res.status(200).json(atletas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Painel de testes rodando em: http://localhost:${PORT}`);
});