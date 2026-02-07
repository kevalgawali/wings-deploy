require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Function to initialize database schema with idempotent insertions
const initializeDatabase = async () => {
  try {
    // Check if tables already exist by checking for 'events' table
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log("✅ Database tables already exist. Checking for missing data...");
      
      // Check and insert events if they don't exist
      await insertDefaultEventsIfNotExist();
      
      // Check and insert settings if they don't exist
      await insertDefaultSettingsIfNotExist();
      
      // Check and insert admin if they don't exist
      await insertDefaultAdminIfNotExist();

      // Check and insert default developer if they don't exist
      await insertDefaultDeveloperIfNotExist();
      
      return true;
    }

    console.log("📦 Initializing database schema...");

    // Read the schema.sql file
    const schemaPath = path.join(__dirname, "..", "schema", "schema.sql");
    
    if (!fs.existsSync(schemaPath)) {
      console.error("❌ schema.sql file not found at:", schemaPath);
      return false;
    }

    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Execute the schema SQL
    await pool.query(schemaSql);

    console.log("✅ Database schema initialized successfully!");
    console.log("✅ Default events, settings, and admin user created.");
    return true;
  } catch (error) {
    // Handle case where some tables might exist but not all
    if (error.code === '42P07') {
      console.log("⚠️ Some tables already exist. Database may be partially initialized.");
      return true;
    }
    // Handle duplicate key errors (data already inserted)
    if (error.code === '23505') {
      console.log("⚠️ Default data already exists. Skipping duplicate entries.");
      return true;
    }
    console.error("❌ Error initializing database schema:", error.message);
    return false;
  }
};

// Insert default events only if they don't exist
const insertDefaultEventsIfNotExist = async () => {
  try {
    const defaultEvents = [
      { name: 'Ode To Code', is_team: false },
      { name: 'Doctor Fix It', is_team: false },
      { name: 'Code Vibes', is_team: true },
      { name: 'Room 404', is_team: true },
      { name: 'Dronix', is_team: true },
      { name: 'Innovex', is_team: true },
      { name: 'Robo Race', is_team: true },
      { name: 'Line Follower', is_team: true },
      { name: 'Robo Soccer', is_team: true },
      { name: 'Robo Sumo', is_team: true },
      { name: 'E Arena Championship', is_team: true },
      { name: 'E Arena Championship (BGMI)', is_team: true },
      { name: 'E Arena Championship (Free Fire)', is_team: true },
      { name: 'Cade Clash', is_team: true },
      { name: 'Mechathon', is_team: true },
      { name: 'Bridge It', is_team: true },
      { name: 'Quiz O Mania', is_team: true }
    ];

    for (const event of defaultEvents) {
      await pool.query(
        `INSERT INTO events(event_name, is_team_event) 
         VALUES($1, $2) 
         ON CONFLICT (event_name) DO NOTHING`,
        [event.name, event.is_team]
      );
    }
    console.log("✅ Default events inserted (skipped if already exist).");
  } catch (error) {
    console.error("❌ Error inserting default events:", error.message);
  }
};

// Insert default settings only if they don't exist
const insertDefaultSettingsIfNotExist = async () => {
  try {
    await pool.query(
      `INSERT INTO settings(setting_key, setting_value) 
       VALUES($1, $2) 
       ON CONFLICT (setting_key) DO NOTHING`,
      ['viewer_registration_status', 'open']
    );
    console.log("✅ Default settings inserted (skipped if already exist).");
  } catch (error) {
    console.error("❌ Error inserting default settings:", error.message);
  }
};

// Insert default admin only if it doesn't exist
const insertDefaultAdminIfNotExist = async () => {
  try {
    await pool.query(
      `INSERT INTO admin(username, password, role) 
       VALUES($1, $2, $3) 
       ON CONFLICT (username) DO NOTHING`,
      ['super', '$2b$10$FaAwYrBBQmWAMXm0/I6oo.Ke2I8tfQ3a/tKso4amR9nwS6fDRQzQy', 'Super Admin']
    );
    console.log("✅ Default admin inserted (skipped if already exist).");
  } catch (error) {
    console.error("❌ Error inserting default admin:", error.message);
  }
};

// Insert default developer only if it doesn't exist
const insertDefaultDeveloperIfNotExist = async () => {
  try {
    // Create developers table if it doesn't exist (for existing DBs without it)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS developers(
        dev_id serial primary key,
        username varchar(50) not null unique,
        password varchar(60) not null,
        is_active boolean default true,
        created_at timestamp with time zone default now(),
        last_login timestamp with time zone
      )
    `);

    await pool.query(
      `INSERT INTO developers(username, password) 
       VALUES($1, $2) 
       ON CONFLICT (username) DO NOTHING`,
      ['developer', '$2b$10$BqCTHXmOoCeVSSTYB.9qCu7oNY2xCPGJumHlMyPTovBf4lU3azTvW']
    );
    console.log("✅ Default developer inserted (skipped if already exist).");
  } catch (error) {
    console.error("❌ Error inserting default developer:", error.message);
  }
};

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
module.exports.insertDefaultEventsIfNotExist = insertDefaultEventsIfNotExist;
module.exports.insertDefaultSettingsIfNotExist = insertDefaultSettingsIfNotExist;
module.exports.insertDefaultAdminIfNotExist = insertDefaultAdminIfNotExist;
module.exports.insertDefaultDeveloperIfNotExist = insertDefaultDeveloperIfNotExist;