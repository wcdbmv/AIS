import * as alcoholMap from '../docs/alcohol-map.json';
import {calculatePearsonCorrelationCoefficient} from "./algorithms/metrics/pearson";
import {calculateCommonParents} from "./algorithms/metrics/tree";
import {LeafData} from "./types/data";
import {TreeNode} from './types/node';
import {getLeaves, normalizeLeaves} from './algorithms/leaves';
import {calculateEuclideanDistance} from "./algorithms/metrics/euclidean";
import {calculateManhattanDistance} from "./algorithms/metrics/manhattan";
import {readProduct} from './io/readProduct';


const main = () => {
	const root: TreeNode = alcoholMap;
	const leaves: TreeNode[] = getLeaves(root);
	const normalizedLeaves: TreeNode[] = normalizeLeaves(leaves);
	const products: string[] = leaves.map(leaf => leaf.data.name);

	console.log('List of products: ', products);

	const N = 10;
	for (let i = 1; i < N; ++i) {
		console.log(`\nITERATION ${i}`);
		const product1 = readProduct('first', products);
		const product2 = readProduct('second', products);

		const leaf1 = normalizedLeaves[products.indexOf(product1)];
		const leaf2 = normalizedLeaves[products.indexOf(product2)];

		const euclideanDistance = calculateEuclideanDistance(leaf1.data as LeafData, leaf2.data as LeafData);
		const manhattanDistance = calculateManhattanDistance(leaf1.data as LeafData, leaf2.data as LeafData);
		const nCommonParents = calculateCommonParents(root, product1, product2);
		const pearsonCorrelationCoefficient = calculatePearsonCorrelationCoefficient(leaf1.data as LeafData, leaf2.data as LeafData);

		console.log(`Euclidean distance: ${euclideanDistance}`);
		console.log(`Manhattan distance: ${manhattanDistance}`);
		console.log(`Number of common parents: ${nCommonParents}`);
		console.log(`Pearson correlation coefficient: ${pearsonCorrelationCoefficient}`);
	}
};

main();
