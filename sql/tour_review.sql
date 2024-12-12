CREATE TABLE tour_review
(
    review_id       INT PRIMARY KEY AUTO_INCREMENT,
    tour_id         INT          NOT NULL REFERENCES tour (id),
    writer_email    VARCHAR(30) DEFAULT 'left',
    writer_nickname VARCHAR(20) DEFAULT '탈퇴한 회원',
    comment         VARCHAR(500) NOT NULL,
    inserted        DATETIME     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_writer_email FOREIGN KEY (writer_email)
        REFERENCES member (email)
        ON DELETE SET DEFAULT
        ON UPDATE CASCADE,
    CONSTRAINT fk_writer_nickname FOREIGN KEY (writer_nickname)
        REFERENCES member (nickname)
        ON DELETE SET DEFAULT
        ON UPDATE CASCADE
);

INSERT INTO tour_review
    (tour_id, writer_email, writer_nickname, comment)
VALUES (1, 'jm@jm', 'mj', '너무 좋다');