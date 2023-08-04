document.getElementById('webScrapingForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Limpar a tabela e exibir o aviso de carregamento
  document.getElementById('result').innerHTML = '';
  document.getElementById('loadingMessage').textContent = 'Processando... Aguarde por favor.';

  const urlInput = document.getElementById('urlInput');
  const urls = urlInput.value.split(/\s*,\s*|\s+/).map(url => formatUrl(url.trim())); // Separa as URLs por vírgula ou espaços em branco

  try {
    const results = await scrapeData(urls);
    displayTable(results);
  } catch (error) {
    displayError(error.message);
  } finally {
    // Remover o aviso de carregamento
    document.getElementById('loadingMessage').textContent = '';
  }
});

async function scrapeData(urls) {
  const promises = urls.map(async (url) => {
    const response = await fetch('http://localhost:3000/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar a API de Web Scraping.');
    }

    return response.json();
  });

  return Promise.all(promises);
}

function displayTable(dataArray) {
  const resultDiv = document.getElementById('result');
  let tableHtml = `
    <table>
      <tr>
        <th>Tag</th>
        <th>Quantidade</th>
        <th>URL</th>
      </tr>
  `;

  for (const data of dataArray) {
    const entries = Object.entries(data.tagCounts);
    for (const [tag, quantidade] of entries) {
      tableHtml += `
        <tr>
          <td>${tag}</td>
          <td>${quantidade}</td>
          <td style="font-size: 12px;">${data.url}</td>
        </tr>
      `;
    }
  }

  tableHtml += '</table>';
  resultDiv.innerHTML = tableHtml;
}

function displayError(errorMessage) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
}

function formatUrl(url) {
  // Adiciona "https://" caso a URL não comece com "http://" ou "https://"
  if (!url.match(/^(http:\/\/|https:\/\/)/i)) {
    url = 'https://' + url;
  }
  // Remove "www." caso esteja presente
  url = url.replace(/^(http:\/\/|https:\/\/)(www\.)?/i, '$1');
  return url;
}