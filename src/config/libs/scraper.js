const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const logger = require('./logger');

module.exports.scrapHtmlFromUrl = async (url) => {
  try {
    const webHtml = await axios(url);
    return cheerio.load(webHtml.data);
  } catch (error) {
    logger.error(error);
  }
}

module.exports.scrapeCouponsFromHtml = ($html, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const coupons = [];
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const $couponsList = $html('section.card-offers').children('ul').children();
      $couponsList.each(async (i, $element) => {
        const $content = $html($element).children('div');
        if ($html($element).children('figure').children('figcaption').text() === 'CODE') {
          const id = $element.attribs['id'].split('_')[2];
          // await page.goto(`${url}#cid=${id}`);
          // await page.waitForNavigation({ waitUntil: 'networkidle2' });

          // const couponCode = await page.$(".modal__code-copy input");
          // const code = await page.evaluate(element => element.value, couponCode);
          // const code = await getCouponCode(id, url);
          coupons.push({
            couponId: id,
            code: '',
            title: $content.children('h3').children('a').text(),
            description: $content.children('p').text(),
            brand: '',
            dateCreated: $element.attribs['data-c'],
          });
        }

        if (i === $couponsList.length - 1) {
          // console.log(coupons);
          // browser.close();
          return resolve(coupons);
        }
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

/* async function getCouponCode(id, url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${url}#cid=${id}`, {waitUntil: 'networkidle2'});
    const element = await page.$(".modal__code-copy input");
    const text = await page.evaluate(element => element.value, element);
    browser.close();
    return text;
  } catch (error) {
    console.log(error);
    logger.error(error);
  }
} */
