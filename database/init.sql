-- Create the mycheff schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS mycheff;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set default search path to include mycheff schema
ALTER DATABASE postgres SET search_path TO mycheff, public; 