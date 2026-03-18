--
-- PostgreSQL database dump
--

\restrict LqW9VJXmlsNaBIIXnAhXT6BAvGQJhMlSzQWDH3b274eE5DMOsJZkiwaAa23XdMi

-- Dumped from database version 16.11 (Homebrew)
-- Dumped by pg_dump version 17.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sale_items; Type: TABLE; Schema: public; Owner: sakunakavinda
--

CREATE TABLE public.sale_items (
    id integer NOT NULL,
    sale_id integer,
    service_id integer,
    service_price numeric(10,2) NOT NULL
);


ALTER TABLE public.sale_items OWNER TO sakunakavinda;

--
-- Name: sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: sakunakavinda
--

CREATE SEQUENCE public.sale_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sale_items_id_seq OWNER TO sakunakavinda;

--
-- Name: sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sakunakavinda
--

ALTER SEQUENCE public.sale_items_id_seq OWNED BY public.sale_items.id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: sakunakavinda
--

CREATE TABLE public.sales (
    id integer NOT NULL,
    cashier_id integer,
    total_amount numeric(10,2) NOT NULL,
    sale_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sales OWNER TO sakunakavinda;

--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: sakunakavinda
--

CREATE SEQUENCE public.sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_id_seq OWNER TO sakunakavinda;

--
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sakunakavinda
--

ALTER SEQUENCE public.sales_id_seq OWNED BY public.sales.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: sakunakavinda
--

CREATE TABLE public.services (
    id integer NOT NULL,
    service_name character varying(100) NOT NULL,
    price numeric(10,2) NOT NULL,
    description text,
    status text DEFAULT true
);


ALTER TABLE public.services OWNER TO sakunakavinda;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: sakunakavinda
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO sakunakavinda;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sakunakavinda
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sakunakavinda
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'cashier'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO sakunakavinda;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sakunakavinda
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO sakunakavinda;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sakunakavinda
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: sale_items id; Type: DEFAULT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sale_items ALTER COLUMN id SET DEFAULT nextval('public.sale_items_id_seq'::regclass);


--
-- Name: sales id; Type: DEFAULT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sales ALTER COLUMN id SET DEFAULT nextval('public.sales_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: sakunakavinda
--

COPY public.sale_items (id, sale_id, service_id, service_price) FROM stdin;
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: sakunakavinda
--

COPY public.sales (id, cashier_id, total_amount, sale_date) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: sakunakavinda
--

COPY public.services (id, service_name, price, description, status) FROM stdin;
1	hair	1000.00	\N	active
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sakunakavinda
--

COPY public.users (id, username, password, role, created_at) FROM stdin;
2	cashier_user	1122	cashier	2026-02-25 11:27:55.205363
1	maddu	123	admin	2026-02-25 11:23:37.471766
\.


--
-- Name: sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sakunakavinda
--

SELECT pg_catalog.setval('public.sale_items_id_seq', 1, false);


--
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sakunakavinda
--

SELECT pg_catalog.setval('public.sales_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sakunakavinda
--

SELECT pg_catalog.setval('public.services_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sakunakavinda
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: sale_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id) ON DELETE CASCADE;


--
-- Name: sale_items sale_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: sales sales_cashier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sakunakavinda
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_cashier_id_fkey FOREIGN KEY (cashier_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict LqW9VJXmlsNaBIIXnAhXT6BAvGQJhMlSzQWDH3b274eE5DMOsJZkiwaAa23XdMi

