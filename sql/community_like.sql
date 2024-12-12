USE teamPrj1126;

CREATE TABLE community_like
(
    community_id INT REFERENCES community (id),
    writer       VARCHAR(20) REFERENCES member (nickname),
    PRIMARY KEY (community_id, writer)
);

