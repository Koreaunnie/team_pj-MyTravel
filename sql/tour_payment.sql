USE teamPrj1126;

CREATE TABLE payment
(
    payment_id  VARCHAR(30) PRIMARY KEY,
    buyer_email VARCHAR(30) REFERENCES member (email),
    pay_method  VARCHAR(30),
    currency    VARCHAR(30),
    amount      INT,
    paid_at     DATETIME DEFAULT NOW()
);

DROP TABLE payment;
