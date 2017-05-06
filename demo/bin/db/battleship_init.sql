--
-- chengjiuQL database dump
--

-- Dumped from database version 9.5.1
-- Dumped by pg_dump version 9.5.0

-- Started on 2016-12-18 06:32:20 PST


-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;
-- GRANT ALL ON SCHEMA public TO chengjiu;
-- GRANT ALL ON SCHEMA public TO public;
DROP DATABASE IF EXISTS battleship;
CREATE DATABASE battleship;

\c battleship;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;




SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 180 (class 1259 OID 17147)
-- Name: board_state; Type: TABLE; Schema: public; Owner: chengjiu
--

CREATE TABLE board_state (
    position_x integer,
    position_y integer,
    game_id integer NOT NULL,
    player_id integer NOT NULL,
    ship_id integer NOT NULL,
    hit boolean DEFAULT false NOT NULL
);


ALTER TABLE board_state OWNER TO chengjiu;

--
-- TOC entry 181 (class 1259 OID 17150)
-- Name: chat; Type: TABLE; Schema: public; Owner: chengjiu
--

CREATE TABLE chat (
    game_id integer NOT NULL,
    message character varying(500) NOT NULL,
    "time" timestamp without time zone NOT NULL,
    player_id integer NOT NULL
);


ALTER TABLE chat OWNER TO chengjiu;

--
-- TOC entry 182 (class 1259 OID 17156)
-- Name: game; Type: TABLE; Schema: public; Owner: chengjiu
--

CREATE TABLE game (
    id integer NOT NULL,
    player1_id integer NOT NULL,
    player2_id integer,
    player1_score integer DEFAULT 0 NOT NULL,
    player2_score integer DEFAULT 0 NOT NULL,
    player1_turn boolean DEFAULT true NOT NULL,
    socket_created character varying(30) NOT NULL,
    game_full BOOLEAN DEFAULT false
);


ALTER TABLE game OWNER TO chengjiu;

--
-- TOC entry 183 (class 1259 OID 17162)
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: chengjiu
--

CREATE SEQUENCE game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE game_id_seq OWNER TO chengjiu;

--
-- TOC entry 2429 (class 0 OID 0)
-- Dependencies: 183
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chengjiu
--

ALTER SEQUENCE game_id_seq OWNED BY game.id;


--
-- TOC entry 184 (class 1259 OID 17164)
-- Name: high_score; Type: TABLE; Schema: public; Owner: chengjiu
--

CREATE TABLE high_score (
    score integer DEFAULT 0 NOT NULL,
    ship_sunk integer,
    misses integer,
    hits integer,
    user_id integer
);


ALTER TABLE high_score OWNER TO chengjiu;

--
-- TOC entry 185 (class 1259 OID 17168)
-- Name: player; Type: TABLE; Schema: public; Owner: chengjiu
--

CREATE TABLE player (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    is_logged_in boolean DEFAULT false NOT NULL,
    socket_id character varying(50)
);


ALTER TABLE player OWNER TO chengjiu;

--
-- TOC entry 186 (class 1259 OID 17171)
-- Name: ship; Type: TABLE; Schema: public; Owner: chengjiu
--

CREATE TABLE ship (
    id integer NOT NULL,
    ship_owner integer NOT NULL,
    size integer DEFAULT 1 NOT NULL
);


ALTER TABLE ship OWNER TO chengjiu;

--
-- TOC entry 187 (class 1259 OID 17174)
-- Name: ship_id_seq; Type: SEQUENCE; Schema: public; Owner: chengjiu
--

CREATE SEQUENCE ship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ship_id_seq OWNER TO chengjiu;

--
-- TOC entry 2430 (class 0 OID 0)
-- Dependencies: 187
-- Name: ship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chengjiu
--

ALTER SEQUENCE ship_id_seq OWNED BY ship.id;


--
-- TOC entry 188 (class 1259 OID 17179)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: chengjiu
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO chengjiu;

--
-- TOC entry 2431 (class 0 OID 0)
-- Dependencies: 188
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chengjiu
--

ALTER SEQUENCE user_id_seq OWNED BY player.id;


--
-- TOC entry 2276 (class 2604 OID 17181)
-- Name: id; Type: DEFAULT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY game ALTER COLUMN id SET DEFAULT nextval('game_id_seq'::regclass);


--
-- TOC entry 2278 (class 2604 OID 17182)
-- Name: id; Type: DEFAULT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY player ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass);


--
-- TOC entry 2280 (class 2604 OID 17183)
-- Name: id; Type: DEFAULT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY ship ALTER COLUMN id SET DEFAULT nextval('ship_id_seq'::regclass);



ALTER TABLE ONLY game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- TOC entry 2285 (class 2606 OID 17187)
-- Name: pk_id; Type: CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY player
    ADD CONSTRAINT pk_id PRIMARY KEY (id);


--
-- TOC entry 2288 (class 2606 OID 17191)
-- Name: ship_pkey; Type: CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY ship
    ADD CONSTRAINT ship_pkey PRIMARY KEY (id);


--
-- TOC entry 2286 (class 1259 OID 17464)
-- Name: player_username_uindex; Type: INDEX; Schema: public; Owner: chengjiu
--

CREATE UNIQUE INDEX player_username_uindex ON player USING btree (username);


--
-- TOC entry 2289 (class 2606 OID 17192)
-- Name: board_state_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_game_id_fkey FOREIGN KEY (game_id) REFERENCES game(id);


--
-- TOC entry 2290 (class 2606 OID 17197)
-- Name: board_state_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id);


--
-- TOC entry 2291 (class 2606 OID 17202)
-- Name: board_state_ship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_ship_id_fkey FOREIGN KEY (ship_id) REFERENCES ship(id);


--
-- TOC entry 2292 (class 2606 OID 17207)
-- Name: chat_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_game_id_fkey FOREIGN KEY (game_id) REFERENCES game(id);


--
-- TOC entry 2293 (class 2606 OID 17212)
-- Name: chat_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id);


--
-- TOC entry 2294 (class 2606 OID 17217)
-- Name: fk_player1; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY game
    ADD CONSTRAINT fk_player1 FOREIGN KEY (player1_id) REFERENCES player(id);


--
-- TOC entry 2295 (class 2606 OID 17222)
-- Name: fk_player2; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY game
    ADD CONSTRAINT fk_player2 FOREIGN KEY (player2_id) REFERENCES player(id);


--
-- TOC entry 2296 (class 2606 OID 17227)
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY high_score
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES player(id);


--
-- TOC entry 2297 (class 2606 OID 17454)
-- Name: ship_player_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: chengjiu
--

ALTER TABLE ONLY ship
    ADD CONSTRAINT ship_player_id_fk FOREIGN KEY (ship_owner) REFERENCES player(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2427 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: chengjiu
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM chengjiu;
GRANT ALL ON SCHEMA public TO chengjiu;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-12-18 06:32:20 PST

--
-- chengjiuQL database dump complete
--
