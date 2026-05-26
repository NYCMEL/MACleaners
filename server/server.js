const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const db = new Database(path.join(__dirname, 'mtk-macleaners.sqlite'));
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    service TEXT,
    day TEXT,
    time_slot TEXT,
    quote_amount INTEGER,
    status TEXT DEFAULT 'requested',
    cleaner TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT,
    time_slot TEXT,
    is_available INTEGER DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    channel TEXT,
    status TEXT DEFAULT 'queued',
    scheduled_for TEXT
  );
`);

const availabilityCount = db.prepare('SELECT COUNT(*) AS count FROM availability').get().count;
if (!availabilityCount) {
  const insert = db.prepare('INSERT INTO availability (day, time_slot) VALUES (?, ?)');
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach((day) => {
    ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'].forEach((slot) => insert.run(day, slot));
  });
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'mtk-macleaners', timestamp: new Date().toISOString() });
});

app.get('/api/availability', (req, res) => {
  const rows = db.prepare('SELECT * FROM availability WHERE is_available = 1 ORDER BY id').all();
  res.json({ availability: rows });
});

app.post('/api/customers', (req, res) => {
  const { name, phone, email, address } = req.body;
  const result = db.prepare('INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)').run(name || '', phone || '', email || '', address || '');
  res.status(201).json({ id: result.lastInsertRowid, name, phone, email, address });
});

app.get('/api/customers', (req, res) => {
  res.json({ customers: db.prepare('SELECT * FROM customers ORDER BY id DESC').all() });
});

app.post('/api/bookings', (req, res) => {
  const { customerId, service, day, timeSlot, quoteAmount, cleaner } = req.body;
  const result = db.prepare('INSERT INTO bookings (customer_id, service, day, time_slot, quote_amount, cleaner) VALUES (?, ?, ?, ?, ?, ?)').run(customerId || null, service || 'Standard Cleaning', day || '', timeSlot || '', quoteAmount || 0, cleaner || 'Unassigned');
  res.status(201).json({ id: result.lastInsertRowid, status: 'requested' });
});

app.get('/api/bookings', (req, res) => {
  res.json({ bookings: db.prepare('SELECT * FROM bookings ORDER BY id DESC').all() });
});

app.patch('/api/bookings/:id/assign', (req, res) => {
  const { cleaner } = req.body;
  db.prepare('UPDATE bookings SET cleaner = ?, status = ? WHERE id = ?').run(cleaner || 'Assigned cleaner', 'assigned', req.params.id);
  res.json({ id: Number(req.params.id), cleaner, status: 'assigned' });
});

app.post('/api/reminders', (req, res) => {
  const { bookingId, channel, scheduledFor } = req.body;
  const result = db.prepare('INSERT INTO reminders (booking_id, channel, scheduled_for) VALUES (?, ?, ?)').run(bookingId || null, channel || 'sms', scheduledFor || new Date().toISOString());
  res.status(201).json({ id: result.lastInsertRowid, status: 'queued' });
});

app.listen(port, () => {
  console.log(`mtk-macleaners server running on http://localhost:${port}`);
});
