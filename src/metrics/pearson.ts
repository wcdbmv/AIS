import {
	NumericLeafData,
	NUMERIC_LEAF_DATA_FIELDS,
	NUMERIC_LEAF_DATA_FIELDS_WEIGHTS,
} from '../types/data';


const NUMERIC_LEAF_DATA_FIELDS_WEIGHTS_SUM =
	NUMERIC_LEAF_DATA_FIELDS.reduce(
		(acc: number, cur: string): number =>
			acc + NUMERIC_LEAF_DATA_FIELDS_WEIGHTS[cur],
		0
	);

const calculateMean = (x: NumericLeafData): number =>
	NUMERIC_LEAF_DATA_FIELDS.reduce(
		(acc: number, cur: string): number =>
			acc + NUMERIC_LEAF_DATA_FIELDS_WEIGHTS[cur] * x[cur],
		0
	) / NUMERIC_LEAF_DATA_FIELDS_WEIGHTS_SUM;

export const calculatePearsonCorrelationCoefficient = (x: NumericLeafData, y: NumericLeafData): number => {
	const meanX = calculateMean(x);
	const meanY = calculateMean(y);

	let covariance = 0;
	let varianceX = 0;
	let varianceY = 0;
	NUMERIC_LEAF_DATA_FIELDS.forEach((field: string) => {
		const weight = NUMERIC_LEAF_DATA_FIELDS_WEIGHTS[field];
		covariance += weight * (x[field] - meanX) * (y[field] - meanY);
		varianceX += weight * (x[field] - meanX) ** 2;
		varianceY += weight * (y[field] - meanY) ** 2;
	});

	return covariance / Math.sqrt(varianceX * varianceY);
};
