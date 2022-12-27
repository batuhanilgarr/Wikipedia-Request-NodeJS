var puppeteer = require('puppeteer')
const express = require('express');


var app = express();

const scrape = async (yer) => {
  const url = `https://tr.wikipedia.org/wiki/Dosya:${yer}.jpg`

  const browser = await puppeteer.launch({headless:true})
  const page = await browser.newPage()
  await page.goto(url)

  // await page.pdf({ path: 'currencywebsite.pdf', format: 'A4' })

  const [element] = await page.$x(`//*[@id="firstHeading"]`)
  const text = await element.getProperty('textContent')
  const textValue = await text.jsonValue()

  const [element2] = await page.$x(`//*[@id="file"]/a/img`)
  const src = await element2.getProperty('src')
  const avatarURL = await src.jsonValue()

  return avatarURL;

  browser.close()
}


app.get("/", function (request, response) {
  response.sendFile(__dirname+"/index.html");
});

app.get("/find", async function (request, response) {

  const url = await scrape(request.query.sehir);
  response.json({sehir: request.query.sehir, url: url});
});

//start the server
app.listen(8080);

console.log("Something awesome to happen at http://localhost:8080");

// const liveServer = require("live-server");

/*
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Şehir Giriniz :  ', function (name) {
  scrape(name)
  rl.close()
})

 */


