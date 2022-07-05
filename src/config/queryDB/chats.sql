CREATE TABLE chats (
 id character varying(255) NOT NULL,
 sender character varying(255),
 receiver character varying(255),
 chat_type character varying(255),
 chat character varying(255),
 "isRead" boolean,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT chats.id, userSender.id AS sender_id, userReceiver.id AS receiver_id,
      userSender.name AS sender, userReceiver.name AS receiver, chats.chat,
      userSender.avatar AS sender_Avatar, userReceiver.avatar AS receiver_avatar,
      chats.created_at FROM chats
      LEFT JOIN users AS userSender ON chats.sender = userSender.id
      LEFT JOIN users AS userReceiver ON chats.receiver = userReceiver.id
      WHERE (sender = '52912ed5-d0b1-4d28-852f-c8c4ab7d9853' AND receiver='3e832e71-5fea-420c-a6bb-c2a961069c9e')
      OR (sender='3e832e71-5fea-420c-a6bb-c2a961069c9e' AND receiver='52912ed5-d0b1-4d28-852f-c8c4ab7d9853')

INSERT INTO chats(id, sender, receiver, chat, "isRead") VALUES ('c1', '52912ed5-d0b1-4d28-852f-c8c4ab7d9853', '3e832e71-5fea-420c-a6bb-c2a961069c9e', 'halo bro', false);
INSERT INTO chats(id, sender, receiver, chat, "isRead") VALUES ('c1', '52912ed5-d0b1-4d28-852f-c8c4ab7d9853', '3e832e71-5fea-420c-a6bb-c2a961069c9e', 'iya bro', false);