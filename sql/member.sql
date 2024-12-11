USE teamPrj1126;

CREATE TABLE member
(
    email    VARCHAR(30) PRIMARY KEY,
    nickname VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(30) NOT NULL,
    name     VARCHAR(20) NOT NULL,
    phone    VARCHAR(20) NOT NULL,
    inserted DATETIME DEFAULT NOW()
);

# DROP TABLE member;

ALTER TABLE member
    ADD picture VARCHAR(300);

SELECT picture
FROM member
WHERE email = 'fire';

SELECT *
FROM member
WHERE name = '2';

ALTER TABLE member
    ADD kakao BOOLEAN DEFAULT FALSE;

INSERT INTO member
    (email, nickname, password, name, member.phone, kakao)
VALUES ('3829160102', '아로', 'a', '아로', '0', TRUE);