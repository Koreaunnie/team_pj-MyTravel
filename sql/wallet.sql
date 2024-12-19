USE teamPrj1126;

CREATE TABLE wallet
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    date           DATE        NOT NULL,
    category       VARCHAR(50),
    title          VARCHAR(50) NOT NULL,
    income         INT       DEFAULT 0,
    expense        INT       DEFAULT 0,
    payment_method VARCHAR(50),
    memo           VARCHAR(100),
    inserted       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    writer         VARCHAR(20) NOT NULL REFERENCES member (email)
);

DROP TABLE wallet;

SELECT DISTINCT category
FROM wallet;

ALTER TABLE wallet
    ADD COLUMN writer VARCHAR(20) NOT NULL REFERENCES member (email) AFTER inserted;

-- 1. 기존 외래 키 제약 조건 삭제
ALTER TABLE `wallet`
    DROP FOREIGN KEY `wallet_ibfk_1`;

-- 2. 새로운 외래 키 제약 조건 추가 (ON DELETE CASCADE)
ALTER TABLE `wallet`
    ADD CONSTRAINT `wallet_ibfk_1`
        FOREIGN KEY (`writer`) REFERENCES `member` (`email`) ON DELETE CASCADE;


SHOW CREATE TABLE wallet;