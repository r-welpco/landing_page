CREATE TABLE "pre_launch_signups" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"segment" varchar(20) NOT NULL,
	"interested_customer" boolean DEFAULT false NOT NULL,
	"interested_welper" boolean DEFAULT false NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
