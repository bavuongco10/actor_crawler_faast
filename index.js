import { faast } from 'faastjs';
import forEach from 'lodash/forEach';
import flatten from 'lodash/flatten';
import * as funcs from './functions';

async function main() {
  const instance = await faast('local', funcs);
  try {
    const { crawlTileFromPage, crawlDetail } = instance.functions;

    const pagePromises = [];
    forEach(Array(39), (_, index) => {
      pagePromises.push(crawlTileFromPage(index + 1));
    });

    const allPageResult = await Promise.all(pagePromises);
    const normalizedPage = flatten(allPageResult);

    const actorPromises = [];
    forEach(normalizedPage, (url) => {
      actorPromises.push(crawlDetail(url));
    });
    const allActorResult = await Promise.all(actorPromises);
    console.log(allActorResult);

    console.log('## Cost');
    const cost = await instance.costSnapshot();
    console.log(`${cost}`);
    console.log('## Stats');
    console.log(`${instance.stats()}`);
  } finally {
    await instance.cleanup();
  }
}

main();
