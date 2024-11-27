USE teamPrj1126;

CREATE TABLE plan
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    inserted    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title       VARCHAR(20),
    description VARCHAR(50),
    destination VARCHAR(20),
    due         VARCHAR(20)
);

DROP TABLE plan;