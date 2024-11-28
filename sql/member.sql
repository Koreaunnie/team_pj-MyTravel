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
WHERE email = 'c';