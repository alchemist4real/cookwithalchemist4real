import sys

file_path = "ch1_structure.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add SortableJS
if "<script src=\"https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js\"></script>" not in content:
    content = content.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet">',
        '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet">\n    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>'
    )

# 2. Add CSS
new_css = """
        /* --- DOM TREE EXPLORER CSS --- */
        .dte-container { border: 1px solid var(--fg-faint); border-radius: 2px; background-color: #FFFFFF; display: flex; flex-direction: column; md-flex-direction: row; margin-top: 24px; }
        .dte-tree { flex: 1; padding: 24px; border-right: 1px solid var(--fg-faint); overflow-x: auto; font-size: 12px; }
        .dte-props { width: 300px; padding: 24px; background-color: var(--bg); font-family: 'DM Mono', monospace; font-size: 11px; }
        .dte-node { cursor: pointer; padding: 4px 8px; border: 1px solid transparent; border-radius: 2px; transition: all 0.15s; margin-left: 16px; position: relative; }
        .dte-node::before { content: ''; position: absolute; left: -10px; top: 12px; width: 10px; border-top: 1px dashed var(--fg-faint); }
        .dte-node::after { content: ''; position: absolute; left: -10px; top: -4px; height: 16px; border-left: 1px dashed var(--fg-faint); }
        .dte-node:hover { border-color: var(--fg); background-color: rgba(13,13,13,0.05); }
        .dte-node.selected { background-color: var(--fg); color: var(--bg); border-color: var(--fg); }
        
        /* --- SEMANTIC ARCHITECT CSS --- */
        .sa-container { display: flex; gap: 24px; margin-top: 24px; flex-wrap: wrap; }
        .sa-pool { width: 250px; background-color: var(--bg); border: 1px solid var(--fg-faint); padding: 16px; border-radius: 2px; }
        .sa-canvas { flex: 1; min-width: 300px; border: 2px dashed var(--fg-faint); background-color: #FFFFFF; padding: 24px; border-radius: 2px; position: relative; }
        .sa-item { padding: 12px; background-color: var(--card-bg); border: 1px solid var(--fg); margin-bottom: 8px; cursor: grab; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700; text-align: center; border-radius: 2px; box-shadow: 2px 2px 0 var(--fg); }
        .sa-item:active { cursor: grabbing; box-shadow: 0 0 0 var(--fg); transform: translate(2px, 2px); }
        .sa-canvas.drag-over { border-color: var(--fg); background-color: rgba(16,185,129,0.05); }
        
        /* --- BLINDFOLD TEST CSS --- */
        .bt-container { border: 1px solid var(--fg); background-color: var(--card-bg); border-radius: 2px; margin-top: 24px; overflow: hidden; position: relative; }
        .bt-toolbar { padding: 16px; background-color: var(--fg); color: var(--bg); display: flex; justify-content: space-between; align-items: center; }
        .bt-viewport { padding: 40px; transition: filter 0.5s; position: relative; }
        .bt-viewport.blurred { filter: blur(12px) grayscale(100%); pointer-events: none; }
        .bt-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,0.8); color: #FFF; opacity: 0; pointer-events: none; transition: opacity 0.5s; z-index: 10; padding: 24px; text-align: center; }
        .bt-overlay.active { opacity: 1; pointer-events: auto; }
        .sr-log { background: #000; color: #0F0; font-family: monospace; font-size: 12px; padding: 16px; height: 150px; overflow-y: auto; border-top: 1px solid #333; }
        .sr-log-entry { margin-bottom: 8px; border-left: 2px solid #0F0; padding-left: 8px; }
"""

if "/* --- DOM TREE EXPLORER CSS --- */" not in content:
    content = content.replace("</style>", new_css + "\n    </style>")

