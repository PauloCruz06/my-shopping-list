import { prisma } from "../src/database";
import app from "../src/app";
import supertest from "supertest";
import itemFactory from "./factories/itemfactory";

beforeAll( async() => {
  await prisma.$executeRaw`TRUNCATE TABLE items CASCADE`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async() => {
    const item = itemFactory();
    const result = await supertest(app).post('/items').send(item);

    expect(result.status).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async() => {
    const item = itemFactory();
    await supertest(app).post('/items').send(item);
    const result = await supertest(app).post('/items').send(item);

    expect(result.status).toBe(409);
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async() => {
    const result = await supertest(app).get('/items').send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async() => {
    const item = itemFactory();
    const createdItem = await prisma.items.create({ data: item })

    const result = await supertest(app).get(`/items/${createdItem.id}`);

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async() => {
    const item = itemFactory();
    const createdItem = await prisma.items.create({ data: item });
    const deleteItem = await prisma.items.delete({ where: { id: createdItem.id } });

    const result = await supertest(app).get(`/items/${deleteItem.id}`);

    expect(result.status).toBe(404);
  });
});

afterAll( async() => {
  await prisma.$disconnect();
});