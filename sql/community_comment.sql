USE teamPrj1126;

CREATE TABLE community_comment
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    comment      VARCHAR(1000),
    writer       VARCHAR(20) NULL REFERENCES member (nickname),
    inserted     DATETIME DEFAULT NOW(),
    community_id INT         NOT NULL REFERENCES community (id)
);

# 닉네임 수정에 따른 새로운 컬럼과 조건 수정

ALTER TABLE community_comment
    MODIFY COLUMN writer VARCHAR(20) NULL;

SHOW COLUMNS FROM `community_comment`;

ALTER TABLE `community_comment`
    ADD CONSTRAINT `community_comment_ibfk_1`
        FOREIGN KEY (`writer`) REFERENCES `member` (`nickname`)
            ON DELETE SET NULL
            ON UPDATE CASCADE;

ALTER TABLE community_comment
    DROP FOREIGN KEY community_comment_ibfk_1;

SELECT CONSTRAINT_NAME, TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'teamPrj1126';


SELECT *
FROM community_comment;
DELETE
FROM community_comment
WHERE id = 30;

SELECT *
FROM community_comment
WHERE community_id = 57;

SELECT COUNT(*)
FROM community_comment
WHERE community_id = 63;