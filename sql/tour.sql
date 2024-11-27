USE teamPrj1126;

DESC tour;


DROP TABLE tour;


CREATE TABLE tour (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    title VARCHAR(100) NOT NULL,
    product VARCHAR(50) NOT NULL ,
    price INT,
    location VARCHAR(50),
    content VARCHAR(5000),
    partner varchar(20) REFERENCES member(nickname),
    inserted DATETIME
);