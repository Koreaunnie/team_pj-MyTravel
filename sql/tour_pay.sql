USE teamPrj1126;
#
# CREATE TABLE tour_pay
# (
#     tour_id      INT REFERENCES tour (id),
#     member_email VARCHAR(30) REFERENCES member (email),
#     startDate    DATE REFERENCES tour_cart (startDate),
#     endDate      DATE REFERENCES tour_cart (endDate),
#     PRIMARY KEY (tour_id, member_email)
# );