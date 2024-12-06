USE teamPrj1126;

CREATE TABLE inquiry_file
(
    inquiry_id INT REFERENCES inquiry (id),
    name       VARCHAR(100) NOT NULL,
    PRIMARY KEY (inquiry_id, name)
);

DROP TABLE inquiry;
DROP TABLE inquiry_file;