USE teamPrj1126;

CREATE TABLE notice
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    title    VARCHAR(100),
    content  VARCHAR(5000),
    writer   VARCHAR(20) NOT NULL REFERENCES member (nickname),
    inserted DATETIME DEFAULT NOW(),
    views    INT      DEFAULT 0
);

INSERT INTO notice (title, content, writer)
VALUES ('봉기다', '봉기야', '피를로');