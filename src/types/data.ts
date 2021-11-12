import {simpleDeepCopy} from '../algorithms/copy';

export type InodeData = {
	name: string,
}

export type LeafData = {
	name: string,
	volume: number,
	price: number,
	abv: number,
	age: number,
	country: string,
	carbonated: boolean,
	mainTaste: 'bitter' | 'sour' | 'sweet',
};

export const LEAF_DATA_NUMERIC_FIELDS = ['volume', 'price', 'abv', 'age'];
export const LEAF_DATA_BOOLEAN_FIELDS = ['carbonated'];
export const LEAF_DATA_CATEGORICAL_FIELDS = [
	{
		name: 'mainTaste',
		values: ['bitter', 'sour', 'sweet'],
	},
];

export class ExtendedLeafData {
	source: LeafData;
	path: string[];
	normalized: {
		volume: number,
		price: number,
		abv: number,
		age: number,
		carbonated: number,
		mainTaste: number,
	};
	score: {
		like: number,
		dislike: number,
		total: number,
	};

	constructor(leafData: LeafData) {
		this.source = simpleDeepCopy(leafData);
		this.path = [];
		this.normalized = {
			volume: 0,
			price: 0,
			abv: 0,
			age: 0,
			carbonated: 0,
			mainTaste: 0,
		};

		LEAF_DATA_NUMERIC_FIELDS.forEach((field: string) => {
			this.normalized[field] = leafData[field];
		});
		LEAF_DATA_BOOLEAN_FIELDS.forEach((field: string) => {
			this.normalized[field] = Number(leafData[field]);
		});
		LEAF_DATA_CATEGORICAL_FIELDS.forEach(({name, values}) => {
			this.normalized[name] = values.indexOf(leafData[name]) / (values.length - 1);
		});

		this.score = {
			like: 0,
			dislike: 0,
			total: 0,
		};
	}
}

export const EXTENDED_LEAF_DATA_NORMALIZED_FIELDS =
	LEAF_DATA_NUMERIC_FIELDS
		.concat(LEAF_DATA_BOOLEAN_FIELDS)
		.concat(
			LEAF_DATA_CATEGORICAL_FIELDS
				.map(field => field.name)
		);

export const EXTENDED_LEAF_DATA_NORMALIZED_FIELDS_WEIGHTS = {
	volume: 1.1,
	price: 1.5,
	abv: 1.5,
	age: 0.8,
	carbonated: 0.7,
	mainTaste: 0.4,
};
