import {LeafData, NUMERIC_FIELDS_OF_LEAF_DATA} from '../../types/data';


export const calculateEuclideanDistance = (p: LeafData, q: LeafData): number =>
	Math.sqrt(
		NUMERIC_FIELDS_OF_LEAF_DATA.reduce(
			(acc: number, cur: string): number =>
				acc + (p[cur] - q[cur]) ** 2,
			0
		)
	);
