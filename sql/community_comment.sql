USE teamPrj1126;

CREATE TABLE community_comment
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    inquiryAnswer VARCHAR(1000),
    writer        VARCHAR(20) NOT NULL REFERENCES member (nickname),
    inserted      DATETIME DEFAULT NOW(),
    community_id  INT         NOT NULL REFERENCES community (id)
);


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