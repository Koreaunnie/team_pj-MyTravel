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

SELECT payment.payment_id, currency, paid_at, tour_id, startDate, endDate, tour.price
FROM payment
         RIGHT JOIN payment_detail
                    ON payment.payment_id = payment_detail.payment_id
         LEFT JOIN tour ON tour.id = payment_detail.tour_id
WHERE buyer_email = 2
ORDER BY paid_at DESC;

SELECT paid_at, buyer_email, p.payment_id, product, pd.price, currency
FROM payment p
         RIGHT JOIN payment_detail pd ON p.payment_id = pd.payment_id
         LEFT JOIN tour ON tour.id = pd.tour_id
ORDER BY paid_at DESC;