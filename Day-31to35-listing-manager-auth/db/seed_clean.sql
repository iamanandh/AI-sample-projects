--
-- PostgreSQL database dump
--

\restrict 3gQ5MDI5Ta5VLZfQHbDuOKloS7LfMmPahkdza078csNo11QkIKkKnABzv4lf1Eb

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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

--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.listings VALUES (1, 'Sunny Studio Near Metro', 'Chennai', 18000, 1, true, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (2, 'Two Bedroom Family Flat', 'Bengaluru', 32000, 2, true, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (3, 'Compact Apartment Downtown', 'Hyderabad', 24000, 1, false, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (4, 'Quiet House With Garden', 'Coimbatore', 28000, 3, true, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (5, 'Budget Room Near College', 'Pune', 12000, 1, true, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (6, 'Modern Flat Near IT Park', 'Bengaluru', 42000, 2, false, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (7, 'Spacious Family Apartment', 'Chennai', 36000, 3, true, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (8, 'Small Studio For Students', 'Kochi', 15000, 1, true, '2026-06-12 11:01:29.695763');
INSERT INTO public.listings VALUES (9, 'Single Room Near Bus Stop', 'Madurai', 9000, 1, true, '2026-06-12 11:35:03.362955');
INSERT INTO public.listings VALUES (10, 'double Room Near Bus Stop', 'Madras', 12200, 1, true, '2026-06-12 16:54:24.362957');


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listings_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 3gQ5MDI5Ta5VLZfQHbDuOKloS7LfMmPahkdza078csNo11QkIKkKnABzv4lf1Eb