# 3. Add HTML
new_html = """
                <!-- TAMBAHAN MATERI 3: DOM RENDERING PIPELINE -->
                <div style="margin-top: 56px;" class="reveal stagger-1">
                    <h2 class="section-title">The Rendering Pipeline: Dari Byte Menjadi Piksel</h2>
                    <div class="prose">
                        <p>
                            Pernah berpikir bagaimana teks statis di HTML berubah menjadi halaman interaktif yang indah di layar lo? Ini bukan sihir, ini <strong>Rendering Pipeline</strong>.
                        </p>
                        <p>
                            Setiap kali lo buka web, browser bekerja layaknya pabrik perakitan super cepat:
                        </p>
                        <ol style="margin-left: 20px; font-size: 15px; color: rgba(13, 13, 13, 0.85); margin-bottom: 24px; list-style-type: decimal; padding-left: 16px;">
                            <li style="margin-bottom: 12px;"><strong>Parsing HTML (Membangun DOM):</strong> Browser membaca raw bytes, merubahnya jadi karakter, lalu token (seperti tag &lt;html&gt;, &lt;body&gt;), dan akhirnya menyusunnya jadi pohon <em>Document Object Model (DOM)</em>.</li>
                            <li style="margin-bottom: 12px;"><strong>Parsing CSS (Membangun CSSOM):</strong> Di waktu yang sama, browser membaca CSS dan membuat pohon terpisah: <em>CSS Object Model (CSSOM)</em>. DOM adalah tulang, CSSOM adalah kulit.</li>
                            <li style="margin-bottom: 12px;"><strong>Render Tree:</strong> Browser menggabungkan DOM dan CSSOM. Elemen yang disembunyikan (<code>display: none</code>) dicoret dari daftar ini karena gak perlu digambar.</li>
                            <li style="margin-bottom: 12px;"><strong>Layout (Reflow):</strong> Mesin menghitung geometri yang presisi. "Tombol ini lebarnya 200px, ditaruh di kordinat X:50, Y:100".</li>
                            <li style="margin-bottom: 12px;"><strong>Paint:</strong> Browser mewarnai pixel demi pixel di memori berdasarkan hasil layout tadi.</li>
                            <li style="margin-bottom: 12px;"><strong>Composite:</strong> Kadang web punya layer tumpuk-menumpuk (z-index, fixed nav). Browser menyatukan layer-layer ini jadi satu gambar utuh di layar.</li>
                        </ol>
                        
                        <p>
                            <strong>Kenapa lo harus peduli?</strong> Karena web yang lambat biasanya gara-gara developer yang merusak pipeline ini dengan Javascript yang berantakan atau memaksa browser melakukan <em>Layout</em> (Reflow) berulang kali setiap detik.
                        </p>
                    </div>

                    <!-- INTERACTIVE: DOM TREE EXPLORER -->
                    <div class="dte-container">
                        <div class="dte-tree" id="dte-tree">
                            <div style="font-weight: 700; margin-bottom: 12px;">INTERACTIVE DOM MAP</div>
                            <!-- Injected by JS -->
                        </div>
                        <div class="dte-props" id="dte-props">
                            <div style="color: rgba(13,13,13,0.5); font-style: italic;">Klik salah satu node di samping untuk melihat properti objeknya secara rinci.</div>
                        </div>
                    </div>
                </div>

                <!-- TAMBAHAN MATERI 4: ACCESSIBILITY (A11Y) & ARIA -->
                <div style="margin-top: 56px;" class="reveal stagger-2">
                    <h2 class="section-title">A11y & ARIA: Mendesain untuk Seluruh Umat Manusia</h2>
                    <div class="prose">
                        <p>
                            <strong>A11y</strong> adalah singkatan dari Accessibility (A + 11 huruf + y). Banyak yang mikir: <em>"Web gue buat orang normal aja, gak usah mikirin yang buta atau difabel."</em>
                        </p>
                        <p>
                            Itu mindset amatir. Lo lupa bahwa difabel gak selalu permanen. Lo bisa kena sinar matahari terik di jalan (situasional difabel) dan ga bisa liat layar. Lo bisa patah tangan (temporary difabel) dan cuma bisa browsing pake tab keyboard.
                        </p>
                        <p>
                            Mesin (seperti Googlebot) juga "buta". Kalau web lo bagus buat <em>Screen Reader</em> (pembaca layar untuk tuna netra), SEO web lo otomatis bakal melesat karena Googlebot bisa memahaminya dengan sempurna.
                        </p>
                        
                        <h3 style="font-size: 1.5rem; margin: 32px 0 16px 0;">Aturan Emas ARIA</h3>
                        <p>
                            <strong>WAI-ARIA</strong> (Web Accessibility Initiative - Accessible Rich Internet Applications) adalah atribut tambahan di HTML buat ngasih tau screen reader konteks elemen tersebut. Misalnya: elemen ini <code>role="button"</code>, statusnya <code>aria-expanded="false"</code>.
                        </p>
                        <blockquote style="margin-top: 16px;">
                            "Aturan pertama penggunaan ARIA adalah: Jangan gunakan ARIA jika lo bisa menggunakan elemen HTML Semantik bawaan."
                        </blockquote>
                        <p>
                            Lebih baik pakai <code>&lt;button&gt;</code> asli, ketimbang pakai <code>&lt;div class="tombol" role="button" aria-pressed="false"&gt;</code>. Yang asli udah punya fungsionalitas keyboard (Enter/Space) secara bawaan!
                        </p>
                    </div>

                    <!-- INTERACTIVE: SEMANTIC ARCHITECT -->
                    <div style="margin-top: 48px; border: 1px solid var(--fg); padding: 24px; border-radius: 2px; background-color: #FAFAFA;">
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 8px;">Semantic Architect (Drag & Drop)</h3>
                        <p style="font-size: 13px; color: rgba(13,13,13,0.7); margin-bottom: 24px;">
                            Susun layout sebuah halaman artikel yang baik. Tarik elemen dari kiri ke dalam Canvas di kanan. Urutannya harus masuk akal secara semantik. (Misal: header di atas, dilanjut main yang isinya article, lalu footer).
                        </p>
                        <div class="sa-container">
                            <div class="sa-pool" id="sa-pool">
                                <div style="font-size: 10px; text-transform: uppercase; margin-bottom: 16px; font-weight: 700; color: rgba(13,13,13,0.5);">Gudang Tag</div>
                                <div class="sa-item" data-tag="footer">&lt;footer&gt;</div>
                                <div class="sa-item" data-tag="main">&lt;main&gt;</div>
                                <div class="sa-item" data-tag="header">&lt;header&gt;</div>
                                <div class="sa-item" data-tag="nav">&lt;nav&gt;</div>
                                <div class="sa-item" data-tag="article">&lt;article&gt;</div>
                            </div>
                            <div class="sa-canvas" id="sa-canvas">
                                <div style="font-size: 10px; text-transform: uppercase; margin-bottom: 16px; font-weight: 700; color: rgba(13,13,13,0.5);">Canvas Konstruksi</div>
                                <!-- Drop zone -->
                            </div>
                        </div>
                        <button class="btn btn-secondary" style="margin-top: 24px;" onclick="validateSemantics()">Validasi Arsitektur</button>
                        <div id="sa-feedback" style="margin-top: 16px; font-size: 13px; font-weight: 700;"></div>
                    </div>

                    <!-- INTERACTIVE: BLINDFOLD TEST -->
                    <div style="margin-top: 56px;">
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 700; margin-bottom: 8px;">The Blindfold Test</h3>
                        <p style="font-size: 13px; color: rgba(13,13,13,0.7); margin-bottom: 24px;">
                            Kita akan buktikan kenapa struktur yang jelek itu menyiksa. Klik tombol di bawah. Penglihatan lo akan direnggut. Lo hanya bisa mengandalkan Screen Reader (Teks Simulator). Coba temukan tombol "Checkout".
                        </p>
                        
                        <div class="bt-container">
                            <div class="bt-toolbar">
                                <span style="font-family: 'DM Mono'; font-weight: 700; font-size: 12px;">UI MOCKUP</span>
                                <button class="btn" style="background-color: var(--bg); color: var(--fg);" onclick="startBlindfold()">Mulai Simulasi Kebutaan</button>
                            </div>
                            
                            <div class="bt-viewport" id="bt-viewport">
                                <h1 style="font-size: 24px; margin-bottom: 16px;">Toko Kelontong Digital</h1>
                                <p style="margin-bottom: 24px;">Silakan pilih barang dan bayar di kasir.</p>
                                
                                <div style="display: flex; gap: 16px; margin-bottom: 32px;">
                                    <div style="border: 1px solid var(--fg-faint); padding: 16px;">
                                        <h3>Kopi Robusta</h3>
                                        <p>Rp 50.000</p>
                                        <button class="btn btn-secondary" style="padding: 4px 8px;">Tambah</button>
                                    </div>
                                    <div style="border: 1px solid var(--fg-faint); padding: 16px;">
                                        <h3>Susu Oat</h3>
                                        <p>Rp 35.000</p>
                                        <button class="btn btn-secondary" style="padding: 4px 8px;">Tambah</button>
                                    </div>
                                </div>
                                
                                <!-- Tombol checkout jelek secara struktur, tapi tampilannya seperti tombol -->
                                <div onclick="finishBlindfold()" tabindex="0" style="background-color: var(--accent-success); color: #FFF; padding: 16px; text-align: center; cursor: pointer; font-weight: bold; width: 200px;">
                                    Bayar Sekarang (Checkout)
                                </div>
                            </div>
                            
                            <div class="bt-overlay" id="bt-overlay">
                                <h2 style="font-family: 'Cormorant Garamond'; font-size: 2rem; margin-bottom: 16px;">Penglihatan Dinonaktifkan.</h2>
                                <p style="font-family: 'DM Mono'; font-size: 12px; margin-bottom: 24px; max-width: 400px;">
                                    Gunakan tombol [TAB] di keyboard lo untuk navigasi antar elemen, dan tekan [ENTER] saat menemukan Checkout. Perhatikan log Screen Reader di bawah.
                                </p>
                            </div>
                        </div>
                        <div class="sr-log" id="sr-log">
                            <div style="color: #666;">// Screen Reader Simulator diaktifkan...</div>
                        </div>
                    </div>
                </div>
"""

