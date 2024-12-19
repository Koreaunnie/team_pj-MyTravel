USE teamPrj1126;

CREATE TABLE faq
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    `question` VARCHAR(50)  NOT NULL,
    answer     VARCHAR(500) NOT NULL,
    writer     VARCHAR(20)  NOT NULL REFERENCES member (nickname),
    inserted   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `faq`
(
    `id`       int(11)      NOT NULL AUTO_INCREMENT,
    `question` varchar(50)  NOT NULL,
    `answer`   varchar(500) NOT NULL,
    `writer`   varchar(20)  NOT NULL,
    `inserted` timestamp    NULL DEFAULT current_timestamp(),
    `updated`  timestamp    NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `faq_ibfk_1` (`writer`),
    CONSTRAINT `faq_ibfk_1` FOREIGN KEY (`writer`) REFERENCES `member` (`nickname`) ON UPDATE CASCADE
);

# DROP TABLE faq;

SHOW CREATE TABLE faq;

-- 기존 외래 키 제약 조건 삭제
ALTER TABLE faq
    DROP CONSTRAINT faq_ibfk_1;

-- 새로운 외래 키 제약 조건 추가 (ON UPDATE CASCADE)
ALTER TABLE faq
    ADD CONSTRAINT faq_ibfk_1
        FOREIGN KEY (writer)
            REFERENCES member (nickname)
            ON UPDATE CASCADE;