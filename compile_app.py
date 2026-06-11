import os
import re

proj_dir = r"d:\DOWNLOAD\cookwithalchemist4real"
src_dir = os.path.join(proj_dir, "src")
ch1_path = os.path.join(src_dir, "ch1_structure.html")
ch2_path = os.path.join(src_dir, "ch2_transmutation.html")
ch3_path = os.path.join(src_dir, "ch3_ascension.html")
legacy_path = os.path.join(src_dir, "legacy_transcript.html")
warranty_path = os.path.join(src_dir, "warranty_check.html")

output_path = os.path.join(proj_dir, "index.html")

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

# Read all source contents
ch1_raw = read_file(ch1_path)
ch2_raw = read_file(ch2_path)
ch3_raw = read_file(ch3_path)
legacy_raw = read_file(legacy_path)
warranty_raw = read_file(warranty_path)

def extract_body_content(html_content):
    # Match everything inside <body> except <nav> and <footer>
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL | re.IGNORECASE)
    if not body_match:
        return ""
    content = body_match.group(1)
    # Strip scripts from HTML (we will handle them separately)
    content_no_script = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
    # Strip nav and footer tags if present
    content_clean = re.sub(r'<nav[^>]*>.*?</nav>', '', content_no_script, flags=re.DOTALL | re.IGNORECASE)
    content_clean = re.sub(r'<footer[^>]*>.*?</footer>', '', content_clean, flags=re.DOTALL | re.IGNORECASE)
    return content_clean.strip()

def extract_script_content(html_content):
    # Match the last script tag content (where the logic resides)
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html_content, re.DOTALL | re.IGNORECASE)
    # Find the one that does not load a src (contains raw JS)
    for script in reversed(scripts):
        if 'src=' not in script:
            return script.strip()
    return ""

def extract_style_content(html_content):
    styles = re.findall(r'<style[^>]*>(.*?)</style>', html_content, re.DOTALL | re.IGNORECASE)
    return "\n".join(styles).strip()

# Extract segments
ch1_html = extract_body_content(ch1_raw)
ch2_html = extract_body_content(ch2_raw)
ch3_html = extract_body_content(ch3_raw)
legacy_html = extract_body_content(legacy_raw)
warranty_html = extract_body_content(warranty_raw)

ch1_js = extract_script_content(ch1_raw)
ch2_js = extract_script_content(ch2_raw)
ch3_js = extract_script_content(ch3_raw)
legacy_js = extract_script_content(legacy_raw)
warranty_js = extract_script_content(warranty_raw)

# Clean and extract main container only
ch1_html = f'<div id="ch1-view" class="tab-view active-view">{ch1_html}</div>'
ch2_html = f'<div id="ch2-view" class="tab-view hidden-view">{ch2_html}</div>'
ch3_html = f'<div id="ch3-view" class="tab-view hidden-view">{ch3_html}</div>'
legacy_html = f'<div id="legacy-view" class="tab-view hidden-view">{legacy_html}</div>'
warranty_html = f'<div id="warranty-view" class="tab-view hidden-view">{warranty_html}</div>'