# Find injection point
injection_marker = "<!-- SECTION 3: THE X-RAY (Interactive) -->"
if injection_marker in content and "<!-- TAMBAHAN MATERI 3: DOM RENDERING PIPELINE -->" not in content:
    content = content.replace(injection_marker, new_html + "\n                " + injection_marker)

# 4. Add JS Logic
new_js = """
        // --- DOM TREE EXPLORER LOGIC ---
        const domData = {
            tag: "html", 
            props: { lang: "id" },
            children: [
                { tag: "head", props: {}, children: [{ tag: "title", props: { text: "Cooking with Alchemist" } }] },
                { 
                    tag: "body", 
                    props: { class: "selection:bg-accent" },
                    children: [
                        { tag: "nav", props: { class: "nav-container" }, children: [{ tag: "div", props: { class: "nav-logo" }, children: [] }] },
                        { tag: "main", props: {}, children: [
                            { tag: "header", props: { id: "hero" }, children: [{ tag: "h1", props: { class: "hero-title glitch-text" } }] },
                            { tag: "section", props: { id: "materi-section" }, children: [{ tag: "div", props: { class: "prose" } }] }
                        ]},
                        { tag: "footer", props: {}, children: [] }
                    ]
                }
            ]
        };

        function renderDOMTree(node, container, level = 0) {
            const el = document.createElement('div');
            el.className = 'dte-node';
            el.innerHTML = `<span style="color: #F472B6;">&lt;${node.tag}&gt;</span>`;
            
            el.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dte-node').forEach(n => n.classList.remove('selected'));
                el.classList.add('selected');
                showDOMProps(node);
            };

            container.appendChild(el);

            if (node.children && node.children.length > 0) {
                const childContainer = document.createElement('div');
                childContainer.style.marginLeft = '16px';
                node.children.forEach(child => renderDOMTree(child, childContainer, level + 1));
                container.appendChild(childContainer);
            }
        }

        function showDOMProps(node) {
            const propsBox = document.getElementById('dte-props');
            let html = `<div style="font-weight: 700; margin-bottom: 12px; color: var(--fg); font-size: 14px;">Node: ${node.tag.toUpperCase()}</div>`;
            html += `<div style="margin-bottom: 16px;"><strong>Type:</strong> HTMLElement</div>`;
            
            if (Object.keys(node.props).length > 0) {
                html += `<div><strong>Attributes:</strong></div>`;
                html += `<ul style="margin-left: 16px; margin-top: 8px;">`;
                for (const [key, value] of Object.entries(node.props)) {
                    html += `<li style="margin-bottom: 4px;"><span style="color: #10B981;">${key}</span>: "${value}"</li>`;
                }
                html += `</ul>`;
            } else {
                html += `<div style="color: rgba(13,13,13,0.5);">No attributes.</div>`;
            }
            propsBox.innerHTML = html;
        }

        // Initialize DOM Tree
        setTimeout(() => {
            const treeContainer = document.getElementById('dte-tree');
            if (treeContainer) {
                treeContainer.innerHTML = '<div style="font-weight: 700; margin-bottom: 12px;">INTERACTIVE DOM MAP</div>';
                renderDOMTree(domData, treeContainer);
            }
            
            // Initialize Sortable
            if (typeof Sortable !== 'undefined') {
                new Sortable(document.getElementById('sa-pool'), {
                    group: 'shared',
                    animation: 150
                });
                new Sortable(document.getElementById('sa-canvas'), {
                    group: 'shared',
                    animation: 150
                });
            }
        }, 1000);

        // --- SEMANTIC ARCHITECT LOGIC ---
        function validateSemantics() {
            const canvas = document.getElementById('sa-canvas');
            const items = canvas.querySelectorAll('.sa-item');
            const order = Array.from(items).map(item => item.getAttribute('data-tag'));
            
            const feedback = document.getElementById('sa-feedback');
            
            if (order.length === 0) {
                feedback.innerText = "Canvas masih kosong. Tarik elemen ke sini.";
                feedback.style.color = "#ff0055";
                return;
            }

            // Ideal order: header -> nav -> main -> article -> footer (or similar valid logic)
            // A simple validation for demonstration:
            const hasHeader = order.indexOf('header') !== -1;
            const hasMain = order.indexOf('main') !== -1;
            const hasFooter = order.indexOf('footer') !== -1;
            
            let isValid = true;
            let msg = "";

            if (hasHeader && hasFooter && order.indexOf('header') > order.indexOf('footer')) {
                isValid = false;
                msg = "Header tidak mungkin berada di bawah Footer!";
            } else if (hasMain && hasHeader && order.indexOf('main') < order.indexOf('header')) {
                isValid = false;
                msg = "Main content sebaiknya berada di bawah Header.";
            } else if (!hasMain) {
                isValid = false;
                msg = "Halaman lo butuh <main> sebagai wadah konten utama.";
            } else {
                msg = "Arsitektur Semantik Valid! Struktur yang rapi akan disukai oleh Screen Reader dan Googlebot.";
            }

            feedback.innerText = msg;
            feedback.style.color = isValid ? "var(--accent-success)" : "#ff0055";
        }

        // --- BLINDFOLD TEST LOGIC ---
        let blindfoldActive = false;
        function startBlindfold() {
            if(blindfoldActive) return;
            blindfoldActive = true;
            
            document.getElementById('bt-viewport').classList.add('blurred');
            document.getElementById('bt-overlay').classList.add('active');
            logSR("SIMULATOR AKTIF. Penglihatan dimatikan. Mengandalkan navigasi TAB keyboard.");
            
            // Hijack tab key for the viewport
            document.addEventListener('keydown', handleBlindfoldTab);
        }

        function finishBlindfold() {
            if(!blindfoldActive) return;
            blindfoldActive = false;
            
            document.getElementById('bt-viewport').classList.remove('blurred');
            document.getElementById('bt-overlay').classList.remove('active');
            document.removeEventListener('keydown', handleBlindfoldTab);
            
            logSR(">>> SELAMAT! Lo berhasil menemukan tombol checkout. Checkout tereksekusi. <<<");
            alert("Checkout Berhasil! Lo menyadari kan kalau elemen DIV yang dijadikan tombol itu miskin interaktivitas? Screen reader cuma bilang 'group' atau mengabaikannya.");
        }

        function handleBlindfoldTab(e) {
            if (e.key === 'Tab' && blindfoldActive) {
                setTimeout(() => {
                    const active = document.activeElement;
                    if (active.tagName.toLowerCase() === 'button') {
                        logSR(`Fokus pada Button: ${active.innerText}`);
                    } else if (active.tagName.toLowerCase() === 'div' && active.hasAttribute('tabindex')) {
                        // This simulates bad accessibility where a div is used as a button without role="button"
                        logSR(`Fokus pada Elemen Tak Dikenal (Div). Teks: ${active.innerText}`);
                    }
                }, 10);
            }
            if (e.key === 'Enter' && blindfoldActive) {
                const active = document.activeElement;
                if (active.tagName.toLowerCase() === 'div' && active.hasAttribute('tabindex')) {
                    finishBlindfold();
                } else if (active.tagName.toLowerCase() === 'button') {
                    logSR(`Klik Button: ${active.innerText}`);
                }
            }
        }

        function logSR(msg) {
            const log = document.getElementById('sr-log');
            const entry = document.createElement('div');
            entry.className = 'sr-log-entry';
            entry.innerText = `[SCREEN READER] ${msg}`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        }
"""

if "// --- DOM TREE EXPLORER LOGIC ---" not in content:
    content = content.replace("</script>\n</body>", new_js + "\n    </script>\n</body>")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Expansion script applied successfully.")
