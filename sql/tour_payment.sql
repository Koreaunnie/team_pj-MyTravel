USE teamPrj1126;

CREATE TABLE tour_payment
(
    payment_id   INT AUTO_INCREMENT PRIMARY KEY,
    tour_id      INT REFERENCES tour (id),
    order_id     INT REFERENCES tour_orders (order_id),
    member_email VARCHAR(30) REFERENCES member (email),
    paid_at      DATETIME DEFAULT NOW()
);
