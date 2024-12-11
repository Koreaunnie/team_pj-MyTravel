USE teamPrj1126;

CREATE TABLE inquiry
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    writer          VARCHAR(30)  NOT NULL REFERENCES member (email),
    writer_nickname VARCHAR(20)  NOT NULL,
    category        VARCHAR(20)  NOT NULL,
    title           VARCHAR(50)  NOT NULL,
    content         VARCHAR(500) NOT NULL,
    secret          BOOLEAN   DEFAULT FALSE,
    inserted        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE inquiry;

SHOW CREATE TABLE inquiry;

ALTER TABLE `inquiry`
    DROP COLUMN `writer`;

ALTER TABLE inquiry
    ADD COLUMN writer VARCHAR(30) NOT NULL REFERENCES member (email);

ALTER TABLE inquiry
    ADD COLUMN writer_nickname VARCHAR(20) NOT NULL AFTER writer;