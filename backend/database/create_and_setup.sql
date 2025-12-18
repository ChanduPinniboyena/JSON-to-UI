CREATE TABLE "SYS_State" (
  "Stt_ID" SERIAL PRIMARY KEY,
  "Stt_Name" VARCHAR(100) NOT NULL,
  "Stt_Code" VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE "OPT_Party" (
  "PTY_ID" SERIAL PRIMARY KEY,
  "PTY_FirstName" VARCHAR(100) NOT NULL,
  "PTY_LastName" VARCHAR(100) NOT NULL,
  "PTY_Phone" VARCHAR(20),
  "PTY_SSN" VARCHAR(20)
);

CREATE TABLE "OPT_Address" (
  "Add_ID" SERIAL PRIMARY KEY,
  "Add_Line1" VARCHAR(200) NOT NULL,
  "Add_Line2" VARCHAR(200),
  "Add_City" VARCHAR(100) NOT NULL,
  "Add_State" INTEGER REFERENCES "SYS_State"("Stt_ID"),
  "Add_Zip" VARCHAR(10),
  "Add_PartyID" INTEGER REFERENCES "OPT_Party"("PTY_ID") ON DELETE CASCADE
);

INSERT INTO "SYS_State" ("Stt_Name", "Stt_Code") VALUES
  ('California', 'CA'),
  ('New York', 'NY'),
  ('Texas', 'TX'),
  ('Florida', 'FL'),
  ('Illinois', 'IL'),
  ('Washington', 'WA');

INSERT INTO "OPT_Party" ("PTY_FirstName", "PTY_LastName", "PTY_Phone", "PTY_SSN") VALUES
  ('Liam', 'Johnson', '555-0101', '123-45-6789'),
  ('Olivia', 'Smith', '555-0102', '234-56-7890'),
  ('Noah', 'Williams', '555-0103', '345-67-8901'),
  ('Emma', 'Brown', '555-0104', '456-78-9012'),
  ('William', 'Davis', '555-0105', '567-89-0123'),
  ('Sophia', 'Miller', '555-0106', '678-90-1234');

INSERT INTO "OPT_Address" ("Add_Line1", "Add_Line2", "Add_City", "Add_State", "Add_Zip", "Add_PartyID") VALUES
  ('123 Main Street', 'Apt 4B', 'Los Angeles', 1, '90001', 1),
  ('456 Oak Avenue', NULL, 'New York', 2, '10001', 2),
  ('789 Pine Road', 'Suite 200', 'Houston', 3, '77001', 3),
  ('321 Elm Drive', NULL, 'Miami', 4, '33101', 4),
  ('654 Maple Lane', 'Unit 12', 'Chicago', 5, '60601', 5),
  ('987 Cedar Court', NULL, 'Seattle', 6, '98101', 6);

CREATE INDEX idx_address_party ON "OPT_Address"("Add_PartyID");
CREATE INDEX idx_address_state ON "OPT_Address"("Add_State");
SELECT 'SYS_State' as table_name, COUNT(*) as row_count FROM "SYS_State"
UNION ALL
SELECT 'OPT_Party', COUNT(*) FROM "OPT_Party"
UNION ALL
SELECT 'OPT_Address', COUNT(*) FROM "OPT_Address";

SELECT 
  p."PTY_ID" as "Party ID",
  p."PTY_FirstName" as "First Name",
  p."PTY_LastName" as "Last Name",
  a."Add_City" as "City",
  s."Stt_Name" as "State"
FROM "OPT_Party" p
LEFT JOIN "OPT_Address" a ON p."PTY_ID" = a."Add_PartyID"
LEFT JOIN "SYS_State" s ON a."Add_State" = s."Stt_ID"
ORDER BY p."PTY_ID";

