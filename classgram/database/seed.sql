USE classgram_db;

INSERT INTO users (username, email, password, profile_pic, bio)
VALUES
('alice', 'alice@example.com', '$2a$10$6HhO0r7Qm3o7rD1sS9GxZuqe8qf5UFxHq9oTj6b2b3V8Q7sD7x1iS', '', 'Hi I am Alice'),
('bob', 'bob@example.com',   '$2a$10$6HhO0r7Qm3o7rD1sS9GxZuqe8qf5UFxHq9oTj6b2b3V8Q7sD7x1iS', '', 'Bob here');
-- password for both is: password

INSERT INTO followers (follower_id, following_id) VALUES (1,2),(2,1);

INSERT INTO posts (user_id, content, image_url) VALUES
(1, 'First day of class!', 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800'),
(2, 'Project time', 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800');
