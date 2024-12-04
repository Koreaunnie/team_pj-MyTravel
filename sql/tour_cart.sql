USE teamPrj1126;

CREATE TABLE tour_cart
(
    tour_id      INT REFERENCES tour (id),
    member_email VARCHAR(30) REFERENCES member (email),
    PRIMARY KEY (tour_id, member_email)
);

SELECT id, title, product, price, location, partnerEmail, ti.name
FROM tour_cart tc
         LEFT JOIN tour t ON tc.tour_id = t.id
         LEFT JOIN tour_img ti ON tc.tour_id = ti.tour_id
WHERE tc.member_email = 'admin';

SELECT id, title, product, price, location, ti.name image
FROM tour_cart tc
         LEFT JOIN tour t ON t.id = tc.tour_id
         LEFT JOIN tour_img ti ON tc.tour_id = ti.tour_id
WHERE tc.member_email = 2
GROUP BY id;

ALTER TABLE tour_cart
    ADD COLUMN startDate DATE,
    ADD COLUMN endDate   DATE;