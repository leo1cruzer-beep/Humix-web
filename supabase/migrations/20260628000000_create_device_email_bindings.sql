CREATE TABLE IF NOT EXISTS device_email_bindings (
  email      text PRIMARY KEY,
  device_id  text NOT NULL,
  created_at timestamptz DEFAULT now()
);