# Perform replacements on individual namespaces to avoid ID/variable conflicts
def apply_replacements(html_text, js_text, prefix):
    # Replace common ID names
    ids_to_replace = [
        "pretest-section", "posttest-section", "materi-section", "result-section",
        "question-text", "options-container", "progress-bar", "progress-text",
        "quiz-container", "pre-score-display", "post-score-display", "badge-status",
        "key-display", "gate-section", "gate-error", "user-name"
    ]
    
    for id_name in ids_to_replace:
        # Replace in HTML
        html_text = html_text.replace(f'id="{id_name}"', f'id="{prefix}-{id_name}"')
        html_text = html_text.replace(f"id='{id_name}'", f"id='{prefix}-{id_name}'")
        # Replace in JS (queries)
        js_text = js_text.replace(f"document.getElementById('{id_name}')", f"document.getElementById('{prefix}-{id_name}')")
        js_text = js_text.replace(f'document.getElementById("{id_name}")', f'document.getElementById("{prefix}-{id_name}")')
        js_text = js_text.replace(f"$('#{id_name}')", f"$('#{prefix}-{id_name}')")
        js_text = js_text.replace(f'$("{id_name}")', f'$("{prefix}-{id_name}")')

    # Replace local functions & state variables in JS
    funcs_to_replace = ["answer", "startPreTest", "startPostTest", "renderQuestion", "finishSection", "renderResult", "unlockGate"]
    for func in funcs_to_replace:
        js_text = js_text.replace(f"function {func}(", f"function {prefix}_{func}(")
        js_text = js_text.replace(f" {func}(", f" {prefix}_{func}(")
        js_text = js_text.replace(f"({func}(", f"({prefix}_{func}(")
        js_text = js_text.replace(f"={func}(", f"={prefix}_{func}(")
        js_text = js_text.replace(f"onload={func}", f"onload={prefix}_{func}")
        js_text = js_text.replace(f"onclick=\"{func}(", f"onclick=\"{prefix}_{func}(")
        js_text = js_text.replace(f"onclick='{func}(", f"onclick='{prefix}_{func}(")

    # Replace state and QUESTIONS arrays
    js_text = js_text.replace("let state = ", f"let {prefix}_state = ")
    js_text = js_text.replace("const state = ", f"const {prefix}_state = ")
    js_text = js_text.replace(" state.", f" {prefix}_state.")
    js_text = js_text.replace("(state.", f"({prefix}_state.")
    js_text = js_text.replace("state_instance", f"{prefix}_state_instance")
    
    js_text = js_text.replace("const QUESTIONS = ", f"const {prefix}_QUESTIONS = ")
    js_text = js_text.replace("const questions = ", f"const {prefix}_questions = ")
    js_text = js_text.replace(" QUESTIONS", f" {prefix}_QUESTIONS")
    js_text = js_text.replace(" questions", f" {prefix}_questions")
    
    return html_text, js_text

ch1_html, ch1_js = apply_replacements(ch1_html, ch1_js, "ch1")
ch2_html, ch2_js = apply_replacements(ch2_html, ch2_js, "ch2")
ch3_html, ch3_js = apply_replacements(ch3_html, ch3_js, "ch3")

# Additional replacements for Legacy & Warranty specifically
legacy_html = legacy_html.replace('id="master-key-input"', 'id="legacy-master-key-input"')
legacy_html = legacy_html.replace('id="gate-section"', 'id="legacy-gate-section"')
legacy_html = legacy_html.replace('id="gate-error"', 'id="legacy-gate-error"')
legacy_html = legacy_html.replace('id="cert-section"', 'id="legacy-cert-section"')
legacy_html = legacy_html.replace('id="transcript-container"', 'id="legacy-transcript-container"')
legacy_html = legacy_html.replace('id="student-name"', 'id="legacy-student-name"')
legacy_html = legacy_html.replace('id="student-id"', 'id="legacy-student-id"')
legacy_html = legacy_html.replace('id="final-rank"', 'id="legacy-final-rank"')
legacy_html = legacy_html.replace('id="doc-date"', 'id="legacy-doc-date"')
legacy_html = legacy_html.replace('id="key-display"', 'id="legacy-key-display"')
legacy_html = legacy_html.replace('id="time-hash"', 'id="legacy-time-hash"')
legacy_html = legacy_html.replace('id="score-1"', 'id="legacy-score-1"')
legacy_html = legacy_html.replace('id="score-2"', 'id="legacy-score-2"')
legacy_html = legacy_html.replace('id="score-3"', 'id="legacy-score-3"')

legacy_js = legacy_js.replace("unlockTranscript", "legacy_unlockTranscript")
legacy_js = legacy_js.replace("downloadPDF", "legacy_downloadPDF")
legacy_js = legacy_js.replace("master-key-input", "legacy-master-key-input")
legacy_js = legacy_js.replace("gate-section", "legacy-gate-section")
legacy_js = legacy_js.replace("gate-error", "legacy-gate-error")
legacy_js = legacy_js.replace("cert-section", "legacy-cert-section")
legacy_js = legacy_js.replace("transcript-container", "legacy-transcript-container")
legacy_js = legacy_js.replace("student-name", "legacy-student-name")
legacy_js = legacy_js.replace("student-id", "legacy-student-id")
legacy_js = legacy_js.replace("final-rank", "legacy-final-rank")
legacy_js = legacy_js.replace("doc-date", "legacy-doc-date")
legacy_js = legacy_js.replace("key-display", "legacy-key-display")
legacy_js = legacy_js.replace("time-hash", "legacy-time-hash")
legacy_js = legacy_js.replace("score-1", "legacy-score-1")
legacy_js = legacy_js.replace("score-2", "legacy-score-2")
legacy_js = legacy_js.replace("score-3", "legacy-score-3")

