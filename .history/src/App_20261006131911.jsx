import React, { useState } from "react";

const INITIAL_EVENTS = [
  { id: 1, name: "National Hackathon 2026", description: "24-hour coding challenge on AI and Full-Stack development.", date: "2026-03-15", organizer: "Dept of CSE & Data Science", venue: "Auditorium Hall 1" },
  { id: 2, name: "Cloud & DevOps Workshop", description: "Hands-on session on AWS, Docker, and Spring Boot deployment.", date: "2026-04-10", organizer: "Computer Society of India (CSI)", venue: "Seminar Hall B" },
];

const INITIAL_COORDINATORS = [
  { id: 1, name: "Prof. Rajesh Kumar", email: "rajesh.coordinator@gmail.com", role: "Faculty Head" },
  { id: 2, name: "Polu Harshitha", email: "harshireddy1606@gmail.com", role: "Student Lead Coordinator" },
];

const INITIAL_PARTICIPANTS = [
  { id: 1, name: "Polu Harshitha", email: "harshireddy1606@gmail.com", eventId: 1, eventName: "National Hackathon 2026" },
  { id: 2, name: "Kiran Kumar", email: "kiran.student@gmail.com", eventId: 1, eventName: "National Hackathon 2026" }
];

const INITIAL_CERTIFICATES = [
  { id: "CERT-2026-A7X92K", participantName: "Polu Harshitha", email: "harshireddy1606@gmail.com", eventName: "National Hackathon 2026", date: "2026-03-15", organizer: "Dept of CSE & Data Science" },
];

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [organizerLoggedIn, setOrganizerLoggedIn] = useState(false);
  const [orgUserRole, setOrgUserRole] = useState(""); 
  const [orgUsername, setOrgUsername] = useState("");
  const [orgPassword, setOrgPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [coordinators, setCoordinators] = useState(INITIAL_COORDINATORS);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);

  const [orgActiveTab, setOrgActiveTab] = useState("events");
  const [newEvent, setNewEvent] = useState({ name: "", description: "", date: "", organizer: "", venue: "" });
  const [newCoord, setNewCoord] = useState({ name: "", email: "", role: "Student Coordinator" });
  const [csvText, setCsvText] = useState("");
  const [selectedEventForPart, setSelectedEventForPart] = useState("");

  const [portalEmail, setPortalEmail] = useState("");
  const [portalError, setPortalError] = useState("");
  const [portalUser, setPortalUser] = useState(null); 
  const [myCertificates, setMyCertificates] = useState([]);

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
    setLoginError("");

    const cleanInputUser = orgUsername.trim().toLowerCase();

    // Master Organizer / Admin login check
    if ((cleanInputUser === "admin" || cleanInputUser === "harshireddy1606@gmail.com") && orgPassword === "audisankara2026") {
      setOrganizerLoggedIn(true);
      setOrgUserRole("Master Organizer (Harshitha)");
      setCurrentView("organizer-dashboard");
      showToast("Master Organizer Login Successful!");
      return;
    }

    // Check student coordinator list
    const matchedCoord = coordinators.find(
      (c) => c.email.toLowerCase() === cleanInputUser
    );
    if (matchedCoord && orgPassword === "audisankara2026") {
      setOrganizerLoggedIn(true);
      setOrgUserRole(`Coordinator (${matchedCoord.name})`);
      setCurrentView("organizer-dashboard");
      showToast(`Welcome Coordinator: ${matchedCoord.name}!`);
      return;
    }

    setLoginError("Access Denied: Invalid email or password. Use harshireddy1606@gmail.com / audisankara2026.");
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) return;
    const created = { id: Date.now(), ...newEvent };
    setEvents([...events, created]);
    setNewEvent({ name: "", description: "", date: "", organizer: "", venue: "" });
    showToast("Event created successfully!");
  };

  const handleAddCoordinator = (e) => {
    e.preventDefault();
    if (!newCoord.name || !newCoord.email) return;
    setCoordinators([...coordinators, { id: Date.now(), ...newCoord }]);
    setNewCoord({ name: "", email: "", role: "Student Coordinator" });
    showToast("Student Coordinator added successfully!");
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
        newPs.push({ id: Date.now() + Math.random(), name: parts[0], email: parts[1].toLowerCase(), eventId: Number(selectedEventForPart), eventName: ev ? ev.name : "" });
        addedCount++;
      }
    });
    setParticipants(newPs);
    setCsvText("");
    showToast(`Imported ${addedCount} participants via CSV!`);
  };

  const handleParticipantLogin = (e) => {
    e.preventDefault();
    setPortalError("");

    const cleanEmail = portalEmail.trim().toLowerCase();

    // STRICT CHECK: Only allow access if the email exists in participants added by organizers
    const registeredEvents = participants.filter((p) => p.email.toLowerCase() === cleanEmail);

    if (registeredEvents.length === 0) {
      setPortalError("Access Denied: Your email is not registered in any event participant list added by organizers.");
      return;
    }

    setPortalUser({ email: cleanEmail, name: registeredEvents[0].name });
    
    const userCerts = registeredEvents.map((reg) => {
      let cert = certificates.find((c) => c.email.toLowerCase() === cleanEmail && c.eventName === reg.eventName);
      if (!cert) {
        cert = {
          id: `CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          participantName: reg.name,
          email: cleanEmail,
          eventName: reg.eventName,
          date: "2026-03-15",
          organizer: "Audisankara College",
        };
        setCertificates((prev) => [cert, ...prev]);
      }
      return cert;
    });

    setMyCertificates(userCerts);
    showToast("Successfully logged in to Participant Portal!");
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

      <header style={styles.header}>
        <div style={styles.logoTitleGroup} onClick={() => setCurrentView("home")}>
          <div style={styles.logoCircle}>🌸</div>
          <div>
            <h1 style={styles.collegeName}>Audisankara College of Engineering & Technology</h1>
            <p style={styles.collegeSub}>Autonomous | CertifyHub Floral Portal</p>
          </div>
        </div>

        <nav style={styles.navBar}>
          <button style={currentView === "home" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("home")}>Home</button>
          <button style={currentView === "participant-portal" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("participant-portal")}>Participant Portal</button>
          <button style={currentView === "verify" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("verify")}>Verify Certificate</button>
          <button style={currentView === "organizer-login" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("organizer-login")}>Organizer Login</button>
        </nav>
      </header>

      <main style={styles.mainContent}>
        {currentView === "home" && (
          <div style={styles.heroSection}>
            <div style={styles.badgeHero}>✨ Secure Floral Credential Ecosystem</div>
            <h2 style={styles.heroTitle}>Automated Certificate Management & Verification</h2>
            <p style={styles.heroDesc}>
              An elegant official credential portal for Audisankara College. Organizers manage events and import participants seamlessly, allowing verified students to claim certificates.
            </p>

            <div style={styles.heroActionGrid}>
              <div style={styles.heroCard} onClick={() => setCurrentView("participant-portal")}>
                <h3>🌷 Participant Portal</h3>
                <p>Log in with your registered email address to view and download your certificates.</p>
              </div>
              <div style={styles.heroCard} onClick={() => setCurrentView("verify")}>
                <h3>🔍 Instant Verification</h3>
                <p>Verify certificate authenticity instantly by entering the unique Certificate ID.</p>
              </div>
              <div style={styles.heroCard} onClick={() => setCurrentView("organizer-login")}>
                <h3>🌿 Organizer & Coordinator Login</h3>
                <p>Secure admin and student coordinator dashboard to manage events and records.</p>
              </div>
            </div>
          </div>
        )}

        {currentView === "organizer-login" && (
          <div style={styles.authContainer}>
            <div style={styles.authBox}>
              <h2>🌿 Organizer Login</h2>
              <p style={{fontSize: "13px", color: "#6B5B5B", marginBottom: "15px"}}>
                Use Master Organizer email <b>harshireddy1606@gmail.com</b> with password <b>audisankara2026</b>.
              </p>
              {loginError && <div style={styles.errorAlert}>{loginError}</div>}
              <form onSubmit={handleOrganizerLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Organizer Email / Username</label>
                  <input type="text" style={styles.input} placeholder="harshireddy1606@gmail.com" value={orgUsername} onChange={(e) => setOrgUsername(e.target.value)} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <input type="password" style={styles.input} placeholder="audisankara2026" value={orgPassword} onChange={(e) => setOrgPassword(e.target.value)} required />
                </div>
                <button type="submit" style={styles.primaryButton}>Access Dashboard</button>
              </form>
            </div>
          </div>
        )}

        {currentView === "organizer-dashboard" && organizerLoggedIn && (
          <div style={styles.dashboardContainer}>
            <div style={styles.dashHeader}>
              <div>
                <h2>🌿 Command Center</h2>
                <span style={styles.roleBadge}>Logged in as: {orgUserRole}</span>
              </div>
              <button style={styles.secondaryButton} onClick={() => { setOrganizerLoggedIn(false); setCurrentView("home"); }}>Logout</button>
            </div>

            <div style={styles.kpiGrid}>
              <div style={styles.kpiCard}><h3>{events.length}</h3><p>Total Events</p></div>
              <div style={styles.kpiCard}><h3>{coordinators.length}</h3><p>Student Coordinators</p></div>
              <div style={styles.kpiCard}><h3>{participants.length}</h3><p>Registered Participants</p></div>
              <div style={styles.kpiCard}><h3>{certificates.length}</h3><p>Certificates Issued</p></div>
            </div>

            <div style={styles.tabNav}>
              <button style={orgActiveTab === "events" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("events")}>1. Manage Events</button>
              <button style={orgActiveTab === "coordinators" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("coordinators")}>2. Student Coordinators</button>
              <button style={orgActiveTab === "participants" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("participants")}>3. Participants & CSV Upload</button>
              <button style={orgActiveTab === "certificates" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setOrgActiveTab("certificates")}>4. Certificates</button>
            </div>

            {orgActiveTab === "events" && (
              <div style={styles.splitLayout}>
                <div style={styles.formCard}>
                  <h3>Create College Event</h3>
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
                  <h3>Active Events</h3>
                  {events.map((ev) => (<div key={ev.id} style={styles.listItem}><h4>{ev.name}</h4><p>{ev.date} | {ev.venue}</p></div>))}
                </div>
              </div>
            )}

            {orgActiveTab === "coordinators" && (
              <div style={styles.splitLayout}>
                <div style={styles.formCard}>
                  <h3>Add Student Coordinator</h3>
                  <p style={{fontSize: "13px", color: "#6B5B5B", marginBottom: "10px"}}>
                    Registered student coordinators can log in with password <b>audisankara2026</b> to help manage events and view records.
                  </p>
                  <form onSubmit={handleAddCoordinator} style={styles.form}>
                    <input type="text" style={styles.input} placeholder="Student Coordinator Name" value={newCoord.name} onChange={(e) => setNewCoord({ ...newCoord, name: e.target.value })} required />
                    <input type="email" style={styles.email} placeholder="Email Address (e.g. lead@gmail.com)" value={newCoord.email} onChange={(e) => setNewCoord({ ...newCoord, email: e.target.value })} required />
                    <button type="submit" style={styles.primaryButton}>Add Coordinator</button>
                  </form>
                </div>
                <div style={styles.listCard}>
                  <h3>Authorized Student Coordinators</h3>
                  {coordinators.map((c) => (
                    <div key={c.id} style={styles.listItem}>
                      <h4>{c.name}</h4>
                      <p><b>Email:</b> {c.email} | <b>Role:</b> {c.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {orgActiveTab === "participants" && (
              <div style={styles.splitLayout}>
                <div style={styles.formCard}>
                  <h3>Upload Participant List (Name, Email)</h3>
                  <p style={{fontSize: "13px", color: "#6B5B5B", marginBottom: "10px"}}>
                    Only students added here will have permission to log into the Participant Portal. Format: Name, email per line.
                  </p>
                  <form onSubmit={handleCsvUpload} style={styles.form}>
                    <select style={styles.input} value={selectedEventForPart} onChange={(e) => setSelectedEventForPart(e.target.value)} required>
                      <option value="">-- Choose Event --</option>
                      {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
                    </select>
                    <textarea style={{ ...styles.input, height: "100px" }} placeholder="Polu Harshitha, harshireddy1606@gmail.com&#10;Kiran Kumar, kiran@gmail.com" value={csvText} onChange={(e) => setCsvText(e.target.value)} required />
                    <button type="submit" style={styles.primaryButton}>Upload & Register Participants</button>
                  </form>
                </div>
                <div style={styles.listCard}>
                  <h3>Registered Participant List ({participants.length})</h3>
                  <div style={{maxHeight: "250px", overflowY: "auto"}}>
                    {participants.map((p) => (
                      <div key={p.id} style={styles.listItem}>
                        <b>{p.name}</b> ({p.email})<br/><small style={{color: "#5B7065"}}>Event: {p.eventName}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {orgActiveTab === "certificates" && (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead><tr><th>ID</th><th>Participant</th><th>Email</th><th>Event</th><th>Action</th></tr></thead>
                  <tbody>
                    {certificates.map((cert) => (
                      <tr key={cert.id}>
                        <td><code>{cert.id}</code></td>
                        <td><b>{cert.participantName}</b></td>
                        <td>{cert.email}</td>
                        <td>{cert.eventName}</td>
                        <td><button style={styles.actionBtn} onClick={() => setPreviewCert(cert)}>View Certificate</button></td>
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
              <h2>🌷 Student Participant Portal</h2>
              <p style={{fontSize: "13px", color: "#6B5B5B", marginBottom: "20px"}}>
                Enter your email address to log in. Access is strictly restricted to participants pre-registered by event organizers.
              </p>

              {!portalUser ? (
                <form onSubmit={handleParticipantLogin} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Your Registered Email Address</label>
                    <input type="email" style={styles.input} placeholder="harshireddy1606@gmail.com" value={portalEmail} onChange={(e) => setPortalEmail(e.target.value)} required />
                  </div>
                  <button type="submit" style={styles.primaryButton}>Login to Portal</button>
                </form>
              ) : (
                <div>
                  <div style={styles.userWelcomeBox}>
                    <p style={{margin: 0}}><b>Welcome, {portalUser.name}!</b></p>
                    <p style={{margin: "4px 0 0 0", fontSize: "12px", color: "#6B5B5B"}}>{portalUser.email}</p>
                    <button style={styles.smallLogoutBtn} onClick={() => { setPortalUser(null); setPortalEmail(""); }}>Switch Account</button>
                  </div>

                  <h3 style={{marginTop: "20px", fontSize: "16px"}}>Your Earned Certificates:</h3>
                  {myCertificates.length === 0 ? (
                    <p>No certificates available yet.</p>
                  ) : (
                    <div style={{display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px"}}>
                      {myCertificates.map((cert) => (
                        <div key={cert.id} style={styles.certItemCard}>
                          <div>
                            <h4>{cert.eventName}</h4>
                            <p style={{margin: 0, fontSize: "12px", color: "#6B5B5B"}}>ID: <code>{cert.id}</code></p>
                          </div>
                          <button style={styles.primaryButtonSmall} onClick={() => setPreviewCert(cert)}>View / Download</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {portalError && <div style={{...styles.errorAlert, marginTop: "15px"}}>{portalError}</div>}
            </div>
          </div>
        )}

        {currentView === "verify" && (
          <div style={styles.portalContainer}>
            <div style={styles.portalBox}>
              <h2>🔍 Public Certificate Verification</h2>
              <form onSubmit={handleVerifySearch} style={styles.form}>
                <input type="text" style={styles.input} placeholder="Enter Certificate ID (e.g., CERT-2026-...)" value={searchCertId} onChange={(e) => setSearchCertId(e.target.value)} required />
                <button type="submit" style={styles.primaryButton}>Verify Authenticity</button>
              </form>
              {verifyResult && verifyResult.status === "valid" && (
                <div style={styles.validCard}>
                  <div style={styles.validBadge}>✔ Verified Authentic</div>
                  <p><b>Participant:</b> {verifyResult.cert.participantName}</p>
                  <p><b>Event:</b> {verifyResult.cert.eventName}</p>
                  <button style={styles.primaryButton} onClick={() => setPreviewCert(verifyResult.cert)}>View Certificate</button>
                </div>
              )}
              {verifyResult && verifyResult.status === "invalid" && <div style={{...styles.errorAlert, marginTop: "15px"}}>✖ Invalid Certificate ID</div>}
            </div>
          </div>
        )}
      </main>

      {previewCert && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button style={styles.closeModalBtn} onClick={() => setPreviewCert(null)}>✕</button>
            <div style={styles.certContainer}>
              <h2>AUDISANKARA COLLEGE OF ENGINEERING & TECHNOLOGY</h2>
              <p>Gudur (Autonomous)</p>
              <h4>CERTIFICATE OF PARTICIPATION</h4>
              <h1>{previewCert.participantName}</h1>
              <p>This is proudly presented for successfully participating in</p>
              <h3>{previewCert.eventName}</h3>
              <p><b>Certificate ID:</b> {previewCert.id} | <b>Date:</b> {previewCert.date}</p>
            </div>
            <button style={{ ...styles.primaryButton, marginTop: "15px" }} onClick={() => showToast("Downloading PDF Certificate...")}>📥 Download PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  appContainer: { fontFamily: "'Quicksand', 'Poppins', sans-serif", backgroundColor: "#FDFBF7", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#4A3B3B" },
  toast: { position: "fixed", top: "20px", right: "20px", backgroundColor: "#8E7575", color: "white", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", zIndex: 1000, boxShadow: "0 4px 15px rgba(142,117,117,0.2)" },
  header: { backgroundColor: "#5B7065", padding: "18px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid #758D80", position: "sticky", top: 0, zIndex: 999, boxShadow: "0 2px 10px rgba(91,112,101,0.15)" },
  logoTitleGroup: { display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" },
  logoCircle: { width: "46px", height: "46px", borderRadius: "50%", backgroundColor: "#F4D6CD", color: "#4A3B3B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  collegeName: { fontSize: "16px", fontWeight: "700", color: "#FFF9F5", margin: 0 },
  collegeSub: { fontSize: "12px", color: "#D4E2DB", margin: 0 },
  navBar: { display: "flex", gap: "8px", flexWrap: "wrap" },
  navBtn: { backgroundColor: "transparent", border: "1px solid #758D80", color: "#E2ECE7", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "500", fontSize: "13px", transition: "all 0.2s" },
  navBtnActive: { backgroundColor: "#F4D6CD", border: "1px solid #F4D6CD", color: "#4A3B3B", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "13px" },
  mainContent: { flex: 1, padding: "40px 20px", maxWidth: "1150px", margin: "0 auto", width: "100%", boxSizing: "border-box" },
  heroSection: { textAlign: "center", padding: "20px 10px" },
  badgeHero: { display: "inline-block", backgroundColor: "#F4D6CD", color: "#5C3A35", padding: "6px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "700", marginBottom: "15px", boxShadow: "0 2px 6px rgba(244,214,205,0.4)" },
  heroTitle: { fontSize: "32px", fontWeight: "800", color: "#4A3B3B", marginBottom: "15px", letterSpacing: "-0.5px" },
  heroDesc: { fontSize: "15px", color: "#6B5B5B", maxWidth: "750px", margin: "0 auto 35px auto", lineHeight: "1.6" },
  heroActionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" },
  heroCard: { backgroundColor: "#FFFFFF", padding: "28px", borderRadius: "16px", border: "1px solid #EAE3DC", textAlign: "left", cursor: "pointer", boxShadow: "0 4px 12px rgba(107,91,91,0.04)", transition: "all 0.2s" },
  authContainer: { display: "flex", justifyContent: "center", padding: "40px 0" },
  authBox: { backgroundColor: "#FFFFFF", padding: "35px", borderRadius: "16px", width: "100%", maxWidth: "420px", boxShadow: "0 6px 20px rgba(107,91,91,0.06)", border: "1px solid #EAE3DC" },
  form: { display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "600", color: "#6B5B5B" },
  input: { padding: "10px 14px", borderRadius: "10px", border: "1px solid #D8CECA", fontSize: "14px", backgroundColor: "#FAF7F5", outline: "none", color: "#4A3B3B" },
  primaryButton: { backgroundColor: "#5B7065", color: "white", border: "none", padding: "11px 16px", borderRadius: "10px", fontWeight: "600", cursor: "pointer", width: "100%", fontSize: "14px", boxShadow: "0 2px 8px rgba(91,112,101,0.2)" },
  primaryButtonSmall: { backgroundColor: "#5B7065", color: "white", border: "none", padding: "6px 12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "12px" },
  secondaryButton: { backgroundColor: "#EAE3DC", color: "#4A3B3B", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px" },
  errorAlert: { backgroundColor: "#FBEBEB", color: "#8A3B3B", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600" },
  dashboardContainer: { display: "flex", flexDirection: "column", gap: "20px" },
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", padding: "20px 25px", borderRadius: "16px", border: "1px solid #EAE3DC" },
  roleBadge: { backgroundColor: "#F4D6CD", color: "#5C3A35", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "15px" },
  kpiCard: { backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "16px", textAlign: "center", border: "1px solid #EAE3DC", borderTop: "4px solid #5B7065" },
  tabNav: { display: "flex", gap: "8px", borderBottom: "2px solid #EAE3DC", paddingBottom: "10px", flexWrap: "wrap" },
  tabBtn: { backgroundColor: "transparent", border: "none", padding: "8px 14px", fontWeight: "600", color: "#8E7D7D", cursor: "pointer", fontSize: "13px" },
  tabBtnActive: { backgroundColor: "#5B7065", color: "white", border: "none", padding: "8px 14px", fontWeight: "600", borderRadius: "8px", cursor: "pointer" },