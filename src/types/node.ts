import {InodeData, LeafData} from './data';


type TreeNode = {
	data: InodeData | LeafData,
	children: TreeNode[],
};


export {TreeNode};
