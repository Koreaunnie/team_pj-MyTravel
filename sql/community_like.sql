USE teamPrj1126;

CREATE TABLE community_like
(
    community_id INT REFERENCES community (id),
    person       VARCHAR(20) REFERENCES member (nickname),
    PRIMARY KEY (community_id, person)
);

# 닉네임 수정에 따른 새로운 컬럼과 조건 수정


SHOW COLUMNS FROM `community_like`;

ALTER TABLE `community_like`
    ADD CONSTRAINT `community_like_ibfk_1`
        FOREIGN KEY (`person`) REFERENCES `member` (`nickname`)
            ON UPDATE CASCADE;

ALTER TABLE community_like
    DROP FOREIGN KEY community_like_ibfk_1;

SELECT CONSTRAINT_NAME, TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'teamPrj1126';



SELECT community_id communityId, person nickName
FROM community_like
WHERE person = '마르키시오';

INSERT INTO community_like (community_id, person)
VALUES (78, '피아니치');

DELETE
FROM community_like
WHERE community_id = 40
  AND person = '마르키시오';

SELECT *
FROM community_like;

SELECT COUNT(*)
FROM community_like
WHERE community_id = 80;

SELECT COUNT(*)
FROM community_like
WHERE community_id = 78
  AND person = '부폰';