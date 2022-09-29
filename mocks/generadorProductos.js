import { faker } from '@faker-js/faker';
faker.locale = 'es'


 export default class ProductsFake{


 generarFakeProducts(n=5){
    let products = [];
    for (let i = 0; i < n; i++) {
        products.push({
            id: faker.datatype.uuid(),
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.avatar(),
          });
    }
    console.log(products)
 return products;
}

}



//  export { ProductsFake }