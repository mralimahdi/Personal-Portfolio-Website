// ─── DEFAULT CV TEMPLATE DATA ───
const DEFAULT_CV = {
  photo: '',
  name: 'Syed Ali Mahdi Jaffri',
  subtitle: 'AI Engineer | BSCS Final Year',
  profile: 'Final year BSCS student passionate about AI/ML. Self-taught graphic designer with real international freelance experience. I build things that look good and work well.',
  contact: {
    email: 'mr.syedalimahdi1234@gmail.com',
    phone: '+92-336-5519188',
    location: 'Islamabad, Capital'
  },
  links: [
    { label: 'GitHub', url: 'https://github.com/mralimahdi' },
    { label: 'Behance', url: 'https://www.behance.net/mindlinestudio' }
  ],
  technicalSkills: [
    { name: 'Python', pct: 85 },
    { name: 'Machine Learning', pct: 75 },
    { name: 'FastAPI / Streamlit', pct: 70 },
    { name: 'Git / GitHub', pct: 80 },
    { name: 'SQL', pct: 60 },
  ],
  creativeSkills: [
    { name: 'Adobe Illustrator', pct: 85 },
    { name: 'Photoshop', pct: 80 },
    { name: 'Premiere Pro', pct: 50 },
    { name: 'After Effects', pct: 40 },
  ],
  languages: [
    { name: 'Urdu', level: 'Native' },
    { name: 'English', level: 'Professional' },
  ],
  introduction: 'Self-driven BSCS graduate with a rare mix of AI/ML engineering and creative design. Delivered real work for international clients. Seeking an internship where I can contribute and grow fast.',
  qualifications: [
    { years: '2023–2027', title: 'BS Computer Science', institution: 'ARID Agriculture University, UIIT, Rawalpindi', grade: '' },
    { years: '2020–2022', title: 'ICS', institution: 'Central Degree College, Multan', grade: '' },
    { years: '2017–2019', title: 'Matric (Science)', institution: 'Everest Junior High School, Karachi', grade: '' },
  ],
  projects: [
    { title: 'Portfolio Website', tags: 'HTML · CSS · Javascript · Canvas', desc: 'A stunning, high-performance developer portfolio featuring custom mathematics particle background networks, responsive 3D glassmorphic sections, and scroll-bound animations.' },
    { title: 'AI Assistant Dashboard', tags: 'Python · FastAPI · OpenAI API · Streamlit', desc: 'A live dashboard interface managing asynchronous subagents that autonomously draft reports and research specific online documentation paths.' },
  ],
  workExperience: [
    {
      title: 'Freelance Graphic Designer',
      meta: 'Self-Employed · International Clients',
      bullets: ['Delivered branding, social media, and motion design for international clients.', 'Self-taught via YouTube — Illustrator, Photoshop, Premiere Pro, After Effects.', 'Managed full client communication and project delivery independently.']
    }
  ],
  certifications: [
    { name: 'Neural Networks & Deep Learning', issuer: 'Coursera · 2025' }
  ],
};

// ─── STATE MANAGEMENT ───
let cvData = {};
let currentSection = 'header';
let toastTimeout = null;

// Initialize CV Creator App
window.addEventListener('DOMContentLoaded', () => {
  // Load data from LocalStorage or use default template
  const savedData = localStorage.getItem('cvCreator_data');
  if (savedData) {
    try {
      cvData = JSON.parse(savedData);
    } catch (e) {
      console.warn("Failed to load saved CV data, restoring defaults.", e);
      cvData = JSON.parse(JSON.stringify(DEFAULT_CV));
    }
  } else {
    cvData = JSON.parse(JSON.stringify(DEFAULT_CV));
  }

  // Bind Dynamic Functions
  initDashboard();
  initCustomCursor();
  initParticlesBackground();
});

function initDashboard() {
  buildSectionNav();
  selectSection('header');
  renderCV();
}

// Save data to LocalStorage and trigger a subtle visual confirmation toast
function autoSaveData() {
  localStorage.setItem('cvCreator_data', JSON.stringify(cvData));
  
  // Show save toast
  const toast = document.getElementById('save-toast');
  if (toast) {
    toast.style.display = 'block';
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }
}

