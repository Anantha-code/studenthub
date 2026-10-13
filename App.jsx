import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const emptyForm = {
  rollNumber: "",
  name: "",
  email: "",
  department: "CSE",
  year: "1",
  marks: "0",
};

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }

  async function loadStudents() {
    setLoading(true);
    try {
      const query = search.trim() ? `?q=${encodeURIComponent(search.trim())}` : "";
      setStudents(await request(`/students${query}`));
      setMessage("");
    } catch (error) {
      setMessage(`${error.message}. Check that the backend and MongoDB are running.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadStudents(), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const averageMarks = useMemo(() => {
    if (!students.length) return "—";
    return Math.round(students.reduce((sum, student) => sum + student.marks, 0) / students.length);
  }, [students]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      year: Number(form.year),
      marks: Number(form.marks),
    };

    try {
      if (editingId) {
        await request(`/students/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMessage("Student record updated.");
      } else {
        await request("/students", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setMessage("Student added successfully.");
      }
      resetForm();
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEdit(student) {
    setEditingId(student._id);
    setForm({
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      department: student.department,
      year: String(student.year),
      marks: String(student.marks),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student record?")) return;
    try {
      await request(`/students/${id}`, { method: "DELETE" });
      if (editingId === id) resetForm();
      setMessage("Student record deleted.");
      await loadStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="StudentHub home">
          <span className="brand-icon">S</span>
          <span>student<span className="brand-accent">hub</span></span>
        </a>
        <span className="topbar-note">STUDENT RECORD MANAGEMENT</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">CAMPUS ADMINISTRATION</p>
          <h1>Every student,<br /><span>one clear view.</span></h1>
          <p className="hero-copy">Keep student information organized in one simple workspace.</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-circle circle-one"></span>
          <span className="art-circle circle-two"></span>
          <span className="art-card"><span>STUDENT</span><strong>01</strong><i>✦</i></span>
        </div>
      </section>

      <section className="metrics">
        <article className="metric-card"><span className="metric-symbol purple">♙</span><div><p>Records shown</p><strong>{students.length}</strong></div></article>
        <article className="metric-card"><span className="metric-symbol blue">▤</span><div><p>Departments</p><strong>{new Set(students.map((s) => s.department)).size}</strong></div></article>
        <article className="metric-card"><span className="metric-symbol orange">↗</span><div><p>Average marks</p><strong>{averageMarks}</strong></div></article>
      </section>

      <section className="content-grid">
        <form className="panel student-form" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <div><p className="eyebrow">{editingId ? "UPDATE RECORD" : "NEW ENTRY"}</p><h2>{editingId ? "Edit student" : "Add a student"}</h2></div>
            <span className="heading-icon">{editingId ? "✎" : "+"}</span>
          </div>

          <label htmlFor="rollNumber">Roll number</label>
          <input id="rollNumber" name="rollNumber" value={form.rollNumber} onChange={updateField} placeholder="e.g. CSE101" maxLength={30} required />

          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={form.name} onChange={updateField} placeholder="Student's full name" maxLength={100} required />

          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="student@example.com" required />

          <div className="field-row">
            <div><label htmlFor="department">Department</label><select id="department" name="department" value={form.department} onChange={updateField}><option>CSE</option><option>AI & DS</option><option>ECE</option><option>EEE</option><option>Mechanical</option><option>Civil</option><option>IT</option><option>Other</option></select></div>
            <div><label htmlFor="year">Study year</label><select id="year" name="year" value={form.year} onChange={updateField}>{[1, 2, 3, 4, 5, 6, 7, 8].map((year) => <option key={year} value={year}>{year}</option>)}</select></div>
          </div>

          <label htmlFor="marks">Marks (0–100)</label>
          <input id="marks" name="marks" type="number" min="0" max="100" value={form.marks} onChange={updateField} required />

          <div className="form-actions">
            <button className="primary-button" type="submit">{editingId ? "Save changes" : "Add student"} <span>→</span></button>
            {editingId && <button className="cancel-button" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>

        <section className="panel records-panel">
          <div className="panel-heading records-heading">
            <div><p className="eyebrow">STUDENT DIRECTORY</p><h2>All students <span className="count">{students.length}</span></h2></div>
          </div>
          <div className="search-wrap"><span>⌕</span><input aria-label="Search students" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, roll no. or department..." /></div>

          {message && <div className="message" role="status">{message}</div>}

          {loading ? <div className="empty-state">Loading student records...</div> : students.length === 0 ? (
            <div className="empty-state"><span className="empty-symbol">♙</span><h3>No student records found</h3><p>Add a student or try a different search.</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>STUDENT</th><th>DEPARTMENT</th><th>YEAR</th><th>MARKS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td><div className="student-cell"><span className="avatar">{student.name.trim().charAt(0).toUpperCase()}</span><div><strong>{student.name}</strong><small>{student.rollNumber} · {student.email}</small></div></div></td>
                      <td><span className="department-tag">{student.department}</span></td>
                      <td>{student.year}</td>
                      <td><strong>{student.marks}</strong><span className="out-of"> / 100</span></td>
                      <td><div className="row-actions"><button type="button" onClick={() => startEdit(student)}>Edit</button><button className="delete-action" type="button" onClick={() => deleteStudent(student._id)}>Delete</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="privacy-note">Use sample student data while learning. Avoid uploading real personal student information to a public repository.</p>
        </section>
      </section>

      <footer><span>studenthub</span><span>Built for learning the MERN stack · CRUD made clear.</span></footer>
    </main>
  );
}
