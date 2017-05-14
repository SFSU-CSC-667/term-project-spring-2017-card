DROP DATABASE IF EXISTS battleship;
CREATE DATABASE battleship;

\c battleship;

drop table if exists player;
CREATE TABLE player (
    id SERIAL PRIMARY KEY,
    username VARCHAR(16) UNIQUE NOT NULL CHECK (username <> ''),
    password character varying(100),
    is_logged_in boolean DEFAULT false NOT NULL,
    socket_id character varying(50)
);

drop table if exists board_state;
CREATE TABLE board_state (
    position_x integer,
    position_y integer,
    game_id integer NOT NULL,
    player_id integer NOT NULL,
    ship_id integer NOT NULL,
    hit boolean DEFAULT false NOT NULL
);

drop table if exists chat;
CREATE TABLE chat (
    game_id integer NOT NULL,
    message character varying(500) NOT NULL,
    "time" timestamp without time zone NOT NULL,
    player_id integer NOT NULL
);

drop table if exists game;
CREATE TABLE game (
    id SERIAL PRIMARY KEY,
    player1_id integer NOT NULL,
    player2_id integer,
    player1_score integer DEFAULT 0 NOT NULL,
    player2_score integer DEFAULT 0 NOT NULL,
    player1_turn boolean DEFAULT true NOT NULL,
    socket_created character varying(30) NOT NULL,
    game_full BOOLEAN DEFAULT false
);

drop table if exists high_score;
CREATE TABLE high_score (
    score integer DEFAULT 0 NOT NULL,
    ship_sunk integer,
    misses integer,
    hits integer,
    user_id integer
);

drop table if exists ship;
CREATE TABLE ship (
    id SERIAL PRIMARY KEY,
    ship_owner integer NOT NULL,
    size integer DEFAULT 1 NOT NULL
);

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_game_id_fkey FOREIGN KEY (game_id) REFERENCES game(id);

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id);

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_ship_id_fkey FOREIGN KEY (ship_id) REFERENCES ship(id);

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_game_id_fkey FOREIGN KEY (game_id) REFERENCES game(id);

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id);

ALTER TABLE ONLY game
    ADD CONSTRAINT fk_player1 FOREIGN KEY (player1_id) REFERENCES player(id);

ALTER TABLE ONLY game
    ADD CONSTRAINT fk_player2 FOREIGN KEY (player2_id) REFERENCES player(id);

ALTER TABLE ONLY high_score
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES player(id);

ALTER TABLE ONLY ship
    ADD CONSTRAINT ship_player_id_fk FOREIGN KEY (ship_owner) REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE;
