const db = require('./../data/db-config')

const get = () => {
    return db('users')
}

const getById = id => {
    return db('users')
        .where('id', id).first()
}

const create = async user => {
    const [ id ] = await db('users').insert(user)
    return getById(id)
}

const update = async (id, change) => {
    await db('users')
        .update({username: change.username})
        .where('id', id)
    return getById(id)
}

const remove = async id => {
    const removed = await getById(id)
    await db('users')
        .where('id', id)
        .del()
    return removed
}

module.exports = {
    get,
    getById,
    create,
    update,
    remove,
}