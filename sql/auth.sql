USE teamPrj1126;

CREATE TABLE auth
(
    member_email VARCHAR(30) REFERENCES member (email),
    auth         VARCHAR(20) NOT NULL,
    PRIMARY KEY (member_email, auth)
);

INSERT INTO auth
VALUES ('1', 'admin');

SHOW CREATE TABLE auth;

-- 기존 외래 키 제약 조건 삭제
ALTER TABLE auth
    DROP CONSTRAINT auth_ibfk_1;

-- 새로운 외래 키 제약 조건 추가 (ON UPDATE CASCADE)
ALTER TABLE auth
    ADD CONSTRAINT auth_ibfk_1
        FOREIGN KEY (member_email)
            REFERENCES member (email)
            ON UPDATE CASCADE;

UPDATE member
SET email='hana@hanmail.net'
WHERE email = 'hana';

SELECT email
FROM member
WHERE email = 'hana'


SELECT *
FROM member
LEFT JOIN auth
ON auth.member_email = member.email
WHERE
    auth.auth IS NULL
    AND(
    email LIKE CONCAT('%', '@', '%')
   OR phone LIKE CONCAT('%', '010', '%'))
ORDER BY inserted DESC;