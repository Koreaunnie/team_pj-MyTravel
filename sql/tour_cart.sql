USE teamPrj1126;

CREATE TABLE tour_cart
(
    tour_id      INT REFERENCES tour (id),
    member_email VARCHAR(30) REFERENCES member (email),
    PRIMARY KEY (tour_id, member_email)
);