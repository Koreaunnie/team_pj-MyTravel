USE teamPrj1126;

CREATE TABLE wallet
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    date           DATE        NOT NULL,
    category       VARCHAR(50),
    title          VARCHAR(50) NOT NULL,
    income         INT       DEFAULT 0,
    expense        INT       DEFAULT 0,
    payment_method VARCHAR(50),
    memo           VARCHAR(100),
    inserted       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE wallet;