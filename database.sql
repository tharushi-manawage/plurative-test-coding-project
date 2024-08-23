CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE user_info;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO users (name, email, password) VALUES ('Tharushi Manawage','tharushimanawage02@gmail.com','1286290@tM');

SELECT * FROM users;

CREATE TABLE user_token (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idp_access_token TEXT NOT NULL,
  idp_access_token_expires_at DATE TIME NOT NULL,
  idp_refresh_token TEXT NOT NULL,
  idp_refresh_token_expires_at DATE TIME NOT NULL,
  app_refresh_token TEXT NOT NULL,
  app_refresh_token_expires_at DATE TIME NOT NULL

  SELECT * FROM user_token;
);