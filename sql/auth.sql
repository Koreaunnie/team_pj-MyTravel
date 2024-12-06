USE teamPrj1126;

CREATE TABLE auth
(
    member_email VARCHAR(30) REFERENCES member (email),
    auth         VARCHAR(20) NOT NULL,
    PRIMARY KEY (member_email, auth)
);

INSERT INTO auth
VALUES ('jm@jm', 'admin');

