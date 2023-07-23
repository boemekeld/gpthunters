import GptCrawler from './GptCrawler.js';

const crawler = new GptCrawler();

//const url = 'https://chat.openai.com/share/47ba4104-8b1a-463d-996a-2b32efe62e3e';
const url = 'https://chat.openai.com/share/fdf7971b-8978-4150-9ed3-40dab3dde0bd';
crawler.fetchUrl(url)
  .then(data => console.log(data))
  .catch(error => console.error(error));