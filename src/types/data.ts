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
	mainTaste: string,
};

export const NUMERIC_FIELDS_OF_LEAF_DATA = ['volume', 'price', 'abv', 'age'];
