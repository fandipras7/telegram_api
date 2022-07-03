CREATE TABLE users (
    id character varying(255) NOT NULL,
    username character varying(255),
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(15),
    bio character varying(255),
    avatar character varying(255),
    updated_at TIMESTAMP
);