CREATE TABLE plan_field
(
    plan_id  INT NOT NULL,
    id       INT AUTO_INCREMENT PRIMARY KEY,
    date     DATE,
    time     TIME,
    schedule VARCHAR(100),
    place    VARCHAR(100),
    place_id VARCHAR(100),
    memo     TEXT,
    FOREIGN KEY (plan_id) REFERENCES plan (id) ON DELETE CASCADE
);

DROP TABLE plan_field;

ALTER TABLE plan_field
    MODIFY schedule VARCHAR(100);

ALTER TABLE plan_field
    ADD place_id VARCHAR(100) AFTER place;