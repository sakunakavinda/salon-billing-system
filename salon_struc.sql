-- -------------------------------------------------------------
-- TablePlus 6.8.2(656)
--
-- https://tableplus.com/
--
-- Database: salon_system
-- Generation Time: 2026-05-12 15:32:28.0260
-- -------------------------------------------------------------


-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sales_id_seq;

-- Table Definition
CREATE TABLE "public"."sales" (
    "id" int4 NOT NULL DEFAULT nextval('sales_id_seq'::regclass),
    "cashier_id" int4,
    "total_amount" numeric(10,2) NOT NULL,
    "sale_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "customer_name" varchar NOT NULL,
    "customer_tp" numeric NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS sale_items_id_seq;

-- Table Definition
CREATE TABLE "public"."sale_items" (
    "id" int4 NOT NULL DEFAULT nextval('sale_items_id_seq'::regclass),
    "sale_id" int4,
    "service_id" int4,
    "service_price" numeric(10,2) NOT NULL,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS services_id_seq;

-- Table Definition
CREATE TABLE "public"."services" (
    "id" int4 NOT NULL DEFAULT nextval('services_id_seq'::regclass),
    "service_name" varchar(100) NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "description" text,
    "status" text DEFAULT true,
    PRIMARY KEY ("id")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar(50) NOT NULL,
    "password" varchar(255) NOT NULL,
    "role" varchar(10) NOT NULL CHECK ((role)::text = ANY (ARRAY[('admin'::character varying)::text, ('cashier'::character varying)::text])),
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "status" varchar(10) DEFAULT 'active'::character varying,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."sales" ADD FOREIGN KEY ("cashier_id") REFERENCES "public"."users"("id");
ALTER TABLE "public"."sale_items" ADD FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE CASCADE;
ALTER TABLE "public"."sale_items" ADD FOREIGN KEY ("service_id") REFERENCES "public"."services"("id");


-- Indices
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);
