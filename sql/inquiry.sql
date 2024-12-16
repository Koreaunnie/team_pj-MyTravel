USE teamPrj1126;

CREATE TABLE inquiry
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    writer          VARCHAR(30)  NOT NULL REFERENCES member (email) ON DELETE CASCADE,
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
    DROP FOREIGN KEY `inquiry_ibfk_1`;

ALTER TABLE inquiry
    MODIFY writer VARCHAR(30) NOT NULL,
    ADD CONSTRAINT inquiry_ibfk_1
        FOREIGN KEY (writer) REFERENCES member (email) ON DELETE CASCADE;

ALTER TABLE inquiry
    MODIFY COLUMN writer VARCHAR(30) NOT NULL;