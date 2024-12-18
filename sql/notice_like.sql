USE teamPrj1126;

CREATE TABLE notice_like
(
    notice_id INT REFERENCES notice (id),
    person    VARCHAR(20) REFERENCES member (nickname),
    PRIMARY KEY (notice_id, person)
);