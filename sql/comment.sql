CREATE TABLE comment
(
    id              INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    inquiry_id      INT         NOT NULL REFERENCES inquiry (id) ON DELETE CASCADE,
    member_email    VARCHAR(30) NOT NULL REFERENCES member (email) ON DELETE CASCADE,
    member_nickname VARCHAR(20) NOT NULL,
    comment         TEXT        NOT NULL,
    inserted        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE comment;