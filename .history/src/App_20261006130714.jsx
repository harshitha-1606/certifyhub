import React, { useState } from "react";

const INITIAL_EVENTS = [
  { id: 1, name: "National Hackathon 2026", description: "24-hour coding challenge on AI and Full-Stack development.", date: "2026-03-15", organizer: "Dept of CSE & Data Science", venue: "Auditorium Hall 1" },
  { id: 2, name: "Cloud & DevOps Workshop", description: "Hands-on session on AWS, Docker, and Spring Boot deployment.", date: "2026-04-10", organizer: "Computer Society of India (CSI)", venue: "Seminar Hall B" },
];

const INITIAL_COORDINATORS = [
  { id: 1, name: "Prof. Rajesh Kumar", email: "rajesh.coordinator@gmail.com", role: "Faculty Head" },
  { id: 2, name: "Polu Harshitha", email: "harshitha.student@gmail.com", role: "Student Lead Coordinator" },
];

const INITIAL_PARTICIPANTS = [
  { id: 1, name: "Polu Harshitha", email: "harshitha@gmail.com", eventId: 1, eventName: "National Hackathon 2026" },
  { id: 2, name: "Kiran Kumar", email: "kiran.student@gmail.com", eventId: 1, eventName: "National Hackathon 2026" }
];

