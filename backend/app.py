"""
CivicPulse Backend — Flask + PyJWT + SQLite
Run: python app.py
"""
import os, uuid, sqlite3, hashlib
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import Flask, request, jsonify, send_from_directory, g
from werkzeug.utils import secure_filename

# ── Config ────────────────────────────────────────────────────────────
SECRET      = 'civicpulse-secret-2024'
BASE        = os.path.dirname(os.path.abspath(__file__))
DB_PATH     = os.path.join(BASE, 'civicpulse.db')
UPLOADS_DIR = os.path.join(BASE, 'uploads')
ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
os.makedirs(UPLOADS_DIR, exist_ok=True)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# ── CORS — applied to EVERY response including errors ─────────────────
@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin']  = '*'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return resp

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        from flask import make_response
        r = make_response('', 200)
        r.headers['Access-Control-Allow-Origin']  = '*'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        r.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return r

# ── DB helpers ─────────────────────────────────────────────────────────
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(_=None):
    db = g.pop('db', None)
    if db: db.close()

def q(sql, params=(), one=False, write=False):
    db  = get_db()
    cur = db.execute(sql, params)
    if write:
        db.commit()
        return cur
    return cur.fetchone() if one else cur.fetchall()

def row(r): return dict(r) if r else None

# ── Auth ───────────────────────────────────────────────────────────────
def pw_hash(p):
    return hashlib.sha256(p.encode('utf-8')).hexdigest()

def make_token(uid, role):
    return jwt.encode(
        {'sub': {'id': uid, 'role': role},
         'iat': datetime.now(timezone.utc),
         'exp': datetime.now(timezone.utc) + timedelta(days=7)},
        SECRET, algorithm='HS256')

def jwt_required(f):
    @wraps(f)
    def wrap(*a, **kw):
        auth = request.headers.get('Authorization', '')
        if not auth.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
        try:
            g.me = jwt.decode(auth[7:], SECRET, algorithms=['HS256'])['sub']
        except Exception:
            return jsonify({'error': 'Invalid or expired token'}), 401
        return f(*a, **kw)
    return wrap

def allowed(fn):
    return '.' in fn and fn.rsplit('.', 1)[1].lower() in ALLOWED_EXT

