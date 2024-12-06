USE teamPrj1126;

CREATE TABLE payment_detail
(
    payment_id VARCHAR(30) REFERENCES payment (payment_id),
    tour_id    INT DEFAULT 0 REFERENCES tour (id) ON DELETE SET DEFAULT,
    startDate  DATE,
    endDate    DATE,
    price      INT,
    PRIMARY KEY (payment_id, tour_id)
);

DROP TABLE payment_detail;


