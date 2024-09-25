CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DATABASE user_info;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_picture TEXT NOT NULL
);

-- INSERT INTO users (name, email, profile_picture) VALUES ('Tharushi Manawage','tharushimanawage02@gmail.com','');

SELECT * FROM users;

CREATE TABLE user_token (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  idp_subject_id TEXT NOT NULL,
  idp_access_token TEXT NOT NULL,
  idp_access_token_expires_at DATE TIME NOT NULL,
  idp_refresh_token TEXT NOT NULL,
  idp_refresh_token_expires_at DATE TIME NOT NULL,
  app_refresh_token TEXT NOT NULL,
  app_refresh_token_expires_at DATE TIME NOT NULL,
  created_at DATE TIME NOT NULL,
  updated_at DATE TIME NOT NULL
);

SELECT * FROM user_token;

CREATE TABLE auth_state (
  state TEXT PRIMARY KEY,
  nonce TEXT NOT NULL,
  code_challenge TEXT NOT NULL,
  origin_url TEXT NOT NULL
);

SELECT * FROM auth_state;

CREATE TABLE signing_key (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signing_key TEXT NOT NULL,
  expires_at DATE TIME NOT NULL,
  is_revoked BOOLEAN NOT NULL
);

SELECT * FROM signing_key;

CREATE POLICY user_policy ON users USING (id = current_config('user_id'));