import { faker } from "@faker-js/faker";

export default function itemFactory() {
    return {
        title: faker.commerce.productName(),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(),
        amount: 200
    }
}