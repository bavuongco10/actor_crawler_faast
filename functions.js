import fetch from 'node-fetch';
import cheerio from 'cheerio';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';

export const crawlTileFromPage = async (index) => {
  const pageUrl = `https://javmodel.com/jav/homepages.php?page=${index}`;
  const result = await fetch(pageUrl);

  const data = await result.text();

  const $ = cheerio.load(data);
  return map($('.portfolio-el > a'), el => el.attribs.href);
};

export const crawlDetail = async (url) => {
  const pageUrl = `https://javmodel.com${url}`;
  const result = await fetch(pageUrl);
  const data = await result.text();

  const $ = cheerio.load(data);
  const sectionEl = $('.section.mt20');

  return {
    name: sectionEl.find('h2.title-medium').text(),
    image: sectionEl.find('.blog-image > img').attr('src'),
    birthday: sectionEl.find('li:contains("Born")').text().substring(8),
    bloodType: sectionEl.find('li:contains("Blood")').text().substring(14),
    breast:
      parseInt(sectionEl.find('li:contains("Breast")').text().substring(10)),
    waist:
      parseInt(sectionEl.find('li:contains("Waist")').text().substring(9)),
    hips:
      parseInt(sectionEl.find('li:contains("Hips")').text().substring(8)),
    height:
      parseInt(sectionEl.find('li:contains("Height")').text().substring(10)),
    style: sectionEl.find('li:contains("Style :")').text().substring(17),
    videoClass: sectionEl.find('li:contains("Class :")').text().substring(15),
    videoCount: parseInt(sectionEl.find('li:contains("Videos Online : ")').text().substring(17)),
  };
};
