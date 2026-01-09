const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

// serve all static files from ROOT
app.use(express.static(__dirname));

// root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

/* ================= FILE HELPERS ================= */

function readUsers() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, "[]");
  }

  let raw = fs.readFileSync(FILE, "utf8").trim();
  if (!raw) {
    fs.writeFileSync(FILE, "[]");
    return [];
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    fs.writeFileSync(FILE, "[]");
    return [];
  }

  if (!Array.isArray(parsed)) {
    fs.writeFileSync(FILE, "[]");
    return [];
  }

  return parsed;
}

function saveUsers(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* ================= CAPTCHA ================= */

let captchaStore = {};

app.get("/captcha", (req, res) => {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const id = Date.now().toString();

  captchaStore[id] = a + b;

  // ✅ FIXED LINE
  res.json({ id, q: `${a} + ${b} = ? `});
});

function verifyCaptcha(id, ans) {
  if (!captchaStore[id]) return false;
  const ok = captchaStore[id] == ans;
  delete captchaStore[id];
  return ok;
}

/* ================= REGISTER ================= */

app.post("/register", async (req, res) => {
  const { mobile, password, cid, ans } = req.body;

  if (!verifyCaptcha(cid, ans)) {
    return res.json({ ok: false, msg: "Captcha incorrect" });
  }

  let users = readUsers();

  if (users.find(u => u.mobile === mobile)) {
    return res.json({ ok: false, msg: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  users.push({
    id: Date.now(),
    mobile,
    password: hash,
    balance: 0,
    commission: 0,
    team: 0
  });

  saveUsers(users);
  res.json({ ok: true });
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  const { mobile, password, cid, ans } = req.body;

  if (!verifyCaptcha(cid, ans)) {
    return res.json({ ok: false, msg: "Captcha incorrect" });
  }

  const users = readUsers();
  const user = users.find(u => u.mobile === mobile);

  if (!user) {
    return res.json({ ok: false, msg: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json({ ok: false, msg: "Wrong password" });
  }

  res.json({ ok: true });
});

/* ================= FORGOT ================= */

app.post("/forgot", async (req, res) => {
  const { mobile, newpass, cid, ans } = req.body;

  if (!verifyCaptcha(cid, ans)) {
    return res.json({ ok: false, msg: "Captcha incorrect" });
  }

  let users = readUsers();
  let user = users.find(u => u.mobile === mobile);

  if (!user) {
    return res.json({ ok: false, msg: "User not found" });
  }

  user.password = await bcrypt.hash(newpass, 10);
  saveUsers(users);

  res.json({ ok: true });
});

// ROOT ROUTE FIX


