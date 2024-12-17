USE teamPrj1126;

CREATE TABLE community_like
(
    community_id INT REFERENCES community (id),
    person       VARCHAR(20) REFERENCES member (nickname),
    PRIMARY KEY (community_id, person)
);


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