const INITIAL_CERTIFICATES = [
  { id: "CERT-2026-A7X92K", participantName: "Polu Harshitha", email: "harshitha@gmail.com", eventName: "National Hackathon 2026", date: "2026-03-15", organizer: "Dept of CSE & Data Science" },
];

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [organizerLoggedIn, setOrganizerLoggedIn] = useState(false);
  const [orgUserRole, setOrgUserRole] = useState(""); // 'admin' or 'coordinator'
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

  // Participant Portal State (Strictly checks registered email list)
  const [portalEmail, setPortalEmail] = useState("");
  const [portalError, setPortalError] = useState("");
  const [portalUser, setPortalUser] = useState(null); // logged in participant object
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

    // Master Admin check
    if (orgUsername === "admin" && orgPassword === "audisankara2026") {
      setOrganizerLoggedIn(true);
      setOrgUserRole("Master Admin");
      setCurrentView("organizer-dashboard");
      showToast("Master Admin Login Successful!");
      return;
    }

    // Check if logged in email matches any registered Student Coordinator
    const matchedCoord = coordinators.find(
      (c) => c.email.toLowerCase() === orgUsername.toLowerCase()
    );
    if (matchedCoord) {
      setOrganizerLoggedIn(true);
      setOrgUserRole(`Coordinator (${matchedCoord.name})`);
      setCurrentView("organizer-dashboard");
      showToast(`Welcome Coordinator: ${matchedCoord.name}!`);
      return;
    }

    setLoginError("Access Denied: Invalid Admin or Student Coordinator credentials.");
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
        newPs.push({ id: Date.now() + Math.random(), name: parts[0], email: parts[1], eventId: Number(selectedEventForPart), eventName: ev ? ev.name : "" });
        addedCount++;
      }
    });
    setParticipants(newPs);
    setCsvText("");
    showToast(`Imported ${addedCount} participants via CSV!`);
  };

  // Participant Portal Login (Strict email check against uploaded participant database)
  const handleParticipantLogin = (e) => {
    e.preventDefault();
    setPortalError("");

    const cleanEmail = portalEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith("@gmail.com")) {
      setPortalError("Please enter a valid @gmail.com email address.");
      return;
    }

    // Find all events this email is registered for
    const registeredEvents = participants.filter((p) => p.email.toLowerCase() === cleanEmail);

    if (registeredEvents.length === 0) {
      setPortalError("Email not found in registered participant list. Please contact your event coordinator to upload your details.");
      return;
    }

    setPortalUser({ email: cleanEmail, name: registeredEvents[0].name });
    
    // Generate or fetch certificates for all registered events for this user
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

      {/* REFINED PROFESSIONAL HEADER */}
      <header style={styles.header}>
        <div style={styles.logoTitleGroup} onClick={() => setCurrentView("home")}>
          <div style={styles.logoCircle}>ASC</div>
          <div>
            <h1 style={styles.collegeName}>Audisankara College of Engineering and Technology</h1>
            <p style={styles.collegeSub}>Autonomous & Deemed University Approved | CertifyHub Portal</p>
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
            <div style={styles.badgeHero}>Secure Credential Ecosystem v2.8</div>
            <h2 style={styles.heroTitle}>Automated College Certificate Management & Verification</h2>
            <p style={styles.heroDesc}>
              Official credential portal for Audisankara College. Organizers and student coordinators can manage events and import participant lists via CSV, allowing students to securely log in with their registered Gmail to claim verified certificates.
            </p>

            <div style={styles.heroActionGrid}>
              <div style={styles.heroCard} onClick={() => setCurrentView("participant-portal")}>
                <h3>🎓 Participant Portal</h3>
                <p>Log in with your registered Gmail address to instantly view and download your certificates.</p>
              </div>
              <div style={styles.heroCard} onClick={() => setCurrentView("verify")}>
                <h3>🔍 Instant Verification</h3>
                <p>Verify certificate authenticity instantly by entering the unique Certificate ID.</p>
              </div>
              <div style={styles.heroCard} onClick={() => setCurrentView("organizer-login")}>
                <h3>🛠️ Organizer & Coordinator Login</h3>
                <p>Secure admin & student coordinator dashboard to manage events and participant databases.</p>
              </div>
            </div>
          </div>
        )}

        {/* ORGANIZER & COORDINATOR LOGIN */}
        {currentView === "organizer-login" && (
          <div style={styles.authContainer}>
            <div style={styles.authBox}>
              <h2>🔒 Organizer / Coordinator Login</h2>
              <p style={{fontSize: "12px", color: "#64748B", marginBottom: "15px"}}>
                Enter Master Admin credentials or your registered Student Coordinator Gmail.
              </p>
              {loginError && <div style={styles.errorAlert}>{loginError}</div>}
              <form onSubmit={handleOrganizerLogin} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Username or Coordinator Email</label>
                  <input type="text" style={styles.input} placeholder="admin or student email@gmail.com" value={orgUsername} onChange={(e) => setOrgUsername(e.target.value)} required />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password / Access Key</label>
                  <input type="password" style={styles.input} placeholder="audisankara2026 (or any for coordinator)" value={orgPassword} onChange={(e) => setOrgPassword(e.target.value)} required />
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
                <h2>📊 Command Center</h2>
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
                  <p style={{fontSize: "12px", color: "#64748B", marginBottom: "10px"}}>
                    Registered student coordinators can log in to help manage events and view records.
                  </p>
                  <form onSubmit={handleAddCoordinator} style={styles.form}>
                    <input type="text" style={styles.input} placeholder="Student Coordinator Name" value={newCoord.name} onChange={(e) => setNewCoord({ ...newCoord, name: e.target.value })} required />
                    <input type="email" style={styles.input} placeholder="Gmail Address (e.g. lead@gmail.com)" value={newCoord.email} onChange={(e) => setNewCoord({ ...newCoord, email: e.target.value })} required />
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
                  <h3>Upload CSV (Name, Gmail)</h3>
                  <p style={{fontSize: "12px", color: "#64748B", marginBottom: "10px"}}>
                    Only participants uploaded here can log into the Participant Portal using their Gmail. Format: Name, email per line.
                  </p>
                  <form onSubmit={handleCsvUpload} style={styles.form}>
                    <select style={styles.input} value={selectedEventForPart} onChange={(e) => setSelectedEventForPart(e.target.value)} required>
                      <option value="">-- Choose Event --</option>
                      {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.name}</option>))}
                    </select>
                    <textarea style={{ ...styles.input, height: "100px" }} placeholder="Polu Harshitha, harshitha@gmail.com&#10;Kiran Kumar, kiran@gmail.com" value={csvText} onChange={(e) => setCsvText(e.target.value)} required />
                    <button type="submit" style={styles.primaryButton}>Upload & Register Participants</button>
                  </form>
                </div>
                <div style={styles.listCard}>
                  <h3>Registered Participant List ({participants.length})</h3>
                  <div style={{maxHeight: "250px", overflowY: "auto"}}>
                    {participants.map((p) => (
                      <div key={p.id} style={styles.listItem}>
                        <b>{p.name}</b> ({p.email})<br/><small style={{color: "#0F766E"}}>Event: {p.eventName}</small>
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

        {/* PARTICIPANT PORTAL (GMAIL LOGIN RESTRICTED TO UPLOADED LIST) */}
        {currentView === "participant-portal" && (
          <div style={styles.portalContainer}>
            <div style={styles.portalBox}>
              <h2>🎓 Student Participant Portal</h2>
              <p style={{fontSize: "13px", color: "#64748B", marginBottom: "20px"}}>
                Enter your registered Gmail address to log in and access your event certificates.
              </p>

              {!portalUser ? (
                <form onSubmit={handleParticipantLogin} style={styles.form}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Your Registered Gmail Address</label>
                    <input type="email" style={styles.input} placeholder="yourname@gmail.com" value={portalEmail} onChange={(e) => setPortalEmail(e.target.value)} required />
                  </div>
                  <button type="submit" style={styles.primaryButton}>Login to Portal</button>
                </form>
              ) : (
                <div>
                  <div style={styles.user वेलकमBox}>
                    <p style={{margin: 0}}><b>Welcome, {portalUser.name}!</b></p>
                    <p style={{margin: "4px 0 0 0", fontSize: "12px", color: "#64748B"}}>{portalUser.email}</p>
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
                            <p style={{margin: 0, fontSize: "12px", color: "#64748B"}}>ID: <code>{cert.id}</code></p>
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
              {verifyResult && verifyResult.status === "valid