// Reset template back to defaults
function resetToDefault() {
  if (confirm("Are you sure you want to discard your edits and restore the default template? This cannot be undone.")) {
    cvData = JSON.parse(JSON.stringify(DEFAULT_CV));
    autoSaveData();
    initDashboard();
  }
}

// ─── SECTION SELECTOR & FORMS RENDERING ───
const sections = [
  { id: 'header', label: 'Header & Photo', badge: '' },
  { id: 'profile', label: 'Profile & Contact', badge: '' },
  { id: 'techSkills', label: 'Technical Skills', badge: () => cvData.technicalSkills.length },
  { id: 'creativeSkills', label: 'Creative Skills', badge: () => cvData.creativeSkills.length },
  { id: 'languages', label: 'Languages', badge: () => cvData.languages.length },
  { id: 'links', label: 'Links', badge: () => cvData.links.length },
  { id: 'intro', label: 'Introduction', badge: '' },
  { id: 'qualifications', label: 'Qualifications', badge: () => cvData.qualifications.length },
  { id: 'projects', label: 'Projects', badge: () => cvData.projects.length },
  { id: 'workExp', label: 'Work Experience', badge: () => cvData.workExperience.length },
  { id: 'certs', label: 'Certifications', badge: () => cvData.certifications.length },
];

function buildSectionNav() {
  const nav = document.getElementById('section-nav');
  if (!nav) return;
  nav.innerHTML = sections.map(s => `
    <button class="snav-item" id="snav-${s.id}" onclick="selectSection('${s.id}')">
      <span class="snav-dot"></span>
      <span class="snav-label">${s.label}</span>
      <span class="snav-badge" id="badge-${s.id}">${typeof s.badge === 'function' ? s.badge() : s.badge}</span>
    </button>
  `).join('');
}

function refreshBadges() {
  sections.forEach(s => {
    const el = document.getElementById('badge-' + s.id);
    if (el) el.textContent = typeof s.badge === 'function' ? s.badge() : s.badge;
  });
}

function selectSection(id) {
  currentSection = id;
  document.querySelectorAll('.snav-item').forEach(i => i.classList.remove('active'));
  const item = document.getElementById('snav-' + id);
  if (item) item.classList.add('active');
  renderEditorPanel(id);
}

// Render dynamic forms in sidebar
function renderEditorPanel(id) {
  const c = document.getElementById('editor-content');
  if (!c) return;
  let html = '';
  
  if (id === 'header') html = panelHeader();
  else if (id === 'profile') html = panelProfile();
  else if (id === 'techSkills') html = panelSkills('technicalSkills', 'Technical Skills');
  else if (id === 'creativeSkills') html = panelSkills('creativeSkills', 'Creative Skills');
  else if (id === 'languages') html = panelLanguages();
  else if (id === 'links') html = panelLinks();
  else if (id === 'intro') html = panelIntro();
  else if (id === 'qualifications') html = panelQuals();
  else if (id === 'projects') html = panelProjects();
  else if (id === 'workExp') html = panelWork();
  else if (id === 'certs') html = panelCerts();
  
  c.innerHTML = html;
  
  // Bind events for custom dynamic inputs
  const fi = document.getElementById('photo-file');
  if (fi) fi.addEventListener('change', handlePhotoUpload);

  document.querySelectorAll('.skill-range').forEach(r => {
    r.addEventListener('input', e => {
      const pctEl = e.target.parentElement.querySelector('.skill-pct');
      const lblEl = e.target.parentElement.querySelector('.skill-level-label');
      const v = parseInt(e.target.value);
      if (pctEl) pctEl.textContent = v + '%';
      if (lblEl) {
        lblEl.textContent = skillLevel(v);
        lblEl.className = 'skill-level-label ' + skillLevelClass(v);
      }
    });
  });
}

// ─── EDITOR PANEL HTML BUILDERS ───
function skillLevel(v) { return v >= 80 ? 'Expert' : v >= 60 ? 'Proficient' : v >= 40 ? 'Intermediate' : 'Beginner' }
function skillLevelClass(v) { return v >= 80 ? 'level-high' : v >= 60 ? 'level-mid' : 'level-low' }

