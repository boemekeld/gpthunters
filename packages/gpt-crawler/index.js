class GptCrawler {
  async fetchUrl(url) {
    try {
      const fetch = require('node-fetch');
      const jsdom = require("jsdom");

      const { JSDOM } = jsdom;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();

      const dom = new JSDOM(data);
      const document = dom.window.document;

      const title = document.querySelector('h1').textContent;
      let author = null;
      let date = null;
      
      if (document.querySelector('.pt-3.text-base.text-gray-400 span')) {
        author = document.querySelector('.pt-3.text-base.text-gray-400 span').textContent;
        date = document.querySelector('.pt-3.text-base.text-gray-400').childNodes[2].textContent;
      } else {
        date = document.querySelector('.pt-3.text-base.text-gray-400').textContent;
      }

      const content = Array.from(document.querySelectorAll('.flex.flex-col.h-full.text-sm .group')).map(item => item.outerHTML);

      return {
        title,
        author,
        date,
        content
      };
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
    }
  }
}

module.exports = GptCrawler;