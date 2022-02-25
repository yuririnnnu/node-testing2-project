
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'Happy'},
        {id: 2, username: 'Lucky'},        
      ]);
    });
};
