import * as alcoholMap from '../docs/alcohol-map.json';
import * as searchConfigJson from '../docs/search-config.json';
import {LeafData, ExtendedLeafData} from './types/data';
import {TreeNode} from './types/node';
import {getLeavesData, normalizeLeavesData} from './algorithms/leaves';
import {SearchConfig} from './types/search';
import {SearchEngine} from './search/search';


// 0.33 - 1
// 130 - 9800
// 4 - 40
// 1 - 12
// 'bitter' | 'sour' | 'sweet'

const main = () => {
	const root: TreeNode = alcoholMap;
	const leavesData: LeafData[] = getLeavesData(root);
	const extendedLeavesData: ExtendedLeafData[] = normalizeLeavesData(leavesData);

	const searchConfigs: SearchConfig[] = searchConfigJson as SearchConfig[];
	console.log(searchConfigs);
	const searchEngine: SearchEngine = new SearchEngine(searchConfigs);

	const searchResults = searchEngine.findAll(extendedLeavesData);
	console.log('===  Найдено:');
	console.log(searchResults);
};

main();
