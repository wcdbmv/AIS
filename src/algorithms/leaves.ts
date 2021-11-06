import {NUMERIC_FIELDS_OF_LEAF_DATA} from '../types/data';
import {TreeNode} from '../types/node';


const getLeaves = (node: TreeNode): TreeNode[] =>
	node.children.length
		? node.children.flatMap(getLeaves)
		: [node];

const calculateMinMaxOfNumericFields = (leaves: TreeNode[]): {minimumsOfNumericFields, maximumsOfNumericFields} => {
	const minimumsOfNumericFields = Array(NUMERIC_FIELDS_OF_LEAF_DATA.length).fill(Infinity);
	const maximumsOfNumericFields = Array(NUMERIC_FIELDS_OF_LEAF_DATA.length).fill(-Infinity);
	for (let i = 0; i < leaves.length; ++i) {
		for (let j = 0; j < NUMERIC_FIELDS_OF_LEAF_DATA.length; ++j) {
			const field: string = NUMERIC_FIELDS_OF_LEAF_DATA[j];
			minimumsOfNumericFields[j] = Math.min(leaves[i].data[field], minimumsOfNumericFields[j]);
			maximumsOfNumericFields[j] = Math.max(leaves[i].data[field], maximumsOfNumericFields[j]);
		}
	}
	return {minimumsOfNumericFields, maximumsOfNumericFields};
};

const normalizeLeaves = (leaves: TreeNode[]): TreeNode[] => {
	const {minimumsOfNumericFields, maximumsOfNumericFields} = calculateMinMaxOfNumericFields(leaves);
	const normalizedLeaves: TreeNode[] = JSON.parse(JSON.stringify(leaves));
	for (let i = 0; i < leaves.length; ++i) {
		for (let j = 0; j < NUMERIC_FIELDS_OF_LEAF_DATA.length; ++j) {
			const field: string = NUMERIC_FIELDS_OF_LEAF_DATA[j];
			const min: number = minimumsOfNumericFields[j];
			const max: number = maximumsOfNumericFields[j];
			normalizedLeaves[i].data[field] = (leaves[i].data[field] - min) / (max - min);
		}
	}
	return normalizedLeaves;
};


export {getLeaves, normalizeLeaves};
