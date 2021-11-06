import {LeafData, NUMERIC_FIELDS_OF_LEAF_DATA} from '../../types/data';


export const calculateManhattanDistance = (p: LeafData, q: LeafData): number =>
	NUMERIC_FIELDS_OF_LEAF_DATA.reduce(
		(acc: number, cur: string): number =>
			acc + Math.abs(p[cur] - q[cur]),
		0
	);
