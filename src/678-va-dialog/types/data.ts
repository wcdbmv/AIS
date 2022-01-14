import {simpleDeepCopy} from '../algorithms/copy';

export type InodeData = {
	name: string,
}

export type LeafData = {
	name: string,
	kcal: number,
	price: number,
	vegetarian?: boolean,
	alcoholic?: boolean,
	whereToTaste: string,
	category: 'Салат' | 'Закуски' | 'Выпечка' | 'Супы' | 'Основное' | 'Напитки' | 'Слабый алкоголь' | 'Крепкий алкоголь',
};

export const LEAF_DATA_NUMERIC_FIELDS = ['kcal', 'price'];
export const LEAF_DATA_BOOLEAN_FIELDS = ['vegetarian', 'alcoholic'];
export const LEAF_DATA_CATEGORICAL_FIELDS = [
	{
		name: 'category',
		values: ['Салат', 'Закуски', 'Выпечка', 'Супы', 'Основное', 'Напитки', 'Слабый алкоголь', 'Крепкий алкоголь'],
	},
];

type NormalizedLeafData = {
	kcal: number,
	price: number,
	vegetarian: number,
	alcoholic: number,
	category: number,
};

type Score = {
	like: number,
	dislike: number,
	total: number,
}

export class ExtendedLeafData {
	source: LeafData = {
		name: '__noname__',
		kcal: 0,
		price: 0,
		vegetarian: false,
		alcoholic: false,
		whereToTaste: '__no_place__',
		category: 'Салат'
	};
	path: string[] = [];
	normalized: NormalizedLeafData = {
		kcal: 0.5,
		price: 0.5,
		vegetarian: 0.5,
		alcoholic: 0.5,
		category: 0.5,
	};
	score: Score = {
		like: 0,
		dislike: 0,
		total: 0,
	};

	constructor(leafData?: LeafData) {
		if (typeof leafData === 'undefined') {
			return;
		}

		this.source = simpleDeepCopy(leafData);
		this.normalized.vegetarian = 1;
		this.normalized.alcoholic = 0;

		LEAF_DATA_NUMERIC_FIELDS.forEach((field: string) => {
			this.normalized[field] = leafData[field];
		});
		LEAF_DATA_BOOLEAN_FIELDS.forEach((field: string) => {
			if (field in leafData) {
				this.normalized[field] = Number(leafData[field]);
			}
		});
		LEAF_DATA_CATEGORICAL_FIELDS.forEach(({name, values}) => {
			this.normalized[name] = values.indexOf(leafData[name]) / (values.length - 1);
		});
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
	kcal: 1.0,
	price: 1.1,
	vegetarian: 0.8,
	alcoholic: 0.9,
	category: 1.2,
};
