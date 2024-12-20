USE teamPrj1126;

DESC tour;

CREATE TABLE tour
(
    `id`           int(11)      NOT NULL AUTO_INCREMENT,
    `title`        varchar(100) NOT NULL,
    `product`      varchar(50)  NOT NULL,
    `price`        int(11)       DEFAULT NULL,
    `location`     varchar(50)   DEFAULT NULL,
    `content`      varchar(5000) DEFAULT NULL,
    `partner`      varchar(20)   DEFAULT NULL,
    `partnerEmail` varchar(30)   DEFAULT 'LEFT',
    `active`       tinyint(1)    DEFAULT 1,
    `inserted`     datetime      DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `partnerEmail` (`partnerEmail`),
    KEY `tour_ibfk_1` (`partner`),
    CONSTRAINT `tour_ibfk_1` FOREIGN KEY (`partner`) REFERENCES `member` (`nickname`) ON DELETE SET NULL ON UPDATE CASCADE
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

SELECT id, t.title, writer_nickname, review, COUNT(review_id), SUM(rating), AVG(rating)
FROM tour_review tr
         LEFT JOIN tour t ON t.id = tr.tour_id
GROUP BY id;

SELECT id,
       t.title,
       writer_nickname,
       review,
       COUNT(review_id) reviewCnt,
       SUM(rating),
       AVG(rating)      reviewAvg,
       product,
       price,
       location,
       ti.name          image,
       active
FROM tour t
         LEFT JOIN tour_review tr ON t.id = tr.tour_id
         LEFT JOIN tour_img ti ON t.id = ti.tour_id
WHERE active = 1
  AND ti.tour_id = 91
GROUP BY id;

SELECT AVG(rating)
FROM tour t
         LEFT JOIN tour_review tr ON t.id = tr.tour_id
WHERE active = true
  AND id = 73
GROUP BY id
ORDER BY id DESC;

SELECT id,
       title,
       product,
       price,
       location,
       ti.name                       image,
       active,
       COUNT(DISTINCT review_id)     reviewCnt,
       (SELECT AVG(tr_sub.rating)
        FROM tour_review tr_sub
        WHERE tr_sub.tour_id = t.id) reviewAvg,
       (SELECT SUM(tr_sub.rating)
        FROM tour_review tr_sub
        WHERE tr_sub.tour_id = t.id) reviewSum
FROM tour t
         LEFT JOIN tour_img ti ON t.id = ti.tour_id
         LEFT JOIN tour_review tr ON t.id = tr.tour_id
WHERE t.active = true
GROUP BY id
ORDER BY id DESC
