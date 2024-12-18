USE teamPrj1126;

CREATE TABLE notice_like
(
    notice_id INT REFERENCES notice (id),
    person    VARCHAR(20) REFERENCES member (nickname),
    PRIMARY KEY (notice_id, person)
);

# 닉네임 수정에 따른 새로운 컬럼과 조건 수정

SHOW COLUMNS FROM notice_like;

ALTER TABLE `notice_like`
    ADD CONSTRAINT `notice_like_ibfk_2`
        FOREIGN KEY (`person`) REFERENCES `member` (`nickname`)
            ON UPDATE CASCADE;

ALTER TABLE notice_like
    DROP FOREIGN KEY notice_like_ibfk_2;

SELECT *
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'teamPrj1126';