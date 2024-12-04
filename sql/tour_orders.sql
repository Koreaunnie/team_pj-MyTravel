USE teamPrj1126;

CREATE TABLE tour_orders
(
    order_id       INT AUTO_INCREMENT PRIMARY KEY,
    tour_id        INT REFERENCES tour (id),
    member_email   VARCHAR(30) REFERENCES member (email),
    pay_method     VARCHAR(30),
    order_date     DATETIME DEFAULT NOW(),
    payment_status BOOLEAN
);