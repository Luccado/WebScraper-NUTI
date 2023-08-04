//Importando express, axios, cheerio, fs e sqlite
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();


const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cria o file de database SQLITE
const dbConfig = {
  filename: './Teste3.db',
};

// Se o arquivo não existir, cria um arquivo vazio
async function checkAndCreateDatabase() {
  try {
    await fs.access(dbConfig.filename);
  } catch (error) {
    await fs.writeFile(dbConfig.filename, '');
  }
}

//conectando ao bd
const client = new sqlite3.Database(dbConfig.filename);

console.log('Conectado ao banco de dados!');

// Cria uma tabela chamada "tag_counts" para armazenar os dados, se ela não existir
const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tag_counts (
        id INTEGER PRIMARY KEY,
        tag_name TEXT,
        count INTEGER,
        url TEXT,
        test_date DATE,
        UNIQUE(tag_name, url)
      )
    `;

client.run(createTableQuery, (err) => {
  if (err) {
    console.error('Ocorreu um erro ao criar a tabela:', err);
  } else {
    console.log('Tabela "tag_counts" criada com sucesso!');
  }
  client.close();
  console.log('Conexão com o banco de dados fechada.');
});


async function writeToJSONFileAndInsertIntoDB(jsonResult, tagCounts, url, today = new Date()) {
  try {
    // Converte o objeto jsonResult em uma string JSON
    const jsonString = JSON.stringify(jsonResult, null, 2);

    await fs.writeFile('result.json', jsonString, 'utf8');
    console.log('Arquivo "result.json" foi criado com sucesso!');

    // Cria uma instância do cliente do banco
    const client = new sqlite3.Database(dbConfig.filename);

    // Insere dados na tabela tag_counts
    const tags = Object.keys(tagCounts);
    const insertPromises = tags.map(tag => {
      const count = tagCounts[tag];
      const selectQuery = `SELECT id FROM tag_counts WHERE tag_name = ? AND url = ?`;
      const insertQuery = `
            INSERT INTO tag_counts (tag_name, count, url, test_date)
            VALUES (?, ?, ?, ?)
          `;
      const updateQuery = `
            UPDATE tag_counts
            SET count = ?, test_date = ?
            WHERE tag_name = ? AND url = ?
          `;

      return new Promise((resolve, reject) => {
        client.get(selectQuery, [tag, url], function (err, row) {
          if (err) {
            reject(err);
          } else {
            if (row) {
              // Registro encontrado, faz o update
              client.run(updateQuery, [count, today, tag, url], function (err) {
                if (err) reject(err);
                else resolve();
              });
            } else {
              // Registro não encontrado, faz a inserção
              client.run(insertQuery, [tag, count, url, today], function (err) {
                if (err) reject(err);
                else resolve();
              });
            }
          }
        });
      });
    });

    await Promise.all(insertPromises);
    console.log('Dados inseridos no banco de dados!');

    client.close();
    console.log('Conexão com o banco de dados fechada.');
  } catch (error) {
    console.error('Ocorreu um erro:', error);
  }
}

// Função para executar o web scraping
const scrap = async (url) => {
  const response = await axios.get(url)
  const html = response.data;
  const $ = cheerio.load(html);
  const today = new Date();

  const allTags = new Set(); // Armazena as tags encontradas    
  $('*').each((index, element) => {
    allTags.add(element.tagName);
  });

  // Converte para uma array e ordena alfabeticamente
  const allTagsArray = Array.from(allTags).sort();

  console.log('Todas as tags possíveis no HTML:');
  console.log(allTagsArray);

  const tagsDesejadas = allTagsArray;
  const tagCounts = {};

  // Conta as tags e armazenar no tagCounts
  tagsDesejadas.forEach(tag => {
    tagCounts[tag] = $(tag).length;
  });
  console.log(tagCounts); //para visualizar no console as tags

  // Exibe os resultados em formato de data
  const scrapingResult = {
    date: today.toISOString(),
    url: url,
    tagCounts: tagCounts,
  };

  //escreve no JSON e insere no banco
  await writeToJSONFileAndInsertIntoDB(scrapingResult, tagCounts, url, today);

  return scrapingResult;
}

// Rota POST para fazer o web scraping com base na URL fornecida pelo frontend
app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }

  try {
    const scrapingResult = await scrap(url);

    return res.json(scrapingResult);
  } catch (error) {
    console.error('Ocorreu um erro no web scraping:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao fazer o web scraping.' });
  }
});

checkAndCreateDatabase();

// Inicia o servidor
const port = 3000; 
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}.`);
})