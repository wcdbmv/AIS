import {readUntil} from './readUntil';


export const readProduct = (productNumber: string, products: string[]) =>
	readUntil(
		`Input ${productNumber} product: `,
		'There is no such product',
		(product: string): boolean =>
			products.includes(product)
	);