# ── DB Init — UPSERTS seed users every startup (fixes stale hashes) ────
def init_db():
    c = sqlite3.connect(DB_PATH)
    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            email         TEXT    UNIQUE NOT NULL,
            password_hash TEXT    NOT NULL,
            role          TEXT    NOT NULL DEFAULT 'citizen'
        );
        CREATE TABLE IF NOT EXISTS reports (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL,
            category    TEXT    NOT NULL,
            description TEXT    NOT NULL,
            image_path  TEXT,
            latitude    REAL    NOT NULL,
            longitude   REAL    NOT NULL,
            status      TEXT    NOT NULL DEFAULT 'pending',
            timestamp   TEXT    NOT NULL
        );
    """)
    c.commit()

    def upsert(name, email, password, role):
        h = pw_hash(password)
        if c.execute('SELECT 1 FROM users WHERE email=?', (email,)).fetchone():
            c.execute('UPDATE users SET name=?,password_hash=?,role=? WHERE email=?',
                      (name, h, role, email))
        else:
            c.execute('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)',
                      (name, email, h, role))
        c.commit()

    upsert('Admin',        'admin@civicpulse.gov',   'admin123',   'admin')
    upsert('Priya Sharma', 'citizen@civicpulse.gov', 'citizen123', 'citizen')

    if not c.execute('SELECT 1 FROM reports LIMIT 1').fetchone():
        cid = c.execute('SELECT id FROM users WHERE email=?',
                        ('citizen@civicpulse.gov',)).fetchone()[0]
        seed = [
            ('Garbage',       'Large pile blocking market footpath.',          17.3850, 78.4867, 'pending',     '2025-01-01T09:00:00'),
            ('Pothole',       'Deep crater on MG Road near signal.',           17.3920, 78.4910, 'resolved',    '2025-01-03T11:00:00'),
            ('Water Leakage', 'Burst pipe, water wasting since 2 days.',       17.3780, 78.4800, 'pending',     '2025-01-05T08:30:00'),
            ('Street Light',  'Entire street dark, safety hazard.',            17.4000, 78.4750, 'in_progress', '2025-01-07T19:00:00'),
            ('Drainage',      'Blocked drain causing flooding.',               17.3720, 78.4950, 'pending',     '2025-01-09T10:00:00'),
            ('Garbage',       'Overflowing bin near bus stop.',                17.3880, 78.4820, 'resolved',    '2025-01-10T12:00:00'),
            ('Pothole',       'Multiple potholes on school road.',             17.3950, 78.4700, 'pending',     '2025-01-12T10:00:00'),
            ('Water Leakage', 'Sewage mixing with drinking water.',            17.3810, 78.4890, 'pending',     '2025-01-14T08:00:00'),
            ('Garbage',       'Illegal dump near the park.',                   17.3760, 78.4780, 'in_progress', '2025-01-16T09:00:00'),
            ('Street Light',  'Broken pole, pedestrian hazard.',               17.4040, 78.4880, 'pending',     '2025-01-17T20:00:00'),
            ('Drainage',      'Choked drain, colony flooding.',                17.3690, 78.4720, 'resolved',    '2025-01-18T09:00:00'),
            ('Pothole',       'Crater near hospital gate, dangerous.',         17.3910, 78.4840, 'pending',     '2025-01-20T11:00:00'),
            ('Water Leakage', 'Pipe leaking at junction box, road wet.',       17.3840, 78.4860, 'in_progress', '2025-01-22T07:00:00'),
            ('Garbage',       'Waste dumped on roadside, foul smell.',         17.3900, 78.4930, 'pending',     '2025-01-23T10:00:00'),
            ('Street Light',  'Flickering lights causing accidents at night.', 17.3970, 78.4760, 'resolved',    '2025-01-24T21:00:00'),
        ]
        for cat, desc, lat, lng, status, ts in seed:
            c.execute('INSERT INTO reports(user_id,category,description,latitude,longitude,status,timestamp) VALUES(?,?,?,?,?,?,?)',
                      (cid, cat, desc, lat, lng, status, ts))
        c.commit()
    c.close()

# ── Routes ─────────────────────────────────────────────────────────────

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    data     = request.get_json(force=True, silent=True) or {}
    email    = (data.get('email')    or '').strip().lower()
    password = (data.get('password') or '').strip()

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    u = row(q('SELECT * FROM users WHERE LOWER(email)=?', (email,), one=True))

    if not u or u['password_hash'] != pw_hash(password):
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({
        'token': make_token(u['id'], u['role']),
        'user':  {'id': u['id'], 'name': u['name'],
                  'email': u['email'], 'role': u['role']}
    }), 200

@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    data     = request.get_json(force=True, silent=True) or {}
    name     = (data.get('name')     or '').strip()
    email    = (data.get('email')    or '').strip().lower()
    password = (data.get('password') or '').strip()

    if not all([name, email, password]):
        return jsonify({'error': 'name, email and password are required'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    if q('SELECT 1 FROM users WHERE LOWER(email)=?', (email,), one=True):
        return jsonify({'error': 'Email already registered'}), 409

    cur  = q('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)',
             (name, email, pw_hash(password), 'citizen'), write=True)
    uid  = cur.lastrowid
    user = row(q('SELECT id,name,email,role FROM users WHERE id=?', (uid,), one=True))
    return jsonify({'token': make_token(uid, 'citizen'), 'user': user}), 201

@app.route('/report', methods=['POST', 'OPTIONS'])
@jwt_required
def submit_report():
    img = None
    if 'image' in request.files:
        f = request.files['image']
        if f and f.filename and allowed(f.filename):
            ext = f.filename.rsplit('.', 1)[1].lower()
            fn  = f'{uuid.uuid4().hex}.{ext}'
            f.save(os.path.join(UPLOADS_DIR, fn))
            img = fn
    cat  = (request.form.get('category')    or '').strip()
    desc = (request.form.get('description') or '').strip()
    lat  = request.form.get('latitude')
    lng  = request.form.get('longitude')
    if not all([cat, desc, lat, lng]):
        return jsonify({'error': 'category, description, latitude, longitude required'}), 400
    ts  = datetime.utcnow().isoformat()
    cur = q('INSERT INTO reports(user_id,category,description,image_path,latitude,longitude,status,timestamp) VALUES(?,?,?,?,?,?,?,?)',
            (g.me['id'], cat, desc, img, float(lat), float(lng), 'pending', ts), write=True)
    r = row(q('SELECT r.*,u.name user_name FROM reports r JOIN users u ON u.id=r.user_id WHERE r.id=?',
              (cur.lastrowid,), one=True))
    return jsonify({'report': r}), 201

@app.route('/reports')
def get_reports():
    rows = q('SELECT r.*,u.name user_name FROM reports r JOIN users u ON u.id=r.user_id ORDER BY r.timestamp DESC')
    return jsonify([row(r) for r in rows])

@app.route('/reports/mine', methods=['GET', 'OPTIONS'])
@jwt_required
def my_reports():
    rows = q('SELECT r.*,u.name user_name FROM reports r JOIN users u ON u.id=r.user_id WHERE r.user_id=? ORDER BY r.timestamp DESC',
             (g.me['id'],))
    return jsonify([row(r) for r in rows])

@app.route('/reports/category/<cat>')
def reports_by_cat(cat):
    rows = q('SELECT r.*,u.name user_name FROM reports r JOIN users u ON u.id=r.user_id WHERE r.category=? ORDER BY r.timestamp DESC', (cat,))
    return jsonify([row(r) for r in rows])

@app.route('/report/<int:rid>/resolve', methods=['PUT', 'OPTIONS'])
@jwt_required
def resolve(rid):
    if g.me['role'] != 'admin':
        return jsonify({'error': 'Admin only'}), 403
    status = (request.get_json(force=True, silent=True) or {}).get('status', 'resolved')
    q('UPDATE reports SET status=? WHERE id=?', (status, rid), write=True)
    r = row(q('SELECT r.*,u.name user_name FROM reports r JOIN users u ON u.id=r.user_id WHERE r.id=?',
              (rid,), one=True))
    return jsonify({'report': r})

@app.route('/stats')
def stats():
    total       = q("SELECT COUNT(*) c FROM reports", one=True)['c']
    pending     = q("SELECT COUNT(*) c FROM reports WHERE status='pending'",     one=True)['c']
    in_progress = q("SELECT COUNT(*) c FROM reports WHERE status='in_progress'", one=True)['c']
    resolved    = q("SELECT COUNT(*) c FROM reports WHERE status='resolved'",    one=True)['c']
    cat_rows    = q('SELECT category,COUNT(*) n FROM reports GROUP BY category ORDER BY n DESC')
    categories  = {r['category']: r['n'] for r in cat_rows}
    since30     = (datetime.utcnow() - timedelta(days=30)).isoformat()
    recent      = q('SELECT category,COUNT(*) n FROM reports WHERE timestamp>=? GROUP BY category ORDER BY n DESC', (since30,))
    recent_cats = {r['category']: r['n'] for r in recent}
    all_r       = q('SELECT latitude,longitude,category FROM reports')
    clusters    = {}
    for r in all_r:
        k = f"{round(r['latitude'],2)},{round(r['longitude'],2)}"
        if k not in clusters:
            clusters[k] = {'count': 0, 'lat': r['latitude'], 'lng': r['longitude'], 'categories': []}
        clusters[k]['count'] += 1
        clusters[k]['categories'].append(r['category'])
    hotspots = sorted(clusters.values(), key=lambda x: x['count'], reverse=True)[:3]
    insights = []
    if categories:
        top = max(categories, key=categories.get)
        insights.append(f"{top} is the most reported issue — {categories[top]} complaints logged")
    if recent_cats:
        top_r = max(recent_cats, key=recent_cats.get)
        insights.append(f"Surge detected: {top_r} incidents up {recent_cats[top_r]} reports in 30 days")
    if total > 0 and (pending / total) > 0.5:
        insights.append(f"Backlog alert — {pending} complaints pending, resolution rate below 50%")
    if in_progress > 0:
        insights.append(f"{in_progress} active investigations underway across all categories")
    return jsonify({'total': total, 'pending': pending, 'in_progress': in_progress,
                    'resolved': resolved, 'categories': categories,
                    'recent_categories': recent_cats, 'hotspots': hotspots, 'insights': insights})

@app.route('/uploads/<fn>')
def upload(fn):
    return send_from_directory(UPLOADS_DIR, fn)

# ── Start ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('\n  Initialising database...')
    init_db()
    print('  ✅  admin@civicpulse.gov   / admin123')
    print('  ✅  citizen@civicpulse.gov / citizen123')
    print('\n  CivicPulse API → http://127.0.0.1:5000\n')
    # Bind explicitly to 127.0.0.1 — avoids IPv6 ::1 resolution mismatches
    app.run(debug=True, host='127.0.0.1', port=5000)
