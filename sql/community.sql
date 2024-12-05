CREATE TABLE community
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    title    VARCHAR(100),
    content  VARCHAR(5000),
    writer   VARCHAR(20) NOT NULL REFERENCES member (nickname),
    inserted DATETIME DEFAULT NOW()
);


SELECT *
FROM community
ORDER BY id DESC;

INSERT INTO community (title, content, writer)
VALUES ('그걸 지켜보는 너', '그건 아마도 전쟁같은 사랑', 'user2');

SELECT id, title, writer, inserted
FROM community
ORDER BY id DESC;

SELECT *
FROM community
WHERE title LIKE '%뿌%';

SELECT *
FROM community
WHERE writer LIKE '%뿌%';

SELECT *
FROM community
WHERE content LIKE '%뿌%';

SELECT *
FROM community
WHERE content LIKE '%뿌%'
   OR writer LIKE '%뿌%'
   OR title LIKE '%뿌%';

#  title writer content all

SELECT c.id, c.title, c.content, f.file_name, c.writer, c.inserted creationDate
FROM community c
         LEFT JOIN community_file f ON c.id = f.community_id
WHERE c.id = 40;