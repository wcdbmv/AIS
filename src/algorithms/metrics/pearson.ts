import {LeafData, NUMERIC_FIELDS_OF_LEAF_DATA} from '../../types/data';


const calculateMean = (x: LeafData): number =>
	NUMERIC_FIELDS_OF_LEAF_DATA.reduce(
		(acc: number, cur: string): number =>
			acc + x[cur],
		0
	) / NUMERIC_FIELDS_OF_LEAF_DATA.length;

const calculatePearsonCorrelationCoefficient = (p: LeafData, q: LeafData): number => {
	const meanP = calculateMean(p);
	const meanQ = calculateMean(q);

	let covariance = 0;
	let varianceP = 0;
	let varianceQ = 0;
	NUMERIC_FIELDS_OF_LEAF_DATA.forEach((field: string) => {
		covariance += (p[field] - meanP) * (q[field] - meanQ);
		varianceP += (p[field] - meanP) ** 2;
		varianceQ += (q[field] - meanQ) ** 2;
	});

	return covariance / Math.sqrt(varianceP * varianceQ);
};


export {calculatePearsonCorrelationCoefficient};
