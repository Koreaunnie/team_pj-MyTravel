USE teamPrj1126;

CREATE TABLE community_comment
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    comment      VARCHAR(1000),
    writer       VARCHAR(20) NOT NULL REFERENCES member (nickname),
    inserted     DATETIME DEFAULT NOW(),
    community_id INT         NOT NULL REFERENCES community (id)
);


SELECT *
FROM community_comment;

SELECT *
FROM community_comment
WHERE community_id = 57;