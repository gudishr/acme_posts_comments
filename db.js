const pg = require('pg')
const uuid = require('uuid')
const { Client } = pg

const client = new Client('postgres://localhost/acme_post_comments_db')

client.connect()

const NodeId = uuid.v4()
const ExpressId = uuid.v4()
const ReactId = uuid.v4()
const Post1Id = uuid.v4()
const Post2Id = uuid.v4()
const Post3Id = uuid.v4()

const SQL = `
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tags;

CREATE TABLE posts(
  id UUID PRIMARY KEY,
  text VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE tags(
  id UUID PRIMARY KEY,
  topic VARCHAR(255) UNIQUE NOT NULL,
  post_id UUID REFERENCES posts(id)
);

INSERT INTO posts(id, text) VALUES('${NodeId}', 'Node');
INSERT INTO posts(id, text) VALUES('${ExpressId}', 'Express');
INSERT INTO posts(id, text) VALUES('${ReactId}', 'React');

INSERT INTO tags(id, topic, post_id) VALUES('${Post1Id}', 'Challenging', '${ExpressId}');
INSERT INTO tags(id, topic, post_id) VALUES('${Post2Id}', 'Loved It', '${ReactId}');
INSERT INTO tags(id, topic, post_id) VALUES('${Post3Id}', 'What??', '${ReactId}');
`

const syncAndSeed = async() => {
  await client.query(SQL)
}

const findAllTags = async() => {
  const response = await client.query('SELECT * FROM tags');
  return response.rows;
}

const findAllPosts = async() => {
  const response = await client.query('SELECT * FROM posts');
  return response.rows;
}

module.exports={
  syncAndSeed,
  findAllTags,
  findAllPosts
}