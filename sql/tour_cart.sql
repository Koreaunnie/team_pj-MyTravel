USE teamPrj1126;

CREATE TABLE tour_cart
(
    tour_id      INT REFERENCES tour (id),
    member_email VARCHAR(30) REFERENCES member (email),
    PRIMARY KEY (tour_id, member_email)
);

SELECT id, title, product, price, location, partnerEmail, member_email
FROM tour_cart tc
         LEFT JOIN tour t ON tc.tour_id = t.id
WHERE tc.member_email = 'admin';

