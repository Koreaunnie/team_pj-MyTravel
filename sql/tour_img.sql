USE teamPrj1126;

CREATE TABLE tour_img
(
    tour_id INT REFERENCES tour (id),
    name    VARCHAR(300) NOT NULL,
    PRIMARY KEY (tour_id, name)
);