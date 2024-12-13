CREATE TABLE tour_review
(
    review_id       INT PRIMARY KEY AUTO_INCREMENT,
    tour_id         INT          NOT NULL REFERENCES tour (id),
    writer_email    VARCHAR(30) DEFAULT 'left',
    writer_nickname VARCHAR(20) DEFAULT '탈퇴한 회원',
    review         VARCHAR(500) NOT NULL,
    inserted        DATETIME     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_writer_email FOREIGN KEY (writer_email)
        REFERENCES member (email)
        ON DELETE SET DEFAULT
        ON UPDATE CASCADE,
    CONSTRAINT fk_writer_nickname FOREIGN KEY (writer_nickname)
        REFERENCES member (nickname)
        ON DELETE SET DEFAULT
        ON UPDATE CASCADE
);

INSERT INTO tour_review
    (tour_id, writer_email, writer_nickname, review)
VALUES (1, 'jm@jm', 'mj', '너무 좋다');

SELECT COUNT(*)
FROM payment_detail pd LEFT JOIN payment p ON pd.payment_id=p.payment_id
WHERE p.buyer_email='2'
  AND pd.tour_id='68';

SELECT p.payment_id, product, location, currency, paid_at, pd.tour_id, startDate, endDate, tour.price, review, writer_email
FROM payment p
    RIGHT JOIN payment_detail pd
    ON p.payment_id=pd.payment_id
    LEFT JOIN tour ON tour.id=pd.tour_id
    LEFT JOIN tour_review tr ON tr.payment_id = p.payment_id
WHERE buyer_email = 'a'
ORDER BY paid_at DESC;

SELECT payment.payment_id, product, location, currency, paid_at, tour.id, startDate, endDate, tour.price, review
FROM payment RIGHT JOIN payment_detail
                        ON payment.payment_id=payment_detail.payment_id
             LEFT JOIN tour ON tour.id=payment_detail.tour_id
             LEFT JOIN tour_review tr ON tr.payment_id = payment.payment_id
WHERE buyer_email = 'jm@jm'
ORDER BY paid_at DESC;


ALTER TABLE tour_review
ADD COLUMN payment_id VARCHAR(30) REFERENCES payment(payment_id);

SHOW CREATE TABLE tour_review;

SELECT p.payment_id, paid_at, pd.tour_id, startDate, endDate
FROM payment p
         RIGHT JOIN payment_detail pd ON p.payment_id=pd.payment_id
         LEFT JOIN tour ON tour.id=pd.tour_id
         LEFT JOIN tour_review tr ON tr.payment_id = p.payment_id AND tr.tour_id = tour.id
WHERE buyer_email = 'jm@jm'
  AND pd.tour_id = 69
  AND review IS NULL
ORDER BY paid_at DESC;