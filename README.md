
# WebScraper-NUTI

Este é um projeto de Web Scraper desenvolvido em Node.js que tem como objetivo analisar o conteúdo de páginas web e identificar as tags HTML presentes nessa página. O Web Scraper utiliza as bibliotecas `express`, `axios`, `cheerio`, `fs` e `sqlite3`.

## Contexto

O Web Scraper foi desenvolvido como parte de uma prova prática para a disciplina de **Núcleo de Tecnologia da Informação (NUTI)**. O objetivo do projeto é demonstrar as habilidades em programação, Web Scraping e manipulação de banco de dados SQLite.

## Funcionalidades

O Web Scraper possui as seguintes funcionalidades:

- Realizar o Web Scraping de uma página web fornecida pelo usuário (via requisição POST);
- Identificar e contar as ocorrências de cada tag HTML presente no código-fonte da página;
- Armazenar as informações coletadas em um arquivo JSON chamado "result.json";
- Inserir as informações no banco de dados SQLite, em uma tabela chamada "tag_counts";
- Exibir os resultados em formato JSON contendo a data da análise, a URL da página e as contagens de ocorrência de cada tag HTML identificada.

## Como Executar o Web Scraper

Para executar o Web Scraper em sua máquina local, siga os passos abaixo:

1. Certifique-se de ter o Node.js instalado em sua máquina. Caso não tenha, você pode fazer o download em: [https://nodejs.org/](https://nodejs.org/)

2. Clone o repositório do projeto para sua máquina local:

```
git clone https://github.com/Luccado/WebScraper-NUTI.git
```

3. Acesse o diretório do projeto:

```
cd WebScraper-NUTI
```

4. Instale as dependências do projeto:

```
npm install axios fs sqlite3 express cheerio
```

5. Inicie o servidor:

```
node start api2.js
```

6. O servidor estará rodando na porta 3000. Você pode acessar o Web Scraper através do navegador ou utilizar ferramentas como o Postman para fazer requisições POST para a rota "/scrape" com a URL da página a ser analisada no corpo da requisição.

7. Os resultados do Web Scraping serão exibidos no console do servidor e também estarão disponíveis no arquivo "result.json".

## Observações

- Este projeto foi desenvolvido apenas para fins educacionais e de demonstração, com o intúito de realizar as atividades sugeridas pela prova da NUTI. É importante sempre respeitar os termos de uso dos sites acessados e garantir que o Web Scraping seja feito de forma ética e legal.

- O Web Scraper realiza a análise de todas as tags HTML presentes na página. Caso queira analisar apenas tags específicas, é possível modificar o código para filtrar apenas as tags desejadas.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais informações.

---