function panelHeader() {
  return `<div class="editor-panel">
    <h4>Header & Photo</h4>
    <div class="field-group">
      <label>Profile Photo</label>
      <div class="img-upload-area" onclick="document.getElementById('photo-file').click()">
        ${cvData.photo ? `<img src="${cvData.photo}" class="img-preview" alt="photo">` : '<div style="font-size:2.2rem;margin-bottom:8px">📷</div>'}
        <p>${cvData.photo ? 'Click to change photo' : 'Click to upload photo'}</p>
        <input type="file" id="photo-file" accept="image/*">
      </div>
    </div>
    <div class="field-group">
      <label>Full Name</label>
      <input type="text" value="${cvData.name}" oninput="cvData.name=this.value;renderCV();autoSaveData()">
    </div>
    <div class="field-group">
      <label>Subtitle / Domain Roles</label>
      <input type="text" value="${cvData.subtitle}" placeholder="e.g. AI Engineer | UI Designer" oninput="cvData.subtitle=this.value;renderCV();autoSaveData()">
    </div>
  </div>`;
}

function panelProfile() {
  const c = cvData.contact;
  return `<div class="editor-panel">
    <h4>Profile</h4>
    <div class="field-group">
      <label>Profile Summary</label>
      <textarea oninput="cvData.profile=this.value;renderCV();autoSaveData()">${cvData.profile}</textarea>
    </div>
    <h4 style="margin-top:28px">Contact</h4>
    <div class="field-group">
      <label>Email</label>
      <input type="email" value="${c.email}" oninput="cvData.contact.email=this.value;renderCV();autoSaveData()">
    </div>
    <div class="field-group">
      <label>Phone</label>
      <input type="text" value="${c.phone}" oninput="cvData.contact.phone=this.value;renderCV();autoSaveData()">
    </div>
    <div class="field-group">
      <label>Location</label>
      <input type="text" value="${c.location}" oninput="cvData.contact.location=this.value;renderCV();autoSaveData()">
    </div>
  </div>`;
}

