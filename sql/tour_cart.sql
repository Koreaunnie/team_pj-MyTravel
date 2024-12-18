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

-- 기존 외래 키 제약 조건 삭제
ALTER TABLE tour_cart
    DROP CONSTRAINT tour_cart_ibfk_2;

-- 새로운 외래 키 제약 조건 추가 (ON UPDATE CASCADE)
ALTER TABLE tour_cart
    ADD CONSTRAINT tour_cart_ibfk_2
        FOREIGN KEY (member_email)
            REFERENCES member (email)
            ON UPDATE CASCADE;

SHOW CREATE TABLE tour_cart;