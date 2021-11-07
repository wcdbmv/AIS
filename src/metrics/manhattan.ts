import {
	NumericLeafData,
	NUMERIC_LEAF_DATA_FIELDS,
	NUMERIC_LEAF_DATA_FIELDS_WEIGHTS,
} from '../types/data';


export const calculateManhattanDistance = (x: NumericLeafData, y: NumericLeafData): number =>
	NUMERIC_LEAF_DATA_FIELDS.reduce(
		(acc: number, cur: string): number =>
			acc + NUMERIC_LEAF_DATA_FIELDS_WEIGHTS[cur] * Math.abs(y[cur] - x[cur]),
		0
	);
