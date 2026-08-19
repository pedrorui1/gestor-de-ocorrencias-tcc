const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Neon (substitua pela sua string nas variáveis de ambiente)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rota para listar ocorrências
app.get('/api/ocorrencias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ocorrencias ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para salvar uma ocorrência
app.post('/api/ocorrencias', async (req, res) => {
  const { aluno, tipo, descricao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ocorrencias (aluno, tipo, descricao) VALUES ($1, $2, $3) RETURNING *',
      [aluno, tipo, descricao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para excluir uma ocorrência
app.delete('/api/ocorrencias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ocorrencias WHERE id = $1', [id]);
    res.json({ message: 'Ocorrência excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(...)); // Remova ou comente esta linha
module.exports = app; // Adicione isso na última linha do arquivo
