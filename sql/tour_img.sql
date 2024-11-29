USE teamPrj1126;

CREATE TABLE tour_img
(
    tour_id INT REFERENCES tour (id),
    name    VARCHAR(300) NOT NULL,
    PRIMARY KEY (tour_id, name)
);

INSERT INTO tour_img
VALUES (32, '경복궁.jpg'),
       (33, 'singapore.jpg'),
       (38, 'sing1'),
       (38, 'singapore.jpg'),
       (1, '유후인.jpg');

UPDATE tour_img
SET name='sing1.jpg'
WHERE tour_id = 38
  AND name = 'sing1';
