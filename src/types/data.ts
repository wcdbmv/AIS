type InodeData = {
	name: string,
};

type LeafData = {
	name: string,
	volume: number,
	price: number,
	abv: number,
	age: number,
	country: string,
	carbonated: boolean,
	mainTaste: string,
};

const NUMERIC_FIELDS_OF_LEAF_DATA = ['volume', 'price', 'abv', 'age'];


export {InodeData, LeafData, NUMERIC_FIELDS_OF_LEAF_DATA};
