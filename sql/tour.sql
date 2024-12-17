USE teamPrj1126;

DESC tour;


DROP TABLE tour;


CREATE TABLE tour
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    title    VARCHAR(100) NOT NULL,
    product  VARCHAR(50)  NOT NULL,
    price    INT,
    location VARCHAR(50),
    content  VARCHAR(5000),
    partner  varchar(20) REFERENCES member (nickname),
    inserted DATETIME
);

SELECT id, title, product, price, location, MIN(name) AS image
FROM tour
         LEFT JOIN tour_img ON tour.id = tour_img.tour_id
WHERE id = 1
GROUP BY id
ORDER BY id DESC;

SELECT tour.id, MIN(name) name
FROM tour_img
         RIGHT JOIN tour ON tour_img.tour_id = tour.id
WHERE tour.id = 3
GROUP BY tour.id
ORDER BY tour.id DESC;


ALTER TABLE tour
    ADD partnerEmail VARCHAR(30) REFERENCES member (email);

ALTER TABLE tour
    ADD inserted DATETIME DEFAULT NOW();

DESC tour;

SELECT *
FROM tour
WHERE id = 61;

ALTER TABLE tour
    ADD activate BOOLEAN DEFAULT true;

ALTER TABLE tour
    DROP COLUMN inserted;

ALTER TABLE tour
    RENAME COLUMN activate TO active;

ALTER TABLE tour
    MODIFY partnerEmail VARCHAR(30) DEFAULT '탈퇴한 회원';

ALTER TABLE tour
    DROP FOREIGN KEY tour_ibfk_2;

ALTER TABLE tour
    ADD CONSTRAINT tour_ibfk_2
        FOREIGN KEY (partner) REFERENCES member (nickname)
            ON DELETE SET NULL;

SHOW CREATE TABLE tour;


SELECT id, title, product, price, location, ti.name image, active
FROM tour t
         LEFT JOIN tour_img ti ON t.id = ti.tour_id
WHERE title LIKE CONCAT('%', '유후인', '%')
GROUP BY id
ORDER BY id DESC
LIMIT 10, 10;

SELECT *
FROM plan p
         JOIN plan_field pf
              ON p.id = pf.plan_id
WHERE title LIKE CONCAT('%', '피자', '%')
GROUP BY p.id
ORDER BY p.updated DESC, p.inserted DESC;


ALTER TABLE `tour`
    ADD CONSTRAINT `tour_ibfk_1`
        FOREIGN KEY (`partner`) REFERENCES `member` (`nickname`)
            ON DELETE SET NULL
            ON UPDATE CASCADE;