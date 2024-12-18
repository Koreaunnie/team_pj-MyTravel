USE teamPrj1126;

CREATE TABLE tour_review_img
(
    review_id INT,
    name      VARCHAR(300) NOT NULL,
    PRIMARY KEY (review_id, name),
    FOREIGN KEY (review_id)
        REFERENCES tour_review (review_id)
        ON DELETE CASCADE
);

# DROP TABLE tour_review_img;

SELECT *
FROM tour_review tr
         LEFT JOIN tour_review_img tri ON tr.review_id = tri.review_id
WHERE tour_id = 73
ORDER BY tr.review_id DESC;