function panelSkills(key, title) {
  const skills = cvData[key];
  const items = skills.map((s, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('${key}',${i})">×</button>
      <div class="field-group">
        <label>Skill Name</label>
        <input type="text" value="${s.name}" oninput="cvData['${key}'][${i}].name=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Proficiency — <span class="skill-level-label ${skillLevelClass(s.pct)}">${skillLevel(s.pct)}</span></label>
        <div class="skill-range-wrap">
          <input type="range" class="skill-range" min="10" max="100" value="${s.pct}" 
            oninput="cvData['${key}'][${i}].pct=parseInt(this.value);renderCV();autoSaveData()">
          <span class="skill-pct">${s.pct}%</span>
        </div>
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>${title}</h4>
    ${items}
    <button class="btn-add" onclick="addSkill('${key}')">+ Add Skill</button>
  </div>`;
}

function panelLanguages() {
  const items = cvData.languages.map((l, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('languages',${i})">×</button>
      <div class="field-group">
        <label>Language</label>
        <input type="text" value="${l.name}" oninput="cvData.languages[${i}].name=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Level</label>
        <input type="text" value="${l.level}" placeholder="e.g. Native, Professional, Intermediate"
          oninput="cvData.languages[${i}].level=this.value;renderCV();autoSaveData()">
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>Languages</h4>
    ${items}
    <button class="btn-add" onclick="cvData.languages.push({name:'New Language',level:'Professional'});refreshBadges();selectSection('languages');autoSaveData()">+ Add Language</button>
  </div>`;
}

function panelLinks() {
  const items = cvData.links.map((l, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('links',${i})">×</button>
      <div class="field-group">
        <label>Platform Label</label>
        <input type="text" value="${l.label}" oninput="cvData.links[${i}].label=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>URL</label>
        <input type="text" value="${l.url}" oninput="cvData.links[${i}].url=this.value;renderCV();autoSaveData()">
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>Links</h4>
    ${items}
    <button class="btn-add" onclick="cvData.links.push({label:'LinkedIn',url:'https://'});refreshBadges();selectSection('links');autoSaveData()">+ Add Link</button>
  </div>`;
}

function panelIntro() {
  return `<div class="editor-panel">
    <h4>Introduction</h4>
    <div class="field-group">
      <label>Introduction / Cover Note</label>
      <textarea style="min-height:140px" oninput="cvData.introduction=this.value;renderCV();autoSaveData()">${cvData.introduction}</textarea>
    </div>
  </div>`;
}

function panelQuals() {
  const items = cvData.qualifications.map((q, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('qualifications',${i})">×</button>
      <div class="field-group">
        <label>Years</label>
        <input type="text" value="${q.years}" placeholder="e.g. 2023–2027" oninput="cvData.qualifications[${i}].years=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Degree / Certificate</label>
        <input type="text" value="${q.title}" oninput="cvData.qualifications[${i}].title=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Institution</label>
        <input type="text" value="${q.institution}" oninput="cvData.qualifications[${i}].institution=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Grade / CGPA (Optional)</label>
        <input type="text" value="${q.grade || ''}" placeholder="e.g. 3.8 CGPA" oninput="cvData.qualifications[${i}].grade=this.value;renderCV();autoSaveData()">
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>Qualifications / Education</h4>
    ${items}
    <button class="btn-add" onclick="cvData.qualifications.push({years:'2025–2027',title:'Degree Title',institution:'Institution Name',grade:''});refreshBadges();selectSection('qualifications');autoSaveData()">+ Add Degree</button>
  </div>`;
}

function panelProjects() {
  const items = cvData.projects.map((p, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('projects',${i})">×</button>
      <div class="field-group">
        <label>Project Title</label>
        <input type="text" value="${p.title}" oninput="cvData.projects[${i}].title=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Tech Tags</label>
        <input type="text" value="${p.tags}" placeholder="Python · Machine Learning · Streamlit" oninput="cvData.projects[${i}].tags=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Description</label>
        <textarea oninput="cvData.projects[${i}].desc=this.value;renderCV();autoSaveData()">${p.desc}</textarea>
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>Projects</h4>
    ${items}
    <button class="btn-add" onclick="cvData.projects.push({title:'New Project',tags:'',desc:''});refreshBadges();selectSection('projects');autoSaveData()">+ Add Project</button>
  </div>`;
}

function panelWork() {
  const items = cvData.workExperience.map((w, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('workExperience',${i})">×</button>
      <div class="field-group">
        <label>Job Title / Role</label>
        <input type="text" value="${w.title}" oninput="cvData.workExperience[${i}].title=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Company / Meta Details</label>
        <input type="text" value="${w.meta}" oninput="cvData.workExperience[${i}].meta=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Bullet Responsibilities (One per line)</label>
        <textarea oninput="cvData.workExperience[${i}].bullets=this.value.split('\\n').filter(l=>l.trim());renderCV();autoSaveData()">${w.bullets.join('\n')}</textarea>
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>Work Experience</h4>
    ${items}
    <button class="btn-add" onclick="cvData.workExperience.push({title:'New Role',meta:'Company Name',bullets:['Responsibility detail.']});refreshBadges();selectSection('workExp');autoSaveData()">+ Add Experience</button>
  </div>`;
}

function panelCerts() {
  const items = cvData.certifications.map((cert, i) => `
    <div class="repeatable-item">
      <button class="rep-remove" onclick="removeItem('certifications',${i})">×</button>
      <div class="field-group">
        <label>Certificate Name</label>
        <input type="text" value="${cert.name}" oninput="cvData.certifications[${i}].name=this.value;renderCV();autoSaveData()">
      </div>
      <div class="field-group">
        <label>Issuer & Year</label>
        <input type="text" value="${cert.issuer || ''}" placeholder="e.g. Coursera · 2025" oninput="cvData.certifications[${i}].issuer=this.value;renderCV();autoSaveData()">
      </div>
    </div>
  `).join('');
  return `<div class="editor-panel">
    <h4>Certifications</h4>
    ${cvData.certifications.length === 0 ? '<p style="color:var(--muted);font-size:.82rem;margin-bottom:16px">No certifications added yet.</p>' : ''}
    ${items}
    <button class="btn-add" onclick="cvData.certifications.push({name:'Certification Title',issuer:'Issuer · 2025'});refreshBadges();selectSection('certs');autoSaveData()">+ Add Certification</button>
  </div>`;
}

// ─── LISTS & DATA ITEMS DISPOSAL ───
function removeItem(key, idx) {
  cvData[key].splice(idx, 1);
  refreshBadges();
  renderCV();
  selectSection(currentSection);
  autoSaveData();
}

function addSkill(key) {
  cvData[key].push({ name: 'New Skill', pct: 60 });
  refreshBadges();
  renderCV();
  selectSection(key === 'technicalSkills' ? 'techSkills' : 'creativeSkills');
  autoSaveData();
}

// Handle local photos uploading
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    cvData.photo = ev.target.result;
    renderCV();
    selectSection('header');
    autoSaveData();
  };
  reader.readAsDataURL(file);
}

// ─── RENDER PRINTABLE CV FORMAT ───
function renderCV() {
  const d = cvData;
  const el = document.getElementById('cv-render');
  if (!el) return;

  const techSkillsHTML = d.technicalSkills.map(s => `
    <div class="skill-item">
      <span class="skill-name">${s.name}</span>
      <div class="skill-bar-wrap">
        <div class="skill-bar"><div class="skill-fill" data-pct="${s.pct}" style="width:0%"></div></div>
        <span class="skill-pct-badge">${s.pct}%</span>
      </div>
    </div>`).join('');

  const creativeSkillsHTML = d.creativeSkills.map(s => `
    <div class="skill-item">
      <span class="skill-name">${s.name}</span>
      <div class="skill-bar-wrap">
        <div class="skill-bar"><div class="skill-fill" data-pct="${s.pct}" style="width:0%"></div></div>
        <span class="skill-pct-badge">${s.pct}%</span>
      </div>
    </div>`).join('');

  const qualsHTML = d.qualifications.map(q => `
    <div class="qual-item">
      <div class="qual-years">${q.years}</div>
      <div>
        <div class="qual-title">${q.title}</div>
        <div class="qual-inst">${q.institution}</div>
        ${q.grade ? `<div class="qual-grade">${q.grade}</div>` : ''}
      </div>
    </div>`).join('');

  const projectsHTML = d.projects.map((p, i) => `
    <div class="project-item">
      <div class="project-header">
        <span class="project-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="project-title">${p.title}</span>
      </div>
      <div class="project-tags">${p.tags}</div>
      <div class="project-desc">${p.desc}</div>
    </div>`).join('');

  const workHTML = d.workExperience.map(w => `
    <div class="work-entry">
      <div class="work-title">${w.title}</div>
      <div class="work-meta">${w.meta}</div>
      <ul class="work-bullets">${w.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>`).join('');

  const langsHTML = d.languages.length ? `
    <div class="sidebar-section">
      <h3>Languages</h3>
      ${d.languages.map(l => `<div class="lang-item"><span class="lang-name">${l.name}</span><span class="lang-level">${l.level}</span></div>`).join('')}
    </div>`: '';

  const certsHTML = d.certifications.length ? `
    <div class="main-section">
      <h2>Certifications</h2>
      ${d.certifications.map(c => `
        <div class="cert-item">
          <div class="cert-dot"></div>
          <div><div class="cert-name">${c.name}</div><div class="cert-issuer">${c.issuer || ''}</div></div>
        </div>`).join('')}
    </div>`: '';

  const linksLabel = d.links.map(l => l.label).join(' | ') || 'Links';
  const linksHTML = d.links.map(l => `<a class="link-item" href="${l.url}" target="_blank">${l.url.replace(/^https?:\/\//, '')}</a>`).join('');

  el.innerHTML = `
    <div class="cv-header">
      <div class="avatar-wrap">
        ${d.photo ? `<img src="${d.photo}" alt="Profile">` : `<div style="width:100%;height:100%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:2rem">👤</div>`}
      </div>
      <h1>${d.name}</h1>
      <div class="subtitle">${d.subtitle.split('|').map(s => s.trim()).join('<span class="sep">|</span>')}</div>
    </div>
    <div class="cv-body">
      <aside class="cv-sidebar">
        <div class="sidebar-section">
          <h3>Profile</h3>
          <p>${d.profile}</p>
        </div>
        ${d.technicalSkills.length ? `
        <div class="sidebar-section">
          <h3>Technical Skills</h3>
          ${techSkillsHTML}
        </div>`: ''}
        ${d.creativeSkills.length ? `
        <div class="sidebar-section">
          <h3>Creative Skills</h3>
          ${creativeSkillsHTML}
        </div>`: ''}
        ${langsHTML}
        <div class="sidebar-section">
          <h3>Contact</h3>
          <div class="contact-item">
            <div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div>
            ${d.contact.email}
          </div>
          <div class="contact-item">
            <div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg></div>
            ${d.contact.phone}
          </div>
          <div class="contact-item">
            <div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div>
            ${d.contact.location}
          </div>
        </div>
        ${d.links.length ? `
        <div class="sidebar-section">
          <h3>${linksLabel}</h3>
          ${linksHTML}
        </div>`: ''}
      </aside>
      <main class="cv-main">
        <div class="main-section">
          <h2>Introduction</h2>
          <p>${d.introduction}</p>
        </div>
        ${d.qualifications.length ? `
        <div class="main-section">
          <h2>Qualifications</h2>
          ${qualsHTML}
        </div>`: ''}
        ${d.projects.length ? `
        <div class="main-section">
          <h2>Projects</h2>
          ${projectsHTML}
        </div>`: ''}
        ${d.workExperience.length ? `
        <div class="main-section">
          <h2>Work Experience</h2>
          ${workHTML}
        </div>`: ''}
        ${certsHTML}
      </main>
    </div>
  `;
  animateSkillBars();
  scaleCV();
}

// ─── SKILL BAR ANIMATION CONTROLS ───
function animateSkillBars() {
  setTimeout(() => {
    document.querySelectorAll('.skill-fill[data-pct]').forEach((el, i) => {
      setTimeout(() => {
        el.style.width = el.dataset.pct + '%';
      }, i * 80);
    });
  }, 100);
}

// ─── SCALE CV ACCORDING TO VIEWPORT ───
function scaleCV() {
  const wrap = document.getElementById('cv-preview-wrap');
  if (!wrap) return;
  const cv = document.getElementById('cv-render');
  if (!cv) return;
  const ww = wrap.clientWidth - 80;
  if (ww < 820 && ww > 0) {
    const scale = ww / 820;
    cv.style.transform = `scale(${scale})`;
    cv.style.marginBottom = `-${(1100 * (1 - scale))}px`;
  } else {
    cv.style.transform = 'none';
    cv.style.marginBottom = '0';
  }
}
window.addEventListener('resize', scaleCV);

// ─── VIEW VIEWPORTS SWITCHER ───
function switchView(view, btn) {
  document.querySelectorAll('.btn-control-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const body = document.body;
  body.classList.remove('view-editor', 'view-preview');
  
  if (view === 'editor') {
    body.classList.add('view-editor');
  } else if (view === 'preview') {
    body.classList.add('view-preview');
    // Force scale recalculation on render
    setTimeout(scaleCV, 100);
  } else {
    // Split View
    setTimeout(scaleCV, 100);
  }
}

// ─── PDF DOWNLOAD — Print Window Method ───
// Uses the browser's native print-to-PDF pipeline:
//   ✅ No right-side white strip (browser lays out at exact 210mm / 820px)
//   ✅ Clickable hyperlinks preserved in the PDF
//   ✅ Selectable / searchable text (not a flat image)
//   ✅ All colors forced via print-color-adjust
//   ✅ Page height follows content automatically — no fixed A4 cutoff
function downloadPDF() {
  const btn = document.querySelector('.btn-download');
  if (btn) {
    btn.innerHTML = '⏳ Preparing…';
    btn.disabled = true;
  }

  // Force all skill bars to their target width before capture
  document.querySelectorAll('.skill-fill[data-pct]').forEach(el => {
    el.style.width = el.dataset.pct + '%';
    el.style.transition = 'none';
  });

  const cvEl = document.getElementById('cv-render');
  if (!cvEl) {
    resetDownloadBtn(btn);
    return;
  }

  // Collect all CSS from the parent page's stylesheets
  const styles = Array.from(document.styleSheets).map(sheet => {
    try {
      return Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
    } catch (e) {
      // Cross-origin sheet — import it by URL instead
      return sheet.href ? `@import url("${sheet.href}");` : '';
    }
  }).join('\n');

  // Clone just the CV element's HTML
  const cvHTML = cvEl.outerHTML;

  // Open a blank print window
  const printWindow = window.open('', '_blank', 'width=900,height=700');

  // Popup was blocked
  if (!printWindow) {
    alert('Please allow popups for this site so your CV can be downloaded.\nThen click Download PDF again.');
    resetDownloadBtn(btn);
    renderCV();
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CV_${cvData.name.replace(/\s+/g, '_')}</title>
  <style>
    /* ── Page setup: A4 width, height auto-follows content ── */
    @page {
      size: 210mm auto;
      margin: 0;
    }

    /* ── Force all colors to print exactly as on screen ── */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 820px;
      background: #ffffff;
      overflow-x: hidden;
    }

    /* ── Paste every CSS rule from the main page ── */
    ${styles}

    /* ── Override screen-only scaling transforms ── */
    #cv-render {
      transform: none !important;
      margin: 0 !important;
      width: 820px !important;
      max-width: 820px !important;
      min-width: 820px !important;
      box-shadow: none !important;
      overflow: hidden !important;
    }

    /* ── Make links visible and clickable ── */
    a {
      color: inherit !important;
      text-decoration: underline !important;
    }

    /* ── Hide any UI chrome that isn't the CV itself ── */
    .btn-download,
    .snav-item,
    #particles,
    #cur,
    #cur-ring,
    .editor-panel,
    .toolbar,
    .sidebar {
      display: none !important;
    }
  </style>
</head>
<body>
  ${cvHTML}
  <script>
    // Wait for fonts and images to load, then open the print dialog
    window.addEventListener('load', function () {
      // Immediately set all skill bars to their data-pct width
      document.querySelectorAll('.skill-fill[data-pct]').forEach(function(el) {
        el.style.width = el.dataset.pct + '%';
        el.style.transition = 'none';
      });
      setTimeout(function () {
        window.print();
        window.close();
      }, 700);
    });
  <\/script>
</body>
</html>`);

  printWindow.document.close();

  // Reset the button immediately — print dialog handles the rest
  resetDownloadBtn(btn);
  renderCV(); // restore smooth transitions on the main page
}

// ─── RESET DOWNLOAD BUTTON STATE ───
function resetDownloadBtn(btn) {
  if (!btn) return;
  btn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.84v4h5.66V9h3.84L12 2z" />
    </svg>
    Download PDF
  `;
  btn.disabled = false;
}

// ─── INTERACTIVE CUSTOM CURSOR MAPPING ───
function initCustomCursor() {
  const cur = document.getElementById('cur');
  const ring = document.getElementById('cur-ring');
  
  window.addEventListener('mousemove', e => {
    if (cur) {
      cur.style.left = e.clientX + 'px';
      cur.style.top = e.clientY + 'px';
    }
    if (ring) {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    }
  });
  
  // Hide custom cursor elements if client mouse moves outside of viewport bounds
  document.addEventListener('mouseleave', () => {
    if (cur) cur.style.opacity = '0';
    if (ring) ring.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    if (cur) cur.style.opacity = '1';
    if (ring) ring.style.opacity = '1';
  });

  // Fade out custom cursor nodes when mouse sweeps over editor inputs or range sliders
  document.addEventListener('mouseover', e => {
    if (!cur || !ring) return;
    
    const isInput = e.target.tagName === 'INPUT' || 
                    e.target.tagName === 'TEXTAREA' || 
                    e.target.tagName === 'SELECT' || 
                    e.target.closest('.field-group') || 
                    e.target.closest('.repeatable-item');
                    
    if (isInput) {
      cur.style.opacity = '0';
      ring.style.opacity = '0';
    } else {
      cur.style.opacity = '1';
      ring.style.opacity = '1';
    }
  });
}


// ─── NEURAL PARTICLES NETWORK BACKGROUND ───
function initParticlesBackground() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let pts = [];
  const count = 75;
  const connectionDistance = 110;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Initialize random particle nodes
  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      o: Math.random() * 0.45 + 0.15
    });
  }

  // Mouse interactivity tracking inside the Canvas workspace
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw lines between proximate particles
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(126, 184, 255, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      
      // Connect particles to mouse cursor when close
      const mDist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (mDist < connectionDistance * 1.3) {
        const alpha = (1 - mDist / (connectionDistance * 1.3)) * 0.28;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(126, 184, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // Draw individual nodes and apply vector speed changes
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap vectors at viewport boundaries
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(126, 184, 255, ${p.o})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  
  draw();
}