warranty_html = warranty_html.replace('id="verify-input"', 'id="warranty-verify-input"')
warranty_html = warranty_html.replace('id="gate-section"', 'id="warranty-gate-section"')
warranty_html = warranty_html.replace('id="gate-error"', 'id="warranty-gate-error"')
warranty_html = warranty_html.replace('id="dashboard-content"', 'id="warranty-dashboard-content"')

warranty_js = warranty_js.replace("verifyKey", "warranty_verifyKey")
warranty_js = warranty_js.replace("tryDecode", "warranty_tryDecode")
warranty_js = warranty_js.replace("renderDashboard", "warranty_renderDashboard")
warranty_js = warranty_js.replace("verify-input", "warranty-verify-input")
warranty_js = warranty_js.replace("gate-section", "warranty-gate-section")
warranty_js = warranty_js.replace("gate-error", "warranty-gate-error")
warranty_js = warranty_js.replace("dashboard-content", "warranty-dashboard-content")

# Combined Styles Extract
combined_styles = extract_style_content(ch1_raw) + "\n" + extract_style_content(ch2_raw) + "\n" + extract_style_content(ch3_raw)

# Template index.html
template = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>alchemist4real // masterclass</title>
    
    <!-- FAVICON: inline SVG favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230D0D0D'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='%23FAFAFA' font-size='20' font-family='serif' font-weight='600'%3EA%3C/text%3E%3C/svg%3E">
    
    <!-- Tailwind and Plugins -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        void: '#050505',
                        surface: '#0a0a0a',
                        border: '#27272a',
                        gold: '#fbbf24',
                        accent: '#10b981',
                        'accent-dim': '#a7f3d0',
                        'card-bg': '#FFFFFF',
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        mono: ['DM Mono', 'monospace'],
                        serif: ['Cormorant Garamond', 'serif'],
                        script: ['Pinyon Script', 'cursive'],
                    }
                }
            }
        }
    </script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&family=Pinyon+Script&family=Cinzel:wght@700;900&display=swap" rel="stylesheet">
    
    <!-- html2pdf & Chart.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        :root {
            --bg: #FAFAFA;
            --fg: #0D0D0D;
            --fg-faint: rgba(13, 13, 13, 0.15);
            --accent: #10b981;
            --card-bg: #FFFFFF;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background: var(--bg);
            color: var(--fg);
            font-family: 'DM Mono', monospace;
            min-height: 100vh;
            display: flex;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased;
        }
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.025;
            pointer-events: none;
            z-index: 9999;
        }
        
        /* Sidebar layout styles */
        .sidebar {
            width: 260px;
            background: var(--bg);
            border-right: 1px solid var(--fg-faint);
            height: 100vh;
            position: fixed;
            left: 0; top: 0;
            display: flex;
            flex-direction: column;
            padding: 32px 24px;
            z-index: 50;
        }
        
        .main-content-view {
            margin-left: 260px;
            flex-grow: 1;
            padding: 40px;
            max-width: 900px;
            width: 100%;
        }
        
        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: #6B6B6B;
            border: 1px solid transparent;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            transition: all 0.2s;
            margin-bottom: 8px;
        }
        .nav-item:hover:not(.nav-locked) {
            border-color: var(--fg);
            color: var(--fg);
            transform: translate(-1px, -1px);
            box-shadow: 1px 1px 0 var(--fg);
        }
        .nav-item.active-tab {
            background: var(--fg);
            color: var(--bg) !important;
            border-color: var(--fg);
            box-shadow: none;
            transform: none;
        }
        .nav-locked {
            opacity: 0.35;
            cursor: not-allowed;
            filter: grayscale(1);
        }
        
        .tab-view {
            transition: opacity 0.3s ease-in-out;
        }
        .hidden-view {
            display: none !important;
        }
        .active-view {
            display: block !important;
        }
        
        __COMBINED_STYLES__
        
        /* Reset absolute margins on nested mains */
        main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
        }
        
        .app {
            max-width: 100% !important;
            padding: 0 !important;
        }
    </style>
