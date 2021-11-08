import * as alcoholMap from '../docs/alcohol-map.json';
import {LeafData, NumericLeafData} from './types/data';
import {TreeNode} from './types/node';
import {getLeaves, normalizeLeaves} from './algorithms/leaves';
import {calculateEuclideanDistance} from './metrics/euclidean';
import {calculateManhattanDistance} from './metrics/manhattan';
import {calculateTreeDistance} from './metrics/tree';
import {calculatePearsonCorrelationCoefficient} from './metrics/pearson';
import {calculateCustomDistance} from './metrics/custom';


const main = () => {
	const root: TreeNode = alcoholMap;
	const leaves: TreeNode[] = getLeaves(root);
	const normalizedLeaves: TreeNode[] = normalizeLeaves(leaves);
	const numericLeavesData: NumericLeafData[] = normalizedLeaves.map(leaf => new NumericLeafData(leaf.data as LeafData));

	const results = Array.from({length: leaves.length}, () => Array.from({length: leaves.length}, () => ({e: 0, m: 0, n: 0, p: 0, c: 0})));
	for (let i = 0; i < leaves.length; ++i) {
		for (let j = 0; j < leaves.length; ++j) {
			results[i][j] = {
				e: calculateEuclideanDistance(numericLeavesData[i], numericLeavesData[j]),
				m: calculateManhattanDistance(numericLeavesData[i], numericLeavesData[j]),
				n: calculateTreeDistance(root, numericLeavesData[i].name, numericLeavesData[j].name),
				p: calculatePearsonCorrelationCoefficient(numericLeavesData[i], numericLeavesData[j]),
				c: calculateCustomDistance(root, numericLeavesData[i], numericLeavesData[j]),
			};
		}
	}

	let table = '<table>\n\t<tr>\n\t\t<th></th>\n';
	for (let i = 0; i < leaves.length; ++i) {
		table += `\t\t<th>${leaves[i].data.name}</th>\n`;
	}
	table += '\t</tr>\n';
	for (let i = 0; i < leaves.length; ++i) {
		const rows = [`\t<tr>\n\t\t<th rowspan="5">${leaves[i].data.name}</th>\n`, '\t<tr>\n', '\t<tr>\n', '\t<tr>\n', '\t<tr>\n'];
		const letters = ['e', 'm', 'n', 'p', 'c'];
		for (let k = 0; k < rows.length; ++k) {
			table += rows[k];
			for (let j = 0; j < leaves.length; ++j) {
				table += `\t\t<td>${results[i][j][letters[k]]}</td>\n`;
			}
			table += '\t</tr>\n';
		}
	}
	table += '</table>';
	console.log(table);
};

main();
