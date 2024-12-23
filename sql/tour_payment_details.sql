USE teamPrj1126;

CREATE TABLE payment_detail
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    payment_id VARCHAR(30) REFERENCES payment (payment_id),
    tour_id    INT DEFAULT 0 REFERENCES tour (id) ON DELETE SET DEFAULT,
    startDate  DATE,
    endDate    DATE,
    price      INT
);

DROP TABLE payment_detail;

SHOW CREATE TABLE payment_detail;

SELECT paid_at, buyer_email, p.payment_id as paymentId, product, pd.price, currency
FROM payment p
         RIGHT JOIN payment_detail pd ON p.payment_id = pd.payment_id
         LEFT JOIN tour ON tour.id=pd.tour_id
WHERE
    buyer_email LIKE CONCAT('%', '7', '%')
   OR p.payment_id LIKE CONCAT('%', '2', '%')
    ORDER BY paid_at DESC
    LIMIT 0, 10;

