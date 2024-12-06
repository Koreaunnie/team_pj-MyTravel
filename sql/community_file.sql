USE teamPrj1126;

CREATE TABLE community_file
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    file_name    VARCHAR(200) NOT NULL,
    community_id INT          NOT NULL REFERENCES community (id)
);

ALTER TABLE community_file
    ADD COLUMN file BLOB NOT NULL;

SELECT *
FROM community_file;

DROP TABLE community_file;