CREATE TABLE plan_field
(
    plan_id  INT          NOT NULL,
    id       INT AUTO_INCREMENT PRIMARY KEY,
    date     DATE,
    time     TIME,
    schedule VARCHAR(100) NOT NULL,
    place    VARCHAR(100),
    memo     TEXT,
    FOREIGN KEY (plan_id) REFERENCES plan (id) ON DELETE CASCADE
);

DROP TABLE plan_field;