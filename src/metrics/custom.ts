import {NumericLeafData} from '../types/data';
import {TreeNode} from '../types/node';
import {calculateEuclideanDistance} from './euclidean';
import {calculateTreeDistance} from './tree';


export const calculateCustomDistance = (root: TreeNode, x: NumericLeafData, y: NumericLeafData): number =>
	calculateEuclideanDistance(x, y) + calculateTreeDistance(root, x.name, y.name);
