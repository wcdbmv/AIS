import {LEAF_DATA_NUMERIC_FIELDS} from '../types/data';
import {TreeNode} from '../types/node';


export const getLeaves = (node: TreeNode): TreeNode[] =>
	node.children.length
		? node.children.flatMap(getLeaves)
		: [node];

const calculateMinMaxOfNumericFields = (leaves: TreeNode[]): {minimumsOfNumericFields, maximumsOfNumericFields} => {
	const minimumsOfNumericFields = Array(LEAF_DATA_NUMERIC_FIELDS.length).fill(Infinity);
	const maximumsOfNumericFields = Array(LEAF_DATA_NUMERIC_FIELDS.length).fill(-Infinity);
	for (let i = 0; i < leaves.length; ++i) {
		for (let j = 0; j < LEAF_DATA_NUMERIC_FIELDS.length; ++j) {
			const field: string = LEAF_DATA_NUMERIC_FIELDS[j];
			minimumsOfNumericFields[j] = Math.min(leaves[i].data[field], minimumsOfNumericFields[j]);
			maximumsOfNumericFields[j] = Math.max(leaves[i].data[field], maximumsOfNumericFields[j]);
		}
	}
	return {minimumsOfNumericFields, maximumsOfNumericFields};
};

export const normalizeLeaves = (leaves: TreeNode[]): TreeNode[] => {
	const {minimumsOfNumericFields, maximumsOfNumericFields} = calculateMinMaxOfNumericFields(leaves);
	const normalizedLeaves: TreeNode[] = JSON.parse(JSON.stringify(leaves));
	for (let i = 0; i < leaves.length; ++i) {
		for (let j = 0; j < LEAF_DATA_NUMERIC_FIELDS.length; ++j) {
			const field: string = LEAF_DATA_NUMERIC_FIELDS[j];
			const min: number = minimumsOfNumericFields[j];
			const max: number = maximumsOfNumericFields[j];
			normalizedLeaves[i].data[field] = (leaves[i].data[field] - min) / (max - min);
		}
	}
	return normalizedLeaves;
};
