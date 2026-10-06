import React, { useState } from "react";

export default function App() {
  // Navigation & Auth State
  const [currentView, setCurrentView] = useState("home"); // home, organizer, participant, verify
  const [organizerRole, setOrganizerRole] = useState(null); // 'admin' or 'coordinator'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, events, upload, verify-mgmt

  // Mock Data for Audisankara College Events & Certificates
  const [events, setEvents] = useState([
    { id: 1, name: "National Symposium on AI & ML", date: "2026-03-15", org: "CSE Dept", venue: "Auditorium 1", certificatesIssued: 145 },
    { id: 2, name: "Web Development Hackathon 2026", date: "2026-04-10", org: "IT Dept", venue: "Computer Lab 3", certificatesIssued: 90 },
    { id: 3, name: "IoT & Embedded Systems Workshop", date: "2026-05-02", org: "ECE Dept", SeminarHall: "Seminar Hall B", certificatesIssued: 60 }
  ]);

  const [certificates, setCertificates] = useState([
    { certId: "ASCET-CSE-2026-001", studentName: "Polu Harshitha", eventName: "National Symposium on AI & ML", date: "2026-03-15", grade: "Outstanding", verified: true },
    { certId: "ASCET-IT-2026-042", studentName: "Rahul Sharma", eventName: "Web Development Hackathon 2026", date: "2026-04-10", grade: "Winner", verified: true },
    { certId: "ASCET-ECE-2026-088", studentName: "Priya V", eventName: "IoT & Embedded Systems Workshop", date: "2026-05-02", grade: "Participant", verified: true }
  ]);

  // Public Verification State
  const [searchId, setSearchId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // New Event Form State
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventOrg, setNewEventOrg] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");

  // CSV Bulk Upload Mock State
  const [uploadEventId, setUploadEventId] = useState("1");
  const [csvText, setCsvText] = useState("Harshitha Polu, harshitha@audisankara.ac.in, Outstanding\nKiran Kumar, kiran@audisankara.ac.in, Participant");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
      setActiveTab("dashboard");
    } else {
      alert("Please enter valid credentials.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOrganizerRole(null);
    setUsername("");
    setPassword("");
    setCurrentView("home");
  };

  // Handle Public Verification Search
  const handleVerify = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const found = certificates.find(c => c.certId.toLowerCase() === searchId.trim().toLowerCase());
    setVerificationResult(found || null);
  };

  // Handle Create Event
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;
    const newEv = {
      id: events.length + 1,
      name: newEventName,
      date: newEventDate,
      org: newEventOrg || "Audisankara Dept",
      venue: newEventVenue || "Main Campus",
      certificatesIssued: 0
    };
    setEvents([...events, newEv]);
    setNewEventName("");
    setNewEventDate("");
    setNewEventOrg("");
    setNewEventVenue("");
    alert("Event created successfully!");
  };

  // Handle CSV Upload Generation
  const handleBulkGenerate = (e) => {
    e.preventDefault();
    const lines = csvText.split("\n");
    let addedCount = 0;
    const updatedCerts = [...certificates];
    
    lines.forEach((line, index) => {
      const parts = line.split(",");
      if (parts.length >= 1) {
        const name = parts[0].trim();
        const randId = `ASCET-GEN-2026-${Math.floor(100 + Math.random() * 900)}`;
        updatedCerts.push({
          certId: randId,
          studentName: name,
          eventName: events.find(ev => ev.id.toString() === uploadEventId)?.name || "Audisankara Tech Fest",
          date: new Date().toISOString().split('T')[0],
          grade: parts[2] ? parts[2].trim() : "Participant",
          verified: true
        });
        addedCount++;
      }
    });

    setCertificates(updatedCerts);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div style={styles.appContainer}>
      {/* Top Header */}
      <header style={styles.header}>
        <div style={styles.logoArea} onClick={() => setCurrentView("home")}>
          <div style={styles.logoBadge}>🎓</div>
          <div>
            <h1 style={styles.brandTitle}>CertifyHub</h1>
            <p style={styles.brandSub}>Audisankara College of Engineering & Technology</p>
          </div>
        </div>
        <nav style={styles.navLinks}>
          <button style={currentView === "home" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("home")}>Home</button>
          <button style={currentView === "verify" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("verify")}>Verify Certificate</button>
          <button style={currentView === "participant" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("participant")}>Student Portal</button>
          <button style={currentView === "organizer" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("organizer")}>Organizer Portal</button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        
        {/* VIEW 1: HOME */}
        {currentView === "home" && (
          <div style={styles.heroSection}>
            <div style={styles.heroCard}>
              <span style={styles.badgeLabel}>Official Digital Credential System</span>
              <h2 style={styles.heroTitle}>Streamlined Certificate Generation & Verification</h2>
              <p style={styles.heroDesc}>
                Empowering Audisankara College of Engineering and Technology with instant digital verification, automated batch generation via CSV, and secure role-based portals.
              </p>
              <div style={styles.heroActionGroup}>
                <button style={styles.primaryBtn} onClick={() => setCurrentView("verify")}>Verify a Certificate</button>
                <button style={styles.secondaryBtn} onClick={() => setCurrentView("organizer")}>Organizer Login</button>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>{events.length}</h3>
                <p style={styles.statLabel}>Active Events</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>{certificates.length}+</h3>
                <p style={styles.statLabel}>Certificates Issued</p>
              </div>
              <div style={styles.statCard}>
                <h3 style={styles.statNumber}>100%</h3>
                <p style={styles.statLabel}>Tamper-Proof Verification</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PUBLIC VERIFICATION */}
        {currentView === "verify" && (
          <div style={styles.containerCard}>
            <h2 style={styles.sectionTitle}>🔍 Public Certificate Verification</h2>
            <p style={styles.sectionSub}>Enter the unique Certificate ID to verify its authenticity instantly.</p>
            
            <form onSubmit={handleVerify} style={styles.searchForm}>
              <input 
                type="text" 
                placeholder="e.g. ASCET-CSE-2026-001" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={styles.textInput}
              />
              <button type="submit" style={styles.primaryBtn}>Verify Now</button>
            </form>

            {hasSearched && (
              <div style={verificationResult ? styles.successBox : styles.errorBox}>
                {verificationResult ? (
                  <div>
                    <h3 style={styles.resultHeader}>✅ Valid & Authentic Certificate</h3>
                    <div style={styles.resultGrid}>
                      <p><strong>Certificate ID:</strong> {verificationResult.certId}</p>
                      <p><strong>Recipient Name:</strong> {verificationResult.studentName}</p>
                      <p><strong>Event Name:</strong> {verificationResult.eventName}</p>
                      <p><strong>Date Awarded:</strong> {verificationResult.date}</p>
                      <p><strong>Status / Grade:</strong> {verificationResult.grade}</p>
                      <p><strong>Institution:</strong> Audisankara College of Engineering & Technology</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={styles.resultHeaderError}>❌ Certificate Not Found</h3>
                    <p>No records match the ID "{searchId}". Please check the ID and try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: PARTICIPANT PORTAL */}
        {currentView === "participant" && (
          <div style={styles.containerCard}>
            <h2 style={styles.sectionTitle}>🎓 Student Certificate Portal</h2>
            <p style={styles.sectionSub}>View and download your earned certificates across all college events.</p>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Certificate ID</th>
                    <th style={styles.th}>Recipient</th>
                    <th style={styles.th}>Event</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((cert, idx) => (
                    <tr key={idx} style={styles.tableRow}>
                      <td style={styles.td}><code>{cert.certId}</code></td>
                      <td style={styles.td}><strong>{cert.studentName}</strong></td>
                      <td style={styles.td}>{cert.eventName}</td>
                      <td style={styles.td}>{cert.date}</td>
                      <td style={styles.td}>
                        <button style={styles.actionBtn} onClick={() => alert(`Downloading certificate for ${cert.studentName} (${cert.certId})`)}>
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: ORGANIZER PORTAL */}
        {currentView === "organizer" && (
          <div>
            {!isLoggedIn ? (
              <div style={styles.loginCard}>
                <h2 style={styles.sectionTitle}>🔐 Organizer Login</h2>
                <p style={styles.sectionSub}>Sign in to manage events, upload participant CSVs, and issue certificates.</p>
                
                <form onSubmit={handleLogin} style={styles.loginForm}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Username / Faculty ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. admin_ascet" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={styles.textInput}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={styles.textInput}
                    />
                  </div>
                  <button type="submit" style={styles.primaryBtnFull}>Login to Portal</button>
                </form>
              </div>
            ) : (
              <div style={styles.dashboardContainer}>
                {/* Admin Navigation Tabs */}
                <div style={styles.tabNav}>
                  <button style={activeTab === "dashboard" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("dashboard")}>Dashboard Overview</button>
                  <button style={activeTab === "events" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("events")}>Manage Events</button>
                  <button style={activeTab === "upload" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("upload")}>Bulk CSV Upload</button>
                  <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>

                {/* TAB 1: DASHBOARD OVERVIEW */}
                {activeTab === "dashboard" && (
                  <div>
                    <h3 style={styles.subHeading}>Welcome back, {username}!</h3>
                    <p style={styles.sectionSub}>Here is a quick summary of credential activity at Audisankara College.</p>
                    
                    <div style={styles.statsGrid}>
                      <div style={styles.statCard}>
                        <h4 style={styles.statNumber}>{events.length}</h4>
                        <p style={styles.statLabel}>Total Events Hosted</p>
                      </div>
                      <div style={styles.statCard}>
                        <h4 style={styles.statNumber}>{certificates.length}</h4>
                        <p style={styles.statLabel}>Certificates Generated</p>
                      </div>
                      <div style={styles.statCard}>
                        <h4 style={styles.statNumber}>Active</h4>
                        <p style={styles.statLabel}>System Status</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: MANAGE EVENTS */}
                {activeTab === "events" && (
                  <div>
                    <h3 style={styles.subHeading}>Create & Manage Events</h3>
                    
                    <form onSubmit={handleCreateEvent} style={styles.eventForm}>
                      <div style={styles.formGrid}>
                        <input 
                          type="text" 
                          placeholder="Event Name" 
                          value={newEventName} 
                          onChange={(e) => setNewEventName(e.target.value)} 
                          style={styles.textInput}
                          required
                        />
                        <input 
                          type="date" 
                          value={newEventDate} 
                          onChange={(e) => setNewEventDate(e.target.value)} 
                          style={styles.textInput}
                          required
                        />
                        <input 
                          type="text" 
                          placeholder="Department / Org (e.g. CSE Dept)" 
                          value={newEventOrg} 
                          onChange={(e) => setNewEventOrg(e.target.value)} 
                          style={styles.textInput}
                        />
                        <input 
                          type="text" 
                          placeholder="Venue / Hall" 
                          value={newEventVenue} 
                          onChange={(e) => setNewEventVenue(e.target.value)} 
                          style={styles.textInput}
                        />
                      </div>
                      <button type="submit" style={styles.primaryBtn}>+ Add New Event</button>
                    </form>

                    <h4 style={styles.subHeadingList}>Existing Events List</h4>
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHeaderRow}>
                            <th style={styles.th}>Event Name</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Organizer</th>
                            <th style={styles.th}>Venue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((ev) => (
                            <tr key={ev.id} style={styles.tableRow}>
                              <td style={styles.td}><strong>{ev.name}</strong></td>
                              <td style={styles.td}>{ev.date}</td>
                              <td style={styles.td}>{ev.org}</td>
                              <td style={styles.td}>{ev.venue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: BULK CSV UPLOAD */}
                {activeTab === "upload" && (
                  <div>
                    <h3 style={styles.subHeading}>Bulk Certificate Generation via CSV</h3>
                    <p style={styles.sectionSub}>Upload or paste participant data (Name, Email, Grade) to instantly generate verifiable certificates.</p>

                    <form onSubmit={handleBulkGenerate} style={styles.uploadForm}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Select Target Event</label>
                        <select 
                          value={uploadEventId} 
                          onChange={(e) => setUploadEventId(e.target.value)}
                          style={styles.textInput}
                        >
                          {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name} ({ev.date})</option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>CSV Data Format (Name, Email, Grade)</label>
                        <textarea 
                          rows="5"
                          value={csvText}
                          onChange={(e) => setCsvText(e.target.value)}
                          style={styles.textArea}
                        />
                      </div>

                      <button type="submit" style={styles.primaryBtn}>Generate Bulk Certificates</button>

                      {uploadSuccess && (
                        <div style={styles.successAlert}>
                          🎉 Certificates successfully generated and saved to system records!
                        </div>
                      )}
                    </form>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Audisankara College of Engineering & Technology (ASCET). All Rights Reserved.</p>
      </footer>
    </div>
  );
}

// Styling Constants (Soft floral and pastel theme matching Audisankara project guidelines)
const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    backgroundColor: "#F7F9F6",
    color: "#2C3E35",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#FFFFFF",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #EAE3DC",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  logoArea: {
    display: "flex",
    alignItem: "center",
    gap: "12px",
    cursor: "pointer",
  },
  logoBadge: {
    fontSize: "28px",
    backgroundColor: "#E2ECE9",
    padding: "8px",
    borderRadius: "10px",
  },
  brandTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#3B5347",
  },
  brandSub: {
    margin: 0,
    fontSize: "12px",
    color: "#738A7E",
  },
  navLinks: {
    display: "flex",
    gap: "10px",
  },
  navBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px 14px",
    fontWeight: "600",
    color: "#738A7E",
    cursor: "pointer",
    fontSize: "14px",
    borderRadius: "6px",
  },
  navBtnActive: {
    backgroundColor: "#5B7065",
    color: "white",
    border: "none",
    padding: "8px 14px",
    fontWeight: "600",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  mainContent: {
    flex: 1,
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto",
    padding: "32px 16px",
  },
  heroSection: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    alignItems: "center",
    textAlign: "center",
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    padding: "48px 32px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
    maxWidth: "800px",
  },
  badgeLabel: {
    backgroundColor: "#E2ECE9",
    color: "#3B5347",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "32px",
    margin: "16px 0",
    color: "#2C3E35",
  },
  heroDesc: {
    fontSize: "16px",
    color: "#5A6E63",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  heroActionGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: "#5B7065",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },
  primaryBtnFull: {
    backgroundColor: "#5B7065",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    width: "100%",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#5B7065",
    border: "2px solid #5B7065",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
  },
  statsGrid: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    width: "100%",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
    border: "1px solid #EAE3DC",
    minWidth: "200px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "28px",
    margin: "0 0 8px 0",
    color: "#3B5347",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#738A7E",
  },
  containerCard: {
    backgroundColor: "#FFFFFF",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
  },
  sectionTitle: {
    fontSize: "24px",
    margin: "0 0 8px 0",
    color: "#2C3E35",
  },
  sectionSub: {
    fontSize: "14px",
    color: "#738A7E",
    margin: "0 0 24px 0",
  },
  searchForm: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  textInput: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #D1DBD5",
    fontSize: "14px",
    outline: "none",
  },
  successBox: {
    backgroundColor: "#EAF2EE",
    border: "1px solid #A8C5B5",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "16px",
  },
  errorBox: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #E8B4B4",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "16px",
  },
  resultHeader: {
    color: "#2E5C43",
    margin: "0 0 12px 0",
  },
  resultHeaderError: {
    color: "#8C3A3A",
    margin: "0 0 12px 0",
  },
  resultGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "14px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  },
  tableHeaderRow: {
    backgroundColor: "#F0F5F2",
    borderBottom: "2px solid #EAE3DC",
  },
  th: {
    padding: "12px",
    color: "#3B5347",
    fontWeight: "600",
  },
  tableRow: {
    borderBottom: "1px solid #EAE3DC",
  },
  td: {
    padding: "12px",
    color: "#2C3E35",
  },
  actionBtn: {
    backgroundColor: "#E2ECE9",
    color: "#3B5347",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
  },
  loginCard: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
    maxWidth: "480px",
    margin: "0 auto",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#5A6E63",
  },
  dashboardContainer: {
    backgroundColor: "#FFFFFF",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
  },
  tabNav: {
    display: "flex",
    gap: "8px",
    borderBottom: "2px solid #EAE3DC",
    paddingBottom: "10px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "24px",
  },
  tabBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px 14px",
    fontWeight: "600",
    color: "#8E7D7D",
    cursor: "pointer",
    fontSize: "13px",
  },
  tabBtnActive: {
    backgroundColor: "#5B7065",
    color: "white",
    border: "none",
    padding: "8px 14px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
  },
  logoutBtn: {
    marginLeft: "auto",
    backgroundColor: "#FDF2F2",
    color: "#8C3A3A",
    border: "1px solid #E8B4B4",
    padding: "8px 14px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  subHeading: {
    fontSize: "20px",
    margin: "0 0 6px 0",
    color: "#2C3E35",
  },
  subHeadingList: {
    fontSize: "16px",
    margin: "24px 0 12px 0",
    color: "#2C3E35",
  },
  eventForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  textArea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #D1DBD5",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
  },
  successAlert: {
    backgroundColor: "#EAF2EE",
    color: "#2E5C43",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    padding: "24px",
    fontSize: "13px",
    color: "#738A7E",
    borderTop: "1px solid #EAE3DC",
    backgroundColor: "#FFFFFF",
    marginTop: "auto",
  },
};