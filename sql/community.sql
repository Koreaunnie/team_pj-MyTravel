CREATE TABLE community
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    title    VARCHAR(100),
    content  VARCHAR(5000),
    writer   VARCHAR(20) NULL REFERENCES member (nickname),
    inserted DATETIME DEFAULT NOW()
);

# 닉네임 수정에 따른 새로운 컬럼과 조건 수정

ALTER TABLE community
    MODIFY COLUMN writer VARCHAR(20) NULL;
SHOW COLUMNS FROM `community`;
ALTER TABLE `community`
    ADD CONSTRAINT `community_ibfk_1`
        FOREIGN KEY (`writer`) REFERENCES `member` (`nickname`)
            ON DELETE SET NULL
            ON UPDATE CASCADE;

ALTER TABLE community
    DROP FOREIGN KEY community_ibfk_1;

SELECT CONSTRAINT_NAME, TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'teamPrj1126';

# TODO : 게시글 조회수
ALTER TABLE community
    ADD views INT DEFAULT 0;


SELECT *
FROM community
ORDER BY id DESC;

INSERT INTO community (title, content, writer)
VALUES ('그걸 지켜보는 너', '그건 아마도 전쟁같은 사랑', 'user2');

SELECT id, title, writer, inserted
FROM community
ORDER BY id DESC
LIMIT 45, 15;

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

SELECT COUNT(*)
FROM community;

SELECT COUNT(*)
FROM community
WHERE title LIKE '%1%';

SELECT *
FROM community
ORDER BY inserted DESC;
