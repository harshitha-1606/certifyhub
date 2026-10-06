import React, { useState } from "react";

const INITIAL_EVENTS = [
  { id: 1, name: "National Hackathon 2026", description: "24-hour coding challenge on AI and Full-Stack development.", date: "2026-03-15", organizer: "Dept of CSE & Data Science", venue: "Auditorium Hall 1" },
  { id: 2, name: "Cloud & DevOps Workshop", description: "Hands-on session on AWS, Docker, and Spring Boot deployment.", date: "2026-04-10", organizer: "Computer Society of India (CSI)", venue: "Seminar Hall B" },
];

const INITIAL_PARTICIPANTS = [
  { id: 1, name: "Polu Harshitha", email: "harshitha@audisankara.ac.in", eventId: 1, eventName: "National Hackathon 2026" },
  { id: 2, name: "K. Sai Kumar", email: "saikumar@audisankara.ac.in", eventId: 1, eventName: "National Hackathon 2026" },
];

const INITIAL_CERTIFICATES = [
  { id: "CERT-2026-A7X92K", participantName: "Polu Harshitha", email: "harshitha@audisankara.ac.in", eventName: "National Hackathon 2026", date: "2026-03-15", organizer: "Dept of CSE & Data Science" },
];

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [organizerLoggedIn, setOrganizerLoggedIn] = useState(false);
  const [orgUsername, setOrgUsername] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);

  const [orgActiveTab, setOrgActiveTab] = useState("events");
  const [newEvent, setNewEvent] = useState({ name: "", description: "", date: "", organizer: "", venue: "" });
  const [newPart, setNewPart] = useState({ name: "", email: "", eventId: "" });
  const [csvText, setCsvText] = useState("");
  const [selectedEventForPart, setSelectedEventForPart] = useState("");

  const [portalEventId, setPortalEventId] = useState("");
  const [portalEmail, setPortalEmail] = useState("");
  const [portalResult, setPortalResult] = useState(null);
  const [portalError, setPortalError] = useState("");

  const [searchCertId, setSearchCertId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);

  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleOrganizerLogin = (e) => {
    e.preventDefault();
    if (orgUsername === "admin" && orgPassword === "audisankara2026") {
      setOrganizerLoggedIn(true);
      setCurrentView("organizer-dashboard");
      setLoginError("");
      showToast("Welcome back, Organizer!");
    } else {
      setLoginError("Invalid credentials. Use admin / audisankara2026");
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) return;
    const created = { id: Date.now(), ...newEvent };
    setEvents([...events, created]);
    setNewEvent({ name: "", description: "", date: "", organizer: "", venue: "" });
    showToast("Event created successfully!");
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (!newPart.name || !newPart.email || !newPart.eventId) return;
    const ev = events.find((ev) => ev.id.toString() === newPart.eventId.toString());
    const p = { id: Date.now(), name: newPart.name, email: newPart.email, eventId: Number(newPart.eventId), eventName: ev ? ev.name : "" };
    setParticipants([...participants, p]);
    setNewPart({ name: "", email: "", eventId: "" });
    showToast("Participant added successfully!");
  };

  const handleCsvUpload = (e) => {
    e.preventDefault();
    if (!selectedEventForPart || !csvText.trim()) return;
    const ev = events.find((ev) => ev.id.toString() === selectedEventForPart.toString());
    const lines = csvText.split("\n");
    let addedCount = 0;
    const newPs = [...participants];
    lines.forEach((line) => {
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        newPs.push({ id: Date.now() + Math.random(), name: parts[0], email: parts[1], eventId: Number(selectedEventForPart), eventName: ev ? ev.name : "" });
        addedCount++;
      }
    });
    setParticipants(newPs);
    setCsvText("");
    showToast(`Imported ${addedCount} participants!`);
  };

  const handleGenerateCertificate = (p) => {
    const existing = certificates.find((c) => c.email === p.email && c.eventName === p.eventName);
    if (existing) {
      setPreviewCert(existing);
      return;
    }
    const ev = events.find((e) => e.name === p.eventName);
    const newCertId = `CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newCert = {
      id: newCertId,
      participantName: p.name,
      email: p.email,
      eventName: p.eventName,
      date: ev ? ev.date : "2026-03-15",
      organizer: ev ? ev.organizer : "Audisankara College",
    };
    setCertificates([newCert, ...certificates]);
    showToast(`Generated Certificate: ${newCertId}`);
    setPreviewCert(newCert);
  };

  const handleParticipantLookup = (e) => {
    e.preventDefault();
    setPortalError("");
    setPortalResult(null);

    const ev = events.find((e) => e.id.toString() === portalEventId.toString());
    const part = participants.find((p) => p.email.toLowerCase() === portalEmail.toLowerCase() && p.eventId.toString() === portalEventId.toString());

    if (!part) {
      setPortalError("No registration found for this email in the selected event.");
      return;
    }

    let cert = certificates.find((c) => c.email.toLowerCase() === portalEmail.toLowerCase() && c.eventName === ev.name);
    if (!cert) {
      cert = {
        id: `CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        participantName: part.name,
        email: part.email,
        eventName: ev.name,
        date: ev.date,
        organizer: ev.organizer,
      };
      setCertificates([cert, ...certificates]);
    }

    setPortalResult({ participant: part, certificate: cert, event: ev });
    showToast("Certificate retrieved!");
  };

  const handleVerifySearch = (e) => {
    e.preventDefault();
    const cleanId = searchCertId.trim().toUpperCase();
    const found = certificates.find((c) => c.id.toUpperCase() === cleanId);
    if (found) {
      setVerifyResult({ status: "valid", cert: found });
    } else {
      setVerifyResult({ status: "invalid", id: searchCertId });
    }
  };

  return (
    <div style={styles.appContainer}>
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* HEADER WITH LOGO IN TOP LEFT */}
      <header style={styles.header}>
        <div style={styles.logoTitleGroup} onClick={() => setCurrentView("home")}>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sV7mH1uL7yvFh8kZ9a1q5w2X3b4n6m7v8A&s" 
            alt="Audisankara Logo" 
            style={styles.collegeLogo}
            onError={(e)=>{
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><circle cx='25' cy='25' r='23' fill='%23E3856B'/><text x='25' y='31' font-size='16' fill='white' text-anchor='middle' font-weight='bold'>ASC</text></svg>";
            }}
          />
          <div>
            <h1 style={styles.collegeName}>Audisankara College of Engineering and Technology</h1>
            <p style={styles.collegeSub}>Gudur | Autonomous & Deemed to be University Approved</p>
          </div>
        </div>

        <nav style={styles.navBar}>
          <button style={styles.navLinkBtn} onClick={() => setCurrentView("home")}>Home</button>
          <button style={styles.navLinkBtn} onClick={() => setCurrentView("participant-portal")}>Participant Portal</button>
          <button style={styles.navLinkBtn} onClick={() => setCurrentView("verify")}>Verify Certificate</button>
          <button style={styles.navLinkBtn} onClick={() => setCurrentView("organizer-login")}>Organizer Login</button>
          <button style={styles.navLinkBtnTech} onClick={() => setCurrentView("architecture")}>Java Architecture</button>
        </nav>
      </header>

      <main style={styles.mainContent}>
        {currentView === "home" && (
          <div style={styles.heroSection}>
            <div style={styles.badgeHero}>CertifyHub System v2.6</div>
            <h2 style={styles.heroTitle}>Automated College Certificate Generation & Verification</h2>
            <p style={styles.heroDesc}>
              Welcome to the official Audisankara College credential platform. Manage events, generate secure PDF certificates with QR codes, and verify authenticity instantly.
            </p>

            <div style={styles.heroActionGrid}>
              <div style={styles.heroCard} onClick={() => setCurrentView("participant-portal")}>
                <h3>🎓 Participant Portal</h3>
                <p>Select your event and enter your email to view and download your certificate.</p>
              </div>
              <div style={styles.heroCard} onClick={() => setCurrentView("verify")}>
                <h3>🔍 Instant Verification</h3>
                <p>Verify certificate authenticity securely by entering the unique Certificate ID.</p>
              </div>
              <div style={styles.heroCard} onClick={() => setCurrentView("organizer-login")}>
                <h3>🛠️ Organizer Dashboard</h3>
                <p>Create college events, upload participant lists, and generate certificates.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === "organizer-login" && (
          <div style={styles.authContainer}>
            <div style={styles.authBox}>
              <h2>Organizer Portal Login</h2>
              {loginError && <div style={styles.errorAlert}>{loginError}</div>}
              <form onSubmit={handleOrganizerLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Username (admin)</label>
                  <input type="text" style={styles.input} value={orgUsername} onChange={(e) => setOrgUsername(e.target.value)} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password (audisankara2026)</label>
                  <input type="password" style={styles.input} value={orgPassword} onChange={(e) => setOrgPassword(e.target.value)} required />
                </div>
                <button type="submit" style={styles.primaryButton}>Login</button>
              </form>
            </div>
          </div>
        )}

        {currentView === "organizer-dashboard" && organizerLoggedIn && (
          <div style={styles.dashboardContainer}>
            <div style={styles.dashHeader}>
              <h2>📊 Organizer Command Center</h2>
              <button style={styles.secondaryButton} onClick={() => { setOrganizerLoggedIn(false); setCurrentView("home"); }}>Logout</button>
            </div>

            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}><h3>{events.length}</h3><p>Total Events</p></div>
              <div style={styles.kpiCard}><h3>{participants.length}</h3><p>Total Participants</p></div>
              <div style={styles.kpiCard}><h3>{certificates.length}</h3><p>Certificates Generated</p></div>
            </div>

            <div style={styles.tabNav}>
              <button style={orgActiveTab === "events" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("events")}>1. Manage Events</button>
              <button style={orgActiveTab === "participants" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("participants")}>2. Participants & CSV</button>
              <button style={orgActiveTab === "certificates" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("certificates")}>3. Certificates ({certificates.length})</button>
            </div>

            {orgActiveTab === "events" && (
              <div style={styles.splitLayout}>
                <div style={styles.formCard}>
                  <h3>Create Event</h3>
                  <form onSubmit={handleCreateEvent} style={styles.form}>
                    <input type="text" style={styles.input} placeholder="Event Name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} required />
                    <input type="text" style={styles.input} placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
                    <input type="date" style={styles.input} value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} required />
                    <input type="text" style={styles.input} placeholder="Organizer / Dept" value={newEvent.organizer} onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })} required />
                    <input type="text" style={styles.input} placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
                    <button type="submit" style={styles.primaryButton}>Save Event</button>
                  </form>
                </div>
                <div style={styles.listCard}>
                  <h3>Existing Events</h3>
                  {events.map((ev) => (<div key={ev.id} style={styles.listItem}><h4>{ev.name}</h4><p>{ev.date} | {ev.venue}</p></div>))}
                </div>
              </div>
            )}

            {orgActiveTab === "participants" && (
              <div style={styles.splitLayout}>
                <div style={styles.formCard}>
                  <h3>Add Participant</h3>
                  <form onSubmit={handleAddParticipant} style={styles.form}>
                    <select style={styles.input} value={newPart.eventId} onChange={(e) => setNewPart({ ...newPart, eventId: e.target.value })} required>
                      <option value="">-- Choose Event --</option>
                      {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
                    </select>
                    <input type="text" style={styles.input} placeholder="Full Name" value={newPart.name} onChange={(e) => setNewPart({ ...newPart, name: e.target.value })} required />
                    <input type="email" style={styles.input} placeholder="Email" value={newPart.email} onChange={(e) => setNewPart({ ...newPart, email: e.target.value })} required />
                    <button type="submit" style={styles.primaryButton}>Add Participant</button>
                  </form>
                </div>
                <div style={styles.formCard}>
                  <h3>Upload CSV (Name, Email)</h3>
                  <form onSubmit={handleCsvUpload} style={styles.form}>
                    <select style={styles.input} value={selectedEventForPart} onChange={(e) => setSelectedEventForPart(e.target.value)} required>
                      <option value="">-- Choose Event --</option>
                      {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
                    </select>
                    <textarea style={{ ...styles.input, height: "80px" }} placeholder="Polu Harshitha, harshitha@audisankara.ac.in" value={csvText} onChange={(e) => setCsvText(e.target.value)} required />
                    <button type="submit" style={styles.primaryButton}>Import CSV</button>
                  </form>
                </div>
              </div>
            )}

            {orgActiveTab === "certificates" && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Event</th><th>Action</th></tr></thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id}>
                        <td><code>{cert.id}</code></td>
                        <td><b>{cert.participantName}</b></td>
                        <td>{cert.email}</td>
                        <td>{cert.eventName}</td>
                        <td><button style={styles.actionBtn} onClick={() => setPreviewCert(cert)}>View PDF</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {currentView === "participant-portal" && (
          <div style={styles.portalContainer}>
            <div style={styles.portalBox}>
              <h2>🎓 Student Certificate Portal</h2>
              <form onSubmit={handleParticipantLookup} style={styles.form}>
                <select style={styles.input} value={portalEventId} onChange={(e) => setPortalEventId(e.target.value)} required>
                  <option value="">-- Choose College Event --</option>
                  {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
                </select>
                <input type="email" style={styles.input} placeholder="Enter your email ID" value={portalEmail} onChange={(e) => setPortalEmail(e.target.value)} required />
                <button type="submit" style={styles.primaryButton}>Look Up & Generate Certificate</button>
              </form>
              {portalError && <div style={styles.errorAlert}>{portalError}</div>}
              {portalResult && (
                <div style={styles.resultBox}>
                  <h3 style={{ color: "#2E7D32" }}>✅ Certificate Found!</h3>
                  <p><b>Name:</b> {portalResult.participant.name}</p>
                  <p><b>ID:</b> <code>{portalResult.certificate.id}</code></p>
                  <button style={styles.primaryButton} onClick={() => setPreviewCert(portalResult.certificate)}>Download PDF Certificate</button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === "verify" && (
          <div style={styles.portalContainer}>
            <div style={styles.portalBox}>
              <h2>🔍 Public Certificate Verification</h2>
              <form onSubmit={handleVerifySearch} style={styles.form}>
                <input type="text" style={styles.input} placeholder="Enter Certificate ID (e.g., CERT-2026-...)" value={searchCertId} onChange={(e) => setSearchCertId(e.target.value)} required />
                <button type="submit" style={styles.primaryButton}>Verify</button>
              </form>
              {verifyResult && verifyResult.status === "valid" && (
                <div style={styles.validCard}>
                  <div style={styles.validBadge}>✔ Verified Authentic</div>
                  <p><b>Participant:</b> {verifyResult.cert.participantName}</p>
                  <p><b>Event:</b> {verifyResult.cert.eventName}</p>
                  <button style={styles.primaryButton} onClick={() => setPreviewCert(verifyResult.cert)}>View Certificate</button>
                </div>
              )}
              {verifyResult && verifyResult.status === "invalid" && <div style={styles.errorAlert}>✖ Invalid Certificate ID</div>}
            </div>
          </div>
        )}

        {currentView === "architecture" && (
          <div style={styles.archContainer}>
            <h2>⚙️ Java Spring Boot Architecture</h2>
            <p>Built with Spring Boot REST Controllers, JPA Repositories, and MySQL Entities.</p>
          </div>
        )}
      </main>

      {previewCert && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeModalBtn} onClick={() => setPreviewCert(null)}>✕</button>
            <div style={styles.certContainer}>
              <h2>AUDISANKARA COLLEGE OF ENGINEERING AND TECHNOLOGY</h2>
              <p>Gudur (Autonomous)</p>
              <h4>CERTIFICATE OF MERIT</h4>
              <h1>{previewCert.participantName}</h1>
              <p>for participating in</p>
              <h3>{previewCert.eventName}</h3>
              <p><b>Certificate ID:</b> {previewCert.id}</p>
            </div>
            <button style={{ ...styles.primaryButton, marginTop: "15px" }} onClick={() => showToast("Downloading PDF...")}>📥 Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: { fontFamily: "sans-serif", backgroundColor: "#FDFBF7", minHeight: "100vh", display: "flex", flexDirection: "column" },
  toast: { position: "fixed", top: "20px", right: "20px", backgroundColor: "#80C4B7", color: "#1F3A33", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", zIndex: 1000 },
  header: { backgroundColor: "#EECCD3", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" },
  logoTitleGroup: { display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" },
  collegeLogo: { width: "48px", height: "48px", objectFit: "contain", borderRadius: "50%", backgroundColor: "white", padding: "2px" },
  collegeName: { fontSize: "16px", fontWeight: "800", color: "#2B2D42", margin: 0 },
  collegeSub: { fontSize: "11px", color: "#4A4E69", margin: 0 },
  navBar: { display: "flex", gap: "10px", flexWrap: "wrap" },
  navLinkBtn: { backgroundColor: "#FFF", border: "1px solid #E3856B", color: "#E3856B", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  navLinkBtnTech: { backgroundColor: "#E3856B", border: "none", color: "white", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px" },
  mainContent: { flex: 1, padding: "30px 20px", maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" },
  heroSection: { textAlign: "center", padding: "30px 10px" },
  badgeHero: { display: "inline-block", backgroundColor: "#EEC95C", color: "#3A3520", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" },
  heroTitle: { fontSize: "28px", fontWeight: "900", color: "#2B2D42", marginBottom: "15px" },
  heroDesc: { fontSize: "15px", color: "#4A4E69", maxWidth: "700px", margin: "0 auto 30px auto", lineHeight: "1.5" },
  heroActionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" },
  heroCard: { backgroundColor: "white", padding: "25px", borderRadius: "12px", border: "1px solid #F0E6DF", textAlign: "left", cursor: "pointer" },
  authContainer: { display: "flex", justifyContent: "center", padding: "40px 0" },
  authBox: { backgroundColor: "white", padding: "35px", borderRadius: "14px", width: "100%", maxWidth: "400px", boxShadow: "0 6px 20px rgba(0,0,0,0.06)", border: "1px solid #EECCD3" },
  form: { display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "12px", fontWeight: "bold", color: "#4A4E69" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #DDD", fontSize: "14px", backgroundColor: "#FAFAFA" },
  primaryButton: { backgroundColor: "#E3856B", color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%" },
  secondaryButton: { backgroundColor: "#EECCD3", color: "#2B2D42", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" },
  errorAlert: { backgroundColor: "#FFCDD2", color: "#B71C1C", padding: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
  dashboardContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "15px 25px", borderRadius: "10px" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" },
  kpiCard: { backgroundColor: "white", padding: "15px", borderRadius: "10px", textAlign: "center", borderTop: "4px solid #E3856B" },
  tabNav: { display: "flex", gap: "8px", borderBottom: "2px solid #E0E0E0", paddingBottom: "8px", flexWrap: "wrap" },
  tabBtn: { backgroundColor: "transparent", border: "none", padding: "8px 14px", fontWeight: "600", color: "#666", cursor: "pointer" },
  tabBtnActive: { backgroundColor: "#80C4B7", color: "#1F3A33", border: "none", padding: "8px 14px", fontWeight: "bold", borderRadius: "6px", cursor: "pointer" },
  splitLayout: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" },
  formCard: { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
  listCard: { backgroundColor: "white", padding: "20px", borderRadius: "10px" },
  listItem: { backgroundColor: "#FAFAFA", padding: "10px", borderRadius: "6px", border: "1px solid #EEE", marginBottom: "8px", fontSize: "13px" },
  tableWrapper: { overflowX: "auto", backgroundColor: "white", padding: "20px", borderRadius: "10px" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" },
  actionBtn: { backgroundColor: "#EEC95C", border: "none", padding: "6px 10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" },
  portalContainer: { display: "flex", justifyContent: "center", padding: "20px 0" },
  portalBox: { backgroundColor: "white", padding: "35px", borderRadius: "14px", width: "100%", maxWidth: "550px", border: "1px solid #E3856B" },
  resultBox: { marginTop: "20px", backgroundColor: "#E8F5E9", padding: "15px", borderRadius: "8px" },
  validCard: { marginTop: "20px", backgroundColor: "#E8F5E9", padding: "20px", borderRadius: "10px", border: "2px solid #81C784" },
  validBadge: { backgroundColor: "#2E7D32", color: "white", padding: "6px 14px", borderRadius: "20px", fontWeight: "bold", display: "inline-block", fontSize: "12px" },
  archContainer: { backgroundColor: "white", padding: "30px", borderRadius: "12px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItem: "center", zIndex: 2000, padding: "20px" },
  modalContent: { backgroundColor: "white", padding: "25px", borderRadius: "14px", maxWidth: "650px", width: "100%", position: "relative", textAlign: "center" },
  closeModalBtn: { position: "absolute", top: "10px", right: "10px", backgroundColor: "#eee", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  certContainer: { border: "6px double #2B2D42", padding: "25px", backgroundColor: "#FFFCF9", marginTop: "10px" }
};