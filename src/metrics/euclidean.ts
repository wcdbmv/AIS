import {
	NumericLeafData,
	NUMERIC_LEAF_DATA_FIELDS,
	NUMERIC_LEAF_DATA_FIELDS_WEIGHTS,
} from '../types/data';


export const calculateEuclideanDistance = (x: NumericLeafData, y: NumericLeafData): number =>
	Math.sqrt(
		NUMERIC_LEAF_DATA_FIELDS.reduce(
			(acc: number, cur: string): number =>
				acc + NUMERIC_LEAF_DATA_FIELDS_WEIGHTS[cur] * (y[cur] - x[cur]) ** 2,
			0
		)
	);
