import React, { useState } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // State for data
  const [events, setEvents] = useState([
    { id: 1, name: "National Symposium on AI & ML", date: "2026-03-15", org: "Department of CSE (Data Science)", venue: "Auditorium 1" },
    { id: 2, name: "Web Development Hackathon 2026", date: "2026-04-10", org: "Department of IT", venue: "Lab 3" }
  ]);

  const [certificates, setCertificates] = useState([
    { certId: "ASCET-CSE-2026-001", studentName: "Polu Harshitha", email: "harshitha@audisankara.ac.in", eventName: "National Symposium on AI & ML", date: "2026-03-15", org: "Department of CSE (Data Science)", venue: "Auditorium 1", grade: "Outstanding" },
    { certId: "ASCET-IT-2026-042", studentName: "Rahul Sharma", email: "rahul@audisankara.ac.in", eventName: "Web Development Hackathon 2026", date: "2026-04-10", org: "Department of IT", venue: "Lab 3", grade: "Winner" }
  ]);

  // Public Verification State
  const [searchId, setSearchId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Student Portal State
  const [studentEmailSearch, setStudentEmailSearch] = useState("");
  const [studentCerts, setStudentCerts] = useState([]);
  const [searchedStudent, setSearchedStudent] = useState(false);

  // New Event State
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventOrg, setNewEventOrg] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");

  // CSV Upload State
  const [uploadEventId, setUploadEventId] = useState("1");
  const [csvText, setCsvText] = useState("Kiran Kumar, kiran@audisankara.ac.in, Outstanding\nAnanya Reddy, ananya@audisankara.ac.in, Participant");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
      setActiveTab("dashboard");
    } else {
      alert("Please enter valid organizer credentials.");
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const found = certificates.find(c => c.certId.toLowerCase() === searchId.trim().toLowerCase());
    setVerificationResult(found || null);
  };

  const handleStudentSearch = (e) => {
    e.preventDefault();
    setSearchedStudent(true);
    const foundCerts = certificates.filter(c => c.email.toLowerCase() === studentEmailSearch.trim().toLowerCase());
    setStudentCerts(foundCerts);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventName || !newEventDate) return;
    const newEv = {
      id: events.length + 1,
      name: newEventName,
      date: newEventDate,
      org: newEventOrg || "Department of Computer Science",
      venue: newEventVenue || "Main Seminar Hall"
    };
    setEvents([...events, newEv]);
    setNewEventName("");
    setNewEventDate("");
    setNewEventOrg("");
    setNewEventVenue("");
    alert("Event created successfully!");
  };

  const handleBulkGenerate = (e) => {
    e.preventDefault();
    const lines = csvText.split("\n");
    const updatedCerts = [...certificates];
    const selectedEv = events.find(ev => ev.id.toString() === uploadEventId) || events[0];
    
    lines.forEach((line) => {
      const parts = line.split(",");
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const email = parts[1].trim();
        const grade = parts[2] ? parts[2].trim() : "Participant";
        const randId = `ASCET-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
        
        updatedCerts.push({
          certId: randId,
          studentName: name,
          email: email,
          eventName: selectedEv.name,
          date: selectedEv.date,
          org: selectedEv.org,
          venue: selectedEv.venue,
          grade: grade
        });
      }
    });

    setCertificates(updatedCerts);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  // Official Audisankara Certificate PDF Download Template with College Logo Emblem
  const downloadCertificatePDF = (cert) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Poppins:wght@400;500;600;700&display=swap');
            body { margin: 0; padding: 0; background: #fff; font-family: 'Poppins', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
            .cert-card { 
              width: 1050px; height: 740px; padding: 40px 60px; background: #ffffff; 
              border: 8px solid #D4AF37; box-sizing: border-box; position: relative; 
              display: flex; flex-direction: column; justify-content: space-between;
            }
            .border-inner {
              position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; 
              border: 1.5px solid #2C3E50; pointer-events: none;
            }
            .header-top { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #D4AF37; padding-bottom: 12px; }
            .logo-area { display: flex; align-items: center; gap: 14px; }
            
            /* Official College Logo Emblem Replica */
            .college-logo-emblem {
              width: 58px; height: 58px; background: linear-gradient(135deg, #002D62 0%, #C0392B 100%);
              border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center;
              color: white; font-weight: 800; font-family: 'Playfair Display', serif; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
              border: 2px solid #D4AF37;
            }
            .college-logo-emblem span { font-size: 16px; line-height: 1; letter-spacing: 1px; }
            .college-logo-emblem small { font-size: 8px; letter-spacing: 0.5px; opacity: 0.9; margin-top: 2px; }

            .college-title { font-family: 'Playfair Display', serif; font-size: 23px; font-weight: 700; color: #002D62; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
            .college-sub { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-top: 2px; font-weight: 600; }
            
            .cert-body { text-align: center; margin-top: 10px; }
            .cert-title { font-family: 'Playfair Display', serif; font-size: 38px; color: #C0392B; font-weight: 700; letter-spacing: 2px; margin: 10px 0; text-transform: uppercase; }
            .cert-subtitle { font-size: 14px; color: #555; font-style: italic; margin-bottom: 10px; }
            .recipient-name { font-family: 'Playfair Display', serif; font-size: 36px; color: #002D62; font-weight: 700; border-bottom: 2px solid #002D62; display: inline-block; padding: 0 40px 4px 40px; margin: 5px 0; }
            .cert-desc { font-size: 14px; color: #333; line-height: 1.6; max-width: 800px; margin: 10px auto; }
            
            .signatures-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding: 0 20px; }
            .sig-box { text-align: center; width: 220px; border-top: 1px solid #333; padding-top: 6px; }
            .sig-title { font-size: 11px; font-weight: 700; color: #002D62; text-transform: uppercase; }
            .sig-sub { font-size: 9px; color: #666; margin-top: 2px; }
            
            .footer-meta { display: flex; justify-content: space-between; font-size: 10px; color: #777; border-top: 1px solid #eee; padding-top: 8px; align-items: center; }
            @media print { body { background: #fff; } .cert-card { box-shadow: none; width: 100vw; height: 100vh; } }
          </style>
        </head>
        <body onload="window.print()">
          <div class="cert-card">
            <div class="border-inner"></div>
            
            <div class="header-top">
              <div class="logo-area">
                <div class="college-logo-emblem">
                  <span>ASC</span>
                  <small>ET</small>
                </div>
                <div>
                  <div class="college-title">Audisankara College of Engineering & Technology</div>
                  <div class="college-sub">(Deemed to be University) • Nellore, A.P.</div>
                </div>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #002D62; text-align: right;">
                CERTIFICATE OF PARTICIPATION
              </div>
            </div>

            <div class="cert-body">
              <div class="cert-title">Certificate of Participation</div>
              <div class="cert-subtitle">This certificate is proudly presented to</div>
              <div><span class="recipient-name">${cert.studentName}</span></div>
              <div class="cert-desc">
                for active and successful participation with grade/standing <strong>${cert.grade}</strong> in the event 
                <strong>${cert.eventName}</strong> organized by <strong>${cert.org}</strong> 
                on <strong>${cert.date}</strong> at <strong>${cert.venue}</strong>.
              </div>
            </div>

            <div class="signatures-section">
              <div class="sig-box">
                <div class="sig-title">Faculty / Coordinator</div>
                <div class="sig-sub">[ Name & Designation ]</div>
              </div>
              <div class="sig-box">
                <div class="sig-title">Head of Department</div>
                <div class="sig-sub">[ Name & Designation ]</div>
              </div>
              <div class="sig-box">
                <div class="sig-title">Principal / Authority</div>
                <div class="sig-sub">[ Authorized Signatory ]</div>
              </div>
            </div>

            <div class="footer-meta">
              <div>Certificate ID: <strong>${cert.certId}</strong></div>
              <div>Audisankara Digital Credential Verification System</div>
              <div>Issue Date: ${cert.date}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={styles.appContainer}>
      {/* Top Header */}
      <header style={styles.header}>
        <div style={styles.logoArea} onClick={() => setCurrentView("home")}>
          <div style={styles.collegeLogoNav}>
            <span>ASC</span>
          </div>
          <div>
            <h1 style={styles.brandTitle}>Audisankara CertifyHub</h1>
            <p style={styles.brandSub}>College of Engineering & Technology</p>
          </div>
        </div>
        <nav style={styles.navLinks}>
          <button style={currentView === "home" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("home")}>Home</button>
          <button style={currentView === "verify" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("verify")}>Verify Certificate</button>
          <button style={currentView === "participant" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("participant")}>Student Portal</button>
          <button style={currentView === "organizer" ? styles.navBtnActive : styles.navBtn} onClick={() => setCurrentView("organizer")}>Organizer Login</button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        
        {/* HOME VIEW */}
        {currentView === "home" && (
          <div style={styles.heroSection}>
            <div style={styles.heroCard}>
              <span style={styles.badgeLabel}>Official ASCET Credential Ecosystem</span>
              <h2 style={styles.heroTitle}>Audisankara Certificate Management System</h2>
              <p style={styles.heroDesc}>
                Automated batch generation with the official college crest emblem, tamper-proof ID verification, and instant PDF downloads.
              </p>
              <div style={styles.heroActionGroup}>
                <button style={styles.primaryBtn} onClick={() => setCurrentView("verify")}>Verify Certificate ID</button>
                <button style={styles.secondaryBtn} onClick={() => setCurrentView("participant")}>Download My Certificate</button>
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
                <p style={styles.statLabel}>Authentic & Secure</p>
              </div>
            </div>
          </div>
        )}

        {/* VERIFY VIEW */}
        {currentView === "verify" && (
          <div style={styles.containerCard}>
            <h2 style={styles.sectionTitle}>🔍 Public Certificate Verification</h2>
            <p style={styles.sectionSub}>Enter any unique Certificate ID to verify authenticity and preview the official certificate.</p>
            
            <form onSubmit={handleVerify} style={styles.searchForm}>
              <input 
                type="text" 
                placeholder="e.g. ASCET-CSE-2026-001" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                style={styles.textInput}
              />
              <button type="submit" style={styles.primaryBtn}>Verify Authenticity</button>
            </form>

            {hasSearched && (
              <div style={verificationResult ? styles.successBox : styles.errorBox}>
                {verificationResult ? (
                  <div>
                    <h3 style={styles.resultHeader}>✨ Valid & Authentic Certificate</h3>
                    <div style={styles.resultGrid}>
                      <p><strong>Certificate ID:</strong> <code>{verificationResult.certId}</code></p>
                      <p><strong>Recipient Name:</strong> {verificationResult.studentName}</p>
                      <p><strong>Event Name:</strong> {verificationResult.eventName}</p>
                      <p><strong>Department/Org:</strong> {verificationResult.org}</p>
                      <p><strong>Date Awarded:</strong> {verificationResult.date}</p>
                      <p><strong>Achievement:</strong> {verificationResult.grade}</p>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <button style={styles.primaryBtn} onClick={() => downloadCertificatePDF(verificationResult)}>
                        📥 Download Official Template PDF
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={styles.resultHeaderError}>❌ Certificate Not Found</h3>
                    <p>No valid records match ID "{searchId}".</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STUDENT PORTAL */}
        {currentView === "participant" && (
          <div style={styles.containerCard}>
            <h2 style={styles.sectionTitle}>🎓 Student Certificate Portal</h2>
            <p style={styles.sectionSub}>Enter your registered email to download your official certificates.</p>

            <form onSubmit={handleStudentSearch} style={styles.searchForm}>
              <input 
                type="email" 
                placeholder="e.g. harshitha@audisankara.ac.in" 
                value={studentEmailSearch}
                onChange={(e) => setStudentEmailSearch(e.target.value)}
                style={styles.textInput}
                required
              />
              <button type="submit" style={styles.primaryBtn}>Find My Certificates</button>
            </form>

            {searchedStudent && (
              <div style={{ marginTop: "24px" }}>
                {studentCerts.length > 0 ? (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeaderRow}>
                          <th style={styles.th}>Certificate ID</th>
                          <th style={styles.th}>Event</th>
                          <th style={styles.th}>Grade</th>
                          <th style={styles.th}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentCerts.map((cert, idx) => (
                          <tr key={idx} style={styles.tableRow}>
                            <td style={styles.td}><code>{cert.certId}</code></td>
                            <td style={styles.td}><strong>{cert.eventName}</strong></td>
                            <td style={styles.td}>{cert.grade}</td>
                            <td style={styles.td}>
                              <button style={styles.actionBtn} onClick={() => downloadCertificatePDF(cert)}>
                                📥 Download Official PDF
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: "#738A7E", fontStyle: "italic" }}>No certificates found for email "{studentEmailSearch}".</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ORGANIZER PORTAL */}
        {currentView === "organizer" && (
          <div>
            {!isLoggedIn ? (
              <div style={styles.loginCard}>
                <h2 style={styles.sectionTitle}>🔐 Organizer Login</h2>
                <p style={styles.sectionSub}>Sign in to create events and issue batch certificates.</p>
                
                <form onSubmit={handleLogin} style={styles.loginForm}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Username</label>
                    <input 
                      type="text" 
                      placeholder="admin_ascet" 
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
                <div style={styles.tabNav}>
                  <button style={activeTab === "dashboard" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                  <button style={activeTab === "events" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("events")}>Manage Events</button>
                  <button style={activeTab === "upload" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("upload")}>Bulk CSV & Template Gen</button>
                  <button style={activeTab === "issued" ? styles.tabBtnActive : styles.tabBtn} onClick={() => setActiveTab("issued")}>Issued Certificates</button>
                  <button style={styles.logoutBtn} onClick={() => setIsLoggedIn(false)}>Logout</button>
                </div>

                {activeTab === "dashboard" && (
                  <div>
                    <h3 style={styles.subHeading}>Welcome, Organizer!</h3>
                    <p style={styles.sectionSub}>All certificates issued use the official Audisankara College crest template.</p>
                    <div style={styles.statsGrid}>
                      <div style={styles.statCard}>
                        <h4 style={styles.statNumber}>{events.length}</h4>
                        <p style={styles.statLabel}>Total Events</p>
                      </div>
                      <div style={styles.statCard}>
                        <h4 style={styles.statNumber}>{certificates.length}</h4>
                        <p style={styles.statLabel}>Certificates Generated</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "events" && (
                  <div>
                    <h3 style={styles.subHeading}>Create New Event</h3>
                    <form onSubmit={handleCreateEvent} style={styles.eventForm}>
                      <div style={styles.formGrid}>
                        <input type="text" placeholder="Event Name" value={newEventName} onChange={(e) => setNewEventName(e.target.value)} style={styles.textInput} required />
                        <input type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} style={styles.textInput} required />
                        <input type="text" placeholder="Department / Org (e.g. Dept of CSE)" value={newEventOrg} onChange={(e) => setNewEventOrg(e.target.value)} style={styles.textInput} />
                        <input type="text" placeholder="Venue" value={newEventVenue} onChange={(e) => setNewEventVenue(e.target.value)} style={styles.textInput} />
                      </div>
                      <button type="submit" style={styles.primaryBtn}>+ Add Event</button>
                    </form>

                    <h4 style={styles.subHeadingList}>Active Events List</h4>
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

                {activeTab === "upload" && (
                  <div>
                    <h3 style={styles.subHeading}>Batch Certificate Generation</h3>
                    <p style={styles.sectionSub}>Paste participant data in format: <code>Name, Email, Grade/Role</code>. Each will instantly receive the official Audisankara certificate template.</p>
                    <form onSubmit={handleBulkGenerate} style={styles.uploadForm}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Select Event</label>
                        <select value={uploadEventId} onChange={(e) => setUploadEventId(e.target.value)} style={styles.textInput}>
                          {events.map(ev => (<option key={ev.id} value={ev.id}>{ev.name} ({ev.org})</option>))}
                        </select>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Participant CSV Data</label>
                        <textarea rows="5" value={csvText} onChange={(e) => setCsvText(e.target.value)} style={styles.textArea} />
                      </div>
                      <button type="submit" style={styles.primaryBtn}>Generate Certificates with Template</button>
                      {uploadSuccess && <div style={styles.successAlert}>🎉 Certificates successfully generated with unique IDs & official template!</div>}
                    </form>
                  </div>
                )}

                {activeTab === "issued" && (
                  <div>
                    <h3 style={styles.subHeading}>All Issued Certificates</h3>
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHeaderRow}>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Event</th>
                            <th style={styles.th}>Grade</th>
                            <th style={styles.th}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificates.map((cert, idx) => (
                            <tr key={idx} style={styles.tableRow}>
                              <td style={styles.td}><code>{cert.certId}</code></td>
                              <td style={styles.td}>{cert.studentName}</td>
                              <td style={styles.td}>{cert.eventName}</td>
                              <td style={styles.td}>{cert.grade}</td>
                              <td style={styles.td}>
                                <button style={styles.actionBtn} onClick={() => downloadCertificatePDF(cert)}>📥 PDF</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Audisankara College of Engineering & Technology (ASCET) • Official Certificate Generation System</p>
      </footer>
    </div>
  );
}

// Styling Constants (Updated with College Crest Emblems)
const styles = {
  appContainer: {
    fontFamily: "'Poppins', sans-serif",
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  collegeLogoNav: {
    width: "42px",
    height: "42px",
    background: "linear-gradient(135deg, #002D62 0%, #C0392B 100%)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "14px",
    fontFamily: "'Playfair Display', serif",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  brandTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#002D62",
  },
  brandSub: {
    margin: 0,
    fontSize: "11px",
    color: "#738A7E",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
  },
  navBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px 14px",
    fontWeight: "600",
    color: "#738A7E",
    cursor: "pointer",
    fontSize: "13px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
  },
  navBtnActive: {
    backgroundColor: "#002D62",
    color: "white",
    border: "none",
    padding: "8px 14px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    boxShadow: "0 2px 6px rgba(0,45,98,0.3)",
  },
  mainContent: {
    flex: 1,
    maxWidth: "1100px",
    width: "100%",
    margin: "0 auto",
    padding: "36px 16px",
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
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
    maxWidth: "800px",
  },
  badgeLabel: {
    backgroundColor: "#E2ECE9",
    color: "#002D62",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  heroTitle: {
    fontSize: "32px",
    margin: "16px 0",
    color: "#002D62",
    fontFamily: "'Playfair Display', serif",
  },
  heroDesc: {
    fontSize: "15px",
    color: "#5A6E63",
    lineHeight: "1.7",
    marginBottom: "28px",
  },
  heroActionGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  primaryBtn: {
    backgroundColor: "#002D62",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.1s ease, background-color 0.2s",
  },
  primaryBtnFull: {
    backgroundColor: "#002D62",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#002D62",
    border: "2px solid #002D62",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
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
    borderRadius: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    border: "1px solid #EAE3DC",
    minWidth: "200px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "28px",
    margin: "0 0 6px 0",
    color: "#002D62",
  },
  statLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#738A7E",
  },
  containerCard: {
    backgroundColor: "#FFFFFF",
    padding: "36px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
  },
  sectionTitle: {
    fontSize: "24px",
    margin: "0 0 6px 0",
    color: "#002D62",
    fontFamily: "'Playfair Display', serif",
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
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #D1DBD5",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#FAFCFA",
  },
  successBox: {
    backgroundColor: "#EAF2EE",
    border: "1px solid #A8C5B5",
    padding: "24px",
    borderRadius: "12px",
    marginTop: "16px",
  },
  errorBox: {
    backgroundColor: "#FDF2F2",
    border: "1px solid #E8B4B4",
    padding: "24px",
    borderRadius: "12px",
    marginTop: "16px",
  },
  resultHeader: {
    color: "#2E5C43",
    margin: "0 0 14px 0",
  },
  resultHeaderError: {
    color: "#8C3A3A",
    margin: "0 0 10px 0",
  },
  resultGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "14px",
    color: "#3B5347",
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
    padding: "14px",
    color: "#002D62",
    fontWeight: "600",
  },
  tableRow: {
    borderBottom: "1px solid #EAE3DC",
  },
  td: {
    padding: "14px",
    color: "#2C3E35",
  },
  actionBtn: {
    backgroundColor: "#E2ECE9",
    color: "#002D62",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
  },
  loginCard: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
    maxWidth: "460px",
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
    padding: "36px",
    borderRadius: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
    border: "1px solid #EAE3DC",
  },
  tabNav: {
    display: "flex",
    gap: "8px",
    borderBottom: "2px solid #EAE3DC",
    paddingBottom: "12px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "28px",
  },
  tabBtn: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px 16px",
    fontWeight: "600",
    color: "#738A7E",
    cursor: "pointer",
    fontSize: "13px",
    borderRadius: "8px",
  },
  tabBtnActive: {
    backgroundColor: "#002D62",
    color: "white",
    border: "none",
    padding: "8px 16px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
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
    color: "#002D62",
    fontFamily: "'Playfair Display', serif",
  },
  subHeadingList: {
    fontSize: "16px",
    margin: "28px 0 12px 0",
    color: "#002D62",
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
    gap: "14px",
  },
  uploadForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  textArea: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #D1DBD5",
    fontSize: "13px",
    fontFamily: "monospace",
    outline: "none",
    backgroundColor: "#FAFCFA",
  },
  successAlert: {
    backgroundColor: "#EAF2EE",
    color: "#2E5C43",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "13px",
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