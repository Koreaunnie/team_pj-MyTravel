USE teamPrj1126;

CREATE TABLE tour_payment
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    tour_id      INT REFERENCES tour (id),
    order_id     VARCHAR(30),
    member_email VARCHAR(30) REFERENCES member (email),
    startDate    DATE,
    endDate      DATE,
    paid_at      DATETIME DEFAULT NOW()
);

DROP TABLE tour_payment;
