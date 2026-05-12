# 🚀 Cara Menjalankan Migration via Docker

## Quick Start

### 1. Run Migration
```bash
cd /home/aufa/Public/RebuildV2/backend/scripts
./run-migration.sh
```

### 2. Run Rollback (jika perlu)
```bash
cd /home/aufa/Public/RebuildV2/backend/scripts
./run-rollback.sh
```

---

## Detail Scripts

### Script: `run-migration.sh`
Script ini akan:
1. Mencari MySQL/MariaDB container yang sedang berjalan
2. Copy file SQL migration ke dalam container
3. Execute SQL file ke database
4. Cleanup file temporary

### Script: `run-rollback.sh`
Script ini akan:
1. Mencari MySQL/MariaDB container yang sedang berjalan
2. Copy file SQL rollback ke dalam container
3. Execute SQL file untuk menghapus kolom
4. Cleanup file temporary

---

## Manual Method (via docker exec)

Jika script tidak bekerja, bisa run manual:

### Step 1: Find MySQL Container
```bash
docker-compose ps
# atau
docker ps | grep mysql
```

### Step 2: Copy SQL File to Container
```bash
docker cp /home/aufa/Public/RebuildV2/deploy/api/migrations/spmb/20260407000000-add-approved-amount-to-registrants.sql <container_name>:/tmp/migration.sql
```

### Step 3: Execute Migration
```bash
# Jika MySQL tidak pakai password
docker exec -i <container_name> mysql -u root -e "USE spmb_db; source /tmp/migration.sql;"

# Jika MySQL pakai password
docker exec -i <container_name> mysql -u root -p<password> -e "USE spmb_db; source /tmp/migration.sql;"
```

### Step 4: Verify Migration
```bash
docker exec -i <container_name> mysql -u root -e "USE spmb_db; DESCRIBE Registrants;" | grep approvedAmount
```

---

## Alternative: Via MySQL CLI in Container

### Step 1: Enter MySQL Container
```bash
docker exec -it <container_name> mysql -u root -p
```

### Step 2: Run SQL Manually
```sql
USE spmb_db;

-- Run migration
ALTER TABLE `Registrants`
ADD COLUMN `approvedAmount` INT(11) DEFAULT NULL
COMMENT 'Frozen payment amount after verification (prevents changes when fee is updated)';

-- Verify
DESCRIBE Registrants;

-- Or rollback
ALTER TABLE `Registrants` DROP COLUMN `approvedAmount`;
```

---

## Troubleshooting

### Error: "Could not find MySQL container"
**Solusi:**
```bash
# Cek container yang running
docker-compose ps

# Pastikan database service running
docker-compose up -d db
```

### Error: "Access denied for user 'root'"
**Solusi:**
```bash
# Cek password dari .env atau docker-compose.yml
cat .env | grep DB_PASSWORD
cat docker-compose.yml | grep MYSQL_ROOT_PASSWORD

# Gunakan password yang benar
docker exec -i <container_name> mysql -u root -p<password> -e "USE spmb_db; source /tmp/migration.sql;"
```

### Error: "Unknown database 'spmb_db'"
**Solusi:**
```bash
# Cek database name yang benar
docker exec -i <container_name> mysql -u root -p -e "SHOW DATABASES;"

# Ganti nama database di script sesuai yang ada
```

---

## Verification

Setelah migration berhasil, verify dengan:

### 1. Check Column Exists
```bash
docker exec -i <container_name> mysql -u root -e "
  SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, COLUMN_COMMENT
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'spmb_db'
    AND TABLE_NAME = 'Registrants'
    AND COLUMN_NAME = 'approvedAmount';
"
```

### 2. Check via Application
```bash
# Restart backend server agar model ter-reload
cd /home/aufa/Public/RebuildV2/backend
# Restart server process
```

### 3. Test via UI
1. Login sebagai student
2. Pindah ke tab Pembayaran
3. Cek apakah amount tampil benar (0 atau nominal)
4. Cek apakah panel kiri hilang saat verified

---

## Database Configuration

Jika database configuration berbeda, edit file ini sesuai kebutuhan:
- `docker-compose.yml` - cek service name dan environment variables
- `.env` - cek `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

---

## Support Files

- Migration SQL: `/deploy/api/migrations/spmb/20260407000000-add-approved-amount-to-registrants.sql`
- Rollback SQL: `/deploy/api/migrations/spmb/20260407000000-rollback-add-approved-amount-to-registrants.sql`
- Migration JS: `/deploy/api/migrations/spmb/20260407000000-add-approved-amount-to-registrants.js`
- Documentation: `/MIGRATION_APPROVED_AMOUNT.md`
