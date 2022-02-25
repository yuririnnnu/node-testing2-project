const Users = require('./user-model')
const request = require('supertest')
const server = require('./server')
const db = require('./../data/db-config')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})
beforeEach(async () => {
    await db('users').truncate()
})

test("using correct environment", () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe("response to CRUD requests", () => {
    test("1. getting all the user data available", async () => {
        const output = await Users.get()
        expect(output).toHaveLength(0)
    })
    test("2. getting the user data gets inserted", async () => {
        const result = await Users.create({username: 'Lily'})        
        expect(result).toEqual({id: 1, username: 'Lily'})
    })
    test("3. get data by id", async () => {
        const {id} = await Users.create({username: 'Lily'})
        const result = await Users.getById(id)
        expect(result).toHaveProperty('username', 'Lily')
    })
    test("4. updating user data", async () => {
        let {id} = await Users.create({username: 'Yong'})
        let result = await Users.getById(id)

        expect(result).toEqual({id: 1, username: 'Yong'})

        await Users.update(1, {username: 'Lily'})
        result = await Users.getById(id)
        expect(result).toEqual({id: 1, username: 'Lily'})        
    })
    test("5. delete data", async () => {
        let {id} = await Users.create({username: 'Yong'})
        let result = await Users.getById(id)

        expect(result).toEqual({id: 1, username: 'Yong'})
        
        await Users.remove(id)
        result = await Users.getById(id)
        expect(result).not.toBeDefined();
    })
})

describe("calling the endpoints", () => {
    test("server is running", async () => {
        const result = await request(server).get('/')
        expect(result.status).toBe(200)
    })
    test("[GET] /users - get()", async () => {
        let result = await request(server).get('/users')
        expect(result.status).toBe(200);
        expect(result.body).toBeInstanceOf(Array);
        expect(result.body).toHaveLength(0);          
    })
    test('[GET] /users/:id - getById()', async () => {
        await Users.create({username: 'Lily'})
        let result = await request(server).get('/users/1')
        expect(result.status).toBe(200)
        expect(result.body.username).toBe('Lily')
    })
    test('[POST] /users - create()', async () => {
        await Users.create({username: 'Lily'})
        let result = await request(server).get('/users/1')
        expect(result.status).toBe(200);
        expect(result.body.username).toBe('Lily');
    })
    test('[PUT] /users/:id - update()', async () => {
        let {id} = await Users.create({username: 'Lily'})
        let result = await request(server).get('/users/1')
        expect(result.status).toBe(200);
        expect(result.body.username).toBe('Lily');
        
        await Users.update(id, {username: 'Happy'})
        result = await request(server).get('/users/1')
        expect(result.status).toBe(200);
        expect(result.body.username).toBe('Happy');        
    })
    test('[DELETE] /users/:id - remove()', async () => {
        let {id} = await Users.create({username: 'Lily'})
        let result = await request(server).get('/users/1')
        expect(result.status).toBe(200)
        expect(result.body.username).toBe('Lily')

        await Users.remove(id)
        let users = await db('users')
        expect(users).toHaveLength(0)
    })
})
