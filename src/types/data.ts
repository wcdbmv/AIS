export type InodeData = {
	name: string,
};

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

export class NumericLeafData {
	name: string;
	volume: number;
	price: number;
	abv: number;
	age: number;
	carbonated: number;
	mainTaste: number;

	constructor(x: LeafData) {
		this.name = x.name;
		LEAF_DATA_NUMERIC_FIELDS.forEach(field => {
			this[field] = x[field];
		});
		LEAF_DATA_BOOLEAN_FIELDS.forEach(field => {
			this[field] = Number(x[field]);
		});
		LEAF_DATA_CATEGORICAL_FIELDS.forEach(({name, values}) => {
			this[name] = values.indexOf(x[name]) / (values.length - 1);
		});
	}
}

export const NUMERIC_LEAF_DATA_FIELDS =
	LEAF_DATA_NUMERIC_FIELDS
		.concat(LEAF_DATA_BOOLEAN_FIELDS)
		.concat(
			LEAF_DATA_CATEGORICAL_FIELDS
				.map(field => field.name)
		);

export const NUMERIC_LEAF_DATA_FIELDS_WEIGHTS = {
	volume: 1.1,
	price: 1.5,
	abv: 1.5,
	age: 0.8,
	carbonated: 0.7,
	mainTaste: 0.4,
};
