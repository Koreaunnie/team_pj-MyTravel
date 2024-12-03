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

SELECT *
FROM tour
WHERE id = 61;
