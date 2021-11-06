import {TreeNode} from '../../types/node';


const findReversedPath = (name: string, node: TreeNode, path: string[]): boolean => {
	if (node.children.length) {
		for (const child of node.children) {
			if (findReversedPath(name, child, path)) {
				path.push(node.data.name);
				return true;
			}
		}
	} else if (node.data.name === name) {
		path.push(name);
		return true;
	}
	return false;
};

const getPath = (root: TreeNode, name: string): string[] => {
	const path = [];
	findReversedPath(name, root, path);
	path.reverse();
	return path;
};

const calculateCommonParents = (root: TreeNode, name1: string, name2: string): number => {
	const path1 = getPath(root, name1);
	const path2 = getPath(root, name2);
	for (let i = 0; i < path1.length; ++i) {
		if (path1[i] !== path2[i]) {
			return i;
		}
	}
	return path1.length;
};


export {calculateCommonParents};
