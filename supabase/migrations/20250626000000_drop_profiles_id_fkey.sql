-- profiles.id currently references auth.users.id, but Humix uses self-generated
-- UUIDs for passkey-based identity that are never registered in auth.users.
-- Dropping this FK allows profile rows to use any UUID as their primary key.

DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT tc.constraint_name
    INTO constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
   WHERE tc.constraint_type = 'FOREIGN KEY'
     AND tc.table_schema = 'public'
     AND tc.table_name = 'profiles'
     AND kcu.column_name = 'id'
   LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT %I', constraint_name);
    RAISE NOTICE 'Dropped FK constraint: %', constraint_name;
  ELSE
    RAISE NOTICE 'No FK constraint found on profiles.id — nothing to drop';
  END IF;
END $$;
