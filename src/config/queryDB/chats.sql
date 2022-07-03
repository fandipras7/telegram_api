CREATE TABLE chats (
 id character varying(255) NOT NULL,
 sender character varying(255),
 receiver character varying(255),
 chat_type character varying(255),
 chat character varying(255),
 "isRead" boolean,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);