</head>
<body>

    <!-- SIDEBAR -->
    <div class="sidebar">
        <div class="mb-8">
            <span class="label text-[10px] text-gray-400 block mb-1">alchemist4real</span>
            <span class="font-serif font-bold text-xl tracking-wider text-gold">THE MASTERCLASS</span>
        </div>
        
        <div class="flex-grow flex flex-col justify-between">
            <div class="space-y-2">
                <div onclick="switchTab('ch1')" id="tab-ch1" class="nav-item active-tab">
                    <span>📖</span> Ch 1: Structure
                </div>
                <div onclick="switchTab('ch2')" id="tab-ch2" class="nav-item nav-locked">
                    <span>🧪</span> Ch 2: Transmutation
                </div>
                <div onclick="switchTab('ch3')" id="tab-ch3" class="nav-item nav-locked">
                    <span>⚡</span> Ch 3: Ascension
                </div>
                <div onclick="switchTab('legacy')" id="tab-legacy" class="nav-item nav-locked">
                    <span>🎓</span> Transcript
                </div>
                <div onclick="switchTab('warranty')" id="tab-warranty" class="nav-item">
                    <span>🛡️</span> Authority Check
                </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
                <div class="text-[10px] text-gray-400 font-mono">
                    STATE: <span id="app-state-label" class="text-green-500 font-bold animate-pulse">ARC_01</span>
                </div>
                <div class="text-[9px] text-gray-400 mt-2 font-mono" id="app-user-label">
                    USER: GUEST
                </div>
            </div>
        </div>
    </div>

    <!-- MAIN VIEWPORT -->
    <div class="main-content-view">
        __CH1_HTML__
        __CH2_HTML__
        __CH3_HTML__
        __LEGACY_HTML__
        __WARRANTY_HTML__
    </div>

    <script>
        // Global App State
        let appState = {
            activeTab: 'ch1',
            userName: '',
            ch1_pre: 0, ch1_post: 0,
            ch2_pre: 0, ch2_post: 0,
            ch3_pre: 0, ch3_post: 0,
            ch1_passed: false,
            ch2_passed: false,
            ch3_passed: false,
            rank: 'UNVERIFIED_ORGANISM',
            timestamp: null
        };

        // Load Recovery Key from external
        function importRecoveryKey(keyStr) {
            const clean = keyStr.replace(/-/g, '').trim();
            if(!clean) return false;
            try {
                const decoded = atob(clean);
                let jsonStr = "";
                for (let i = 0; i < decoded.length; i++) {
                    jsonStr += String.fromCharCode(decoded.charCodeAt(i) - 1);
                }
                const data = JSON.parse(jsonStr);
                
                // Set appState values
                appState.userName = data.n || '';
                if(data.c1) { appState.ch1_pre = data.c1[0]; appState.ch1_post = data.c1[1]; appState.ch1_passed = true; }
                if(data.c2) { appState.ch2_pre = data.c2[0]; appState.ch2_post = data.c2[1]; appState.ch2_passed = true; }
                if(data.c3) { appState.ch3_pre = data.c3[0]; appState.ch3_post = data.c3[1]; appState.ch3_passed = true; }
                appState.rank = data.rank || 'UNVERIFIED_ORGANISM';
                appState.timestamp = data.t || Date.now();
                
                saveAppState();
                syncUIState();
                return true;
            } catch(e) {
                return false;
            }
        }

        function saveAppState() {
            localStorage.setItem('cookwithalchemist_state', JSON.stringify(appState));
        }

        function loadAppState() {
            const saved = localStorage.getItem('cookwithalchemist_state');
            if(saved) {
                try {
                    appState = JSON.parse(saved);
                    syncUIState();
                } catch(e) {
                    console.error("Failed to load saved state:", e);
                }
            }
        }

        function syncUIState() {
            // Enable sidebar links based on progression
            const tabCh2 = document.getElementById('tab-ch2');
            const tabCh3 = document.getElementById('tab-ch3');
            const tabLegacy = document.getElementById('tab-legacy');
            const userLabel = document.getElementById('app-user-label');
            const stateLabel = document.getElementById('app-state-label');
            
            if(appState.userName) {
                userLabel.textContent = "USER: " + appState.userName.toUpperCase();
            } else {
                userLabel.textContent = "USER: GUEST";
            }
            
            if(appState.ch1_passed) {
                tabCh2.classList.remove('nav-locked');
                stateLabel.textContent = "LOG_02";
            }
            if(appState.ch2_passed) {
                tabCh3.classList.remove('nav-locked');
                stateLabel.textContent = "PRM_03";
            }
            if(appState.ch3_passed) {
                tabLegacy.classList.remove('nav-locked');
                stateLabel.textContent = "ASCENSION";
            }
            
            // Re-render subagent states
            if(appState.userName) {
                const ch1NameInput = document.getElementById('ch1-user-name');
                if(ch1NameInput) ch1NameInput.value = appState.userName;
            }
        }

        function switchTab(tabId) {
            // Check locks
            if(tabId === 'ch2' && !appState.ch1_passed) return;
            if(tabId === 'ch3' && !appState.ch2_passed) return;
            if(tabId === 'legacy' && !appState.ch3_passed) return;
            
            appState.activeTab = tabId;
            saveAppState();
            
            // Toggle sidebar classes
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active-tab'));
            document.getElementById('tab-' + tabId).classList.add('active-tab');
            
            // Toggle view visibilities
            document.querySelectorAll('.tab-view').forEach(el => {
                el.classList.remove('active-view');
                el.classList.add('hidden-view');
            });
            document.getElementById(tabId + '-view').classList.remove('hidden-view');
            document.getElementById(tabId + '-view').classList.add('active-view');
            
            // Trigger load states for specific views
            if(tabId === 'legacy' && appState.ch3_passed) {
                const legacyInput = document.getElementById('legacy-master-key-input');
                if(legacyInput) {
                    const payload = {
                        n: appState.userName,
                        c1: [appState.ch1_pre, appState.ch1_post],
                        c2: [appState.ch2_pre, appState.ch2_post],
                        c3: [appState.ch3_pre, appState.ch3_post],
                        rank: appState.rank,
                        t: appState.timestamp || Date.now()
                    };
                    const obfuscated = btoa(JSON.stringify(payload).split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('')).replace(/=/g, '');
                    legacyInput.value = obfuscated.match(/.{1,4}/g).join('-');
                }}
            if(tabId === 'warranty') {
                const warrantyInput = document.getElementById('warranty-verify-input');
                if(warrantyInput && appState.ch3_passed) {
                    const payload = {
                        n: appState.userName,
                        c1: [appState.ch1_pre, appState.ch1_post],
                        c2: [appState.ch2_pre, appState.ch2_post],
                        c3: [appState.ch3_pre, appState.ch3_post],
                        rank: appState.rank,
                        t: appState.timestamp || Date.now()
                    };
                    const obfuscated = btoa(JSON.stringify(payload).split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('')).replace(/=/g, '');
                    warrantyInput.value = obfuscated.match(/.{1,4}/g).join('-');
                }
            }
        }

        // ==========================================
        // SUBAGENT LOGIC INTEGRATION
        // ==========================================
        
        // --- CHAPTER 1 JS ---
        __CH1_JS__

        // Intercept Ch1 finish to trigger progression
        const original_ch1_renderResult = ch1_renderResult;
        ch1_renderResult = function() {
            original_ch1_renderResult();
            const ch1_postPct = Math.round((ch1_state.postScore / 3) * 100);
            const ch1_prePct = Math.round((ch1_state.preScore / 3) * 100);
            const ch1_passed = ch1_postPct === 100 || (ch1_postPct >= 66 && ch1_postPct > ch1_prePct);
            
            if(ch1_passed) {
                appState.ch1_passed = true;
                appState.userName = ch1_state.userName;
                appState.ch1_pre = ch1_state.preScore;
                appState.ch1_post = ch1_state.postScore;
                appState.timestamp = Date.now();
                saveAppState();
                syncUIState();
                setTimeout(() => {
                    switchTab('ch2');
                }, 2500);
            }
        };

        // --- CHAPTER 2 JS ---
        __CH2_JS__
        
        // Auto-unlock gate for Ch2 if already completed Ch1 in state
        const original_ch2_unlockGate = ch2_unlockGate;
        ch2_unlockGate = function() {
            if(appState.ch1_passed && !document.getElementById('ch2-genesis-key-input').value) {
                const payload = { n: appState.userName, s1: appState.ch1_pre, s2: appState.ch1_post, t: appState.timestamp };
                const obfuscated = btoa(JSON.stringify(payload).split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('')).replace(/=/g, '');
                document.getElementById('ch2-genesis-key-input').value = obfuscated.match(/.{1,4}/g).join('-');
            }
            original_ch2_unlockGate();
        };
        
        const original_ch2_renderResult = ch2_renderResult;
        ch2_renderResult = function() {
            original_ch2_renderResult();
            const ch2_postPct = Math.round((ch2_state.postScore / 3) * 100);
            if(ch2_postPct >= 66) {
                appState.ch2_passed = true;
                appState.ch2_pre = ch2_state.preScore;
                appState.ch2_post = ch2_state.postScore;
                saveAppState();
                syncUIState();
                setTimeout(() => {
                    switchTab('ch3');
                }, 2500);
            }
        };

        // --- CHAPTER 3 JS ---
        __CH3_JS__
        
        const original_ch3_unlockGate = ch3_unlockGate;
        ch3_unlockGate = function() {
            if(appState.ch2_passed && !document.getElementById('ch3-exodus-key-input').value) {
                const payload = {
                    n: appState.userName,
                    c1: [appState.ch1_pre, appState.ch1_post],
                    c2: [appState.ch2_pre, appState.ch2_post],
                    rank: 'ALCHEMIST_L2',
                    t: appState.timestamp
                };
                const obfuscated = btoa(JSON.stringify(payload).split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('')).replace(/=/g, '');
                document.getElementById('ch3-exodus-key-input').value = obfuscated.match(/.{1,4}/g).join('-');
            }
            original_ch3_unlockGate();
        };
        
        const original_ch3_renderResult = ch3_renderResult;
        ch3_renderResult = function() {
            original_ch3_renderResult();
            const ch3_postPct = Math.round((ch3_state.postScore / 5) * 100);
            if(ch3_postPct >= 60) {
                appState.ch3_passed = true;
                appState.ch3_pre = ch3_state.preScore;
                appState.ch3_post = ch3_state.postScore;
                
                const avg1 = ((appState.ch1_pre + appState.ch1_post) / 6) * 100;
                const avg2 = ((appState.ch2_pre + appState.ch2_post) / 6) * 100;
                const avg3 = ((appState.ch3_pre + appState.ch3_post) / 10) * 100;
                const totalAvg = (avg1 + avg2 + avg3) / 3;
                
                if (totalAvg >= 90) appState.rank = 'VERIFIED_HUMAN_ALPHA';
                else if (totalAvg >= 70) appState.rank = 'VERIFIED_HUMAN_BETA';
                else appState.rank = 'UNVERIFIED_ORGANISM';
                
                saveAppState();
                syncUIState();
                setTimeout(() => {
                    switchTab('legacy');
                }, 2500);
            }
        };

        // --- LEGACY JS ---
        __LEGACY_JS__

        // --- WARRANTY JS ---
        __WARRANTY_JS__

        // Global Init
        function init() {
            loadAppState();
            
            // Auto bypass gates for tabs if state is loaded
            if(appState.ch1_passed) {
                ch2_unlockGate();
            }
            if(appState.ch2_passed) {
                ch3_unlockGate();
            }
            if(appState.ch3_passed) {
                legacy_unlockTranscript();
            }
        }

        // Intercept form submissions or window onload
        window.addEventListener('load', () => {
            init();
            
            // Hook observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                    }
                });
            }, { threshold: 0.15 });
            
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });
    </script>
</body>
</html>
"""

# Compile template by replacing placeholders
compiled = template.replace("__COMBINED_STYLES__", combined_styles)
compiled = compiled.replace("__CH1_HTML__", ch1_html)
compiled = compiled.replace("__CH2_HTML__", ch2_html)
compiled = compiled.replace("__CH3_HTML__", ch3_html)
compiled = compiled.replace("__LEGACY_HTML__", legacy_html)
compiled = compiled.replace("__WARRANTY_HTML__", warranty_html)

compiled = compiled.replace("__CH1_JS__", ch1_js)
compiled = compiled.replace("__CH2_JS__", ch2_js)
compiled = compiled.replace("__CH3_JS__", ch3_js)
compiled = compiled.replace("__LEGACY_JS__", legacy_js)
compiled = compiled.replace("__WARRANTY_JS__", warranty_js)

# Write to file
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(compiled)

print("Unified SPA Application compiled successfully via string replacements!")
print("Location:", output_path)
print("File size:", os.path.getsize(output_path), "bytes")
