import * as alcoholMap from '../docs/alcohol-map.json';
import {LeafData, NumericLeafData} from './types/data';
import {TreeNode} from './types/node';
import {getLeaves, normalizeLeaves} from './algorithms/leaves';
import {calculateEuclideanDistance} from './algorithms/metrics/euclidean';
import {calculateManhattanDistance} from './algorithms/metrics/manhattan';
import {calculateTreeDistance} from './algorithms/metrics/tree';
import {calculatePearsonCorrelationCoefficient} from './algorithms/metrics/pearson';
import {calculateCustomDistance} from './algorithms/metrics/custom';
import {readProduct} from './io/readProduct';


const main = () => {
	const root: TreeNode = alcoholMap;
	const leaves: TreeNode[] = getLeaves(root);
	const normalizedLeaves: TreeNode[] = normalizeLeaves(leaves);
	const numericLeavesData: NumericLeafData[] = normalizedLeaves.map(leaf => new NumericLeafData(leaf.data as LeafData));
	const products: string[] = leaves.map(leaf => leaf.data.name);

	console.log('List of products: ', products);

	const N = 10;
	for (let i = 1; i < N; ++i) {
		console.log(`\nITERATION ${i}`);
		const product1 = readProduct('first', products);
		const product2 = readProduct('second', products);

		const leafData1 = numericLeavesData[products.indexOf(product1)];
		const leafData2 = numericLeavesData[products.indexOf(product2)];

		const euclideanDistance = calculateEuclideanDistance(leafData1, leafData2);
		const manhattanDistance = calculateManhattanDistance(leafData1, leafData2);
		const treeDistance = calculateTreeDistance(root, product1, product2);
		const pearsonCorrelationCoefficient = calculatePearsonCorrelationCoefficient(leafData1, leafData2);
		const customDistance = calculateCustomDistance(root, leafData1, leafData2);

		console.log(`Euclidean distance: ${euclideanDistance}`);
		console.log(`Manhattan distance: ${manhattanDistance}`);
		console.log(`Tree distance: ${treeDistance}`);
		console.log(`Pearson correlation coefficient: ${pearsonCorrelationCoefficient}`);
		console.log(`Custom distance: ${customDistance}`);
	}
};

main();
