CREATE DATABASE IF NOT EXISTS e_agenda;
USE e_agenda;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS user_disciplines;
DROP TABLE IF EXISTS class_members;
DROP TABLE IF EXISTS user_parents;
DROP TABLE IF EXISTS messages_destinations;
DROP TABLE IF EXISTS event_users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS disciplines;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A'
);
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A'
);
INSERT INTO roles (name)
VALUES ('admin');
INSERT INTO roles (name)
VALUES ('staff');
INSERT INTO roles (name)
VALUES ('teachers');
INSERT INTO roles (name)
VALUES ('students');
INSERT INTO roles (name)
VALUES ('parents');
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE (user_id)
);
CREATE TABLE IF NOT EXISTS disciplines (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A'
);
CREATE TABLE IF NOT EXISTS user_disciplines (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  discipline_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE,
  UNIQUE (user_id, discipline_id)
);
CREATE TABLE IF NOT EXISTS classes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A'
);
CREATE TABLE IF NOT EXISTS class_members (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  class_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  member_type ENUM('teacher', 'student') NOT NULL,
  status char(1) DEFAULT 'A',
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (class_id, user_id, member_type)
);
CREATE TABLE IF NOT EXISTS user_parents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  parent_id BIGINT NOT NULL,
  relationship ENUM('mother', 'father', 'guardian', 'other') NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, parent_id)
);
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  sender_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type CHAR(1) NOT NULL DEFAULT 'I',
  destination BIGINT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A',
  FOREIGN KEY (sender_id) REFERENCES users(id)
);
CREATE TABLE messages_destinations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  communication_id BIGINT NOT NULL,
  destination_type ENUM('user', 'role', 'class'),
  destination_id BIGINT NOT NULL,
  FOREIGN KEY (communication_id) REFERENCES messages(id)
);
CREATE TABLE IF NOT EXISTS events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  created_by BIGINT NOT NULL,
  status char(1) DEFAULT 'A',
  FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS event_users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  user_type ENUM('teacher', 'student', 'parent'),
  created_at DATETIME DEFAULT NOW(),
  status char(1) DEFAULT 'A',
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);