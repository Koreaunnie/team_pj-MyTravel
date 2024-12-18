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

# 닉네임 수정에 따른 새로운 컬럼과 조건 수정

ALTER TABLE notice
    MODIFY COLUMN writer VARCHAR(20) NULL;

SHOW COLUMNS FROM notice;

ALTER TABLE `notice`
    ADD CONSTRAINT `notice_ibfk_1`
        FOREIGN KEY (`writer`) REFERENCES `member` (`nickname`)
            ON DELETE SET NULL
            ON UPDATE CASCADE;

ALTER TABLE notice
    DROP FOREIGN KEY notice_ibfk_1;

SELECT CONSTRAINT_NAME, TABLE_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'teamPrj1126';

INSERT INTO notice (title, content, writer)
VALUES ('봉기다', '봉기야', '피를로');