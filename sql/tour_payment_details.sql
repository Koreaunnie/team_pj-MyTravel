USE teamPrj1126;

CREATE TABLE payment_detail
(
    payment_id VARCHAR(30) REFERENCES payment (payment_id),
    tour_id    INT REFERENCES tour (id),
    startDate  DATE,
    endDate    DATE,
    price      INT,
    PRIMARY KEY (payment_id, tour_id)
);

DROP TABLE payment_detail;

