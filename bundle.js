
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
        
        function toggleSidebar() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.main-content-view').classList.toggle('expanded');
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
        // DATA
        const ch1_questions = [
            {
                q: "Apa fungsi fundamental HTML dalam konteks 'Arsitektur' informasi?",
                options: [
                    "Membuat website terlihat estetik dan mahal.",
                    "Mendefinisikan struktur dan makna setiap elemen (mana tiang, mana bata).",
                    "Membuat website bisa berinteraksi dengan user.",
                    "Menghubungkan website ke server database."
                ],
                correct: 1
            },
            {
                q: "Mengapa kemampuan membuat 'Single File HTML' dianggap sebagai leverage?",
                options: [
                    "Karena file-nya kecil jadi hemat kuota.",
                    "Karena memungkinkan kita membuat software/alat sendiri tanpa bergantung pada server/biaya langganan.",
                    "Karena itu satu-satunya format yang dibaca Google.",
                    "Agar kode tidak bisa dicuri orang lain."
                ],
                correct: 1
            },
            {
                q: "Jika Anda melihat tombol di website, apa yang sebenarnya dilihat oleh mesin (browser)?",
                options: [
                    "Sebuah gambar kotak berwarna.",
                    "Instruksi &lt;button&gt; yang menunggu pemicu (event).",
                    "Pixel-pixel yang disusun rapi.",
                    "Magic."
                ],
                correct: 1
            }
        ];

        let ch1_state = {
            userName: "",
            preScore: 0,
            postScore: 0,
            qIndex: 0,
            isPre: true,
            labItems: []
        };

        // --- PRE-TEST LOGIC ---
        function ch1_startPreTest() {
            const nameInput = document.getElementById('ch1-user-name');
            const name = nameInput.value.trim();

            if (!name) {
                alert("Identitas diperlukan untuk melanjutkan protokol.");
                nameInput.focus();
                nameInput.style.borderColor = '#ff0055';
                setTimeout(() => nameInput.style.borderColor = 'var(--fg-faint)', 2000);
                return;
            }

            ch1_state.userName = name;
            document.getElementById('user-display-name').innerText = name.toUpperCase();
            
            document.getElementById('pretest-intro').style.display = 'none';
            document.getElementById('pretest-container').style.display = 'block';
            ch1_renderQ();
        }

        function ch1_renderQ() {
            const container = ch1_state.isPre ? 'pre' : 'post';
            const q = ch1_questions[state.qIndex];
            
            document.getElementById(`${container}-q-num`).innerText = ch1_state.qIndex + 1;
            document.getElementById(`${container}-q-text`).innerText = q.q;
            
            const opts = document.getElementById(`${container}-options`);
            opts.innerHTML = '';
            
            q.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = "option-btn";
                btn.innerHTML = `<span>${opt}</span> <span class="option-arrow">→</span>`;
                btn.onclick = () => ch1_answer(i);
                opts.appendChild(btn);
            });
        }

        function ch1_answer(idx) {
            if (idx === ch1_questions[state.qIndex].correct) {
                if (ch1_state.isPre) ch1_state.preScore++; else ch1_state.postScore++;
            }
            
            ch1_state.qIndex++;
            if (ch1_state.qIndex < ch1_questions.length) {
                ch1_renderQ();
            } else {
                ch1_finishSection();
            }
        }

        function ch1_finishSection() {
            if (ch1_state.isPre) {
                // Unlock Content
                document.getElementById('ch1-pretest-section').innerHTML = `
                    <div style="padding: 24px; text-align: center; border: 1px solid var(--fg); background-color: rgba(13, 13, 13, 0.05); border-radius: 2px; box-shadow: 2px 2px 0 var(--fg);">
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Data Awal Tercatat: ${state.userName}</h3>
                        <p style="font-size: 13px; color: rgba(13, 13, 13, 0.7);">Sekarang, mari kita bongkar ilusi yang selama ini lo percaya.</p>
                    </div>
                `;
                const materi = document.getElementById('ch1-materi-section');
                materi.classList.remove('locked');
                setTimeout(() => {
                    materi.scrollIntoView({behavior: 'smooth'});
                }, 500);
            } else {
                // Show Result
                document.getElementById('ch1-posttest-section').style.display = 'none';
                document.getElementById('ch1-result-section').style.display = 'block';
                ch1_renderResult();
                setTimeout(() => {
                    document.getElementById('ch1-result-section').scrollIntoView({behavior: 'smooth'});
                }, 100);
            }
        }

        // --- X-RAY LOGIC ---
        function setXray(isActive) {
            const viewport = document.getElementById('xray-viewport');
            const descText = document.getElementById('xray-desc-text');
            const btnNormal = document.getElementById('btn-normal');
            const btnXray = document.getElementById('btn-xray');

            if (isActive) {
                viewport.classList.add('xray-active');
                descText.innerHTML = '<span style="color: var(--fg); font-weight: bold;">// Mode Arsitek:</span> Lo gak lagi melihat gambar/teks biasa. Lo melihat blok-blok tag HTML penyusunnya. Inilah yang dibaca oleh mesin web browser.';
                btnNormal.classList.remove('active');
                btnXray.classList.add('active');
            } else {
                viewport.classList.remove('xray-active');
                descText.innerHTML = '<span style="color: rgba(13, 13, 13, 0.5); font-weight: bold;">// Mode Manusia:</span> Mata lo memproses estetika visual (warna, susunan, font) dari CSS. Lo melihat halaman profil Stark, bukan tag-tag penyusunnya.';
                btnXray.classList.remove('active');
                btnNormal.classList.add('active');
            }
        }

        // --- LAB LOGIC ---
        function addLabItem(type) {
            const prev = document.getElementById('lab-preview-display');
            const code = document.getElementById('lab-code-display');
            const placeholder = document.getElementById('lab-preview-placeholder');
            
            if (ch1_state.labItems.length === 0) {
                prev.innerHTML = '';
                code.innerHTML = '';
            }

            let html = '';
            let rawCode = '';

            if (type === 'h1') {
                html = '<h1 class="preview-h1">Ide Besar (Heading)</h1>';
                rawCode = `<div><span style="color: #F472B6;">&lt;h1&gt;</span>Ide Besar (Heading)<span style="color: #F472B6;">&lt;/h1&gt;</span></div>`;
            } else if (type === 'p') {
                html = '<p class="preview-p">Ini adalah penjelasan detail dari ide tersebut. Panjang, terstruktur, dan mudah dibaca.</p>';
                rawCode = `<div><span style="color: #60A5FA;">&lt;p&gt;</span>Ini adalah penjelasan detail...<span style="color: #60A5FA;">&lt;/p&gt;</span></div>`;
            } else if (type === 'btn') {
                html = '<button class="preview-btn" onclick="alert(\'Action triggered!\')">Eksekusi Ide</button>';
                rawCode = `<div><span style="color: #FBBF24;">&lt;button&gt;</span>Eksekusi Ide<span style="color: #FBBF24;">&lt;/button&gt;</span></div>`;
            }

            // Append preview
            const divPreview = document.createElement('div');
            divPreview.innerHTML = html;
            prev.appendChild(divPreview.firstChild);

            // Append code
            const divCode = document.createElement('div');
            divCode.innerHTML = rawCode;
            code.appendChild(divCode);

            ch1_state.labItems.push(type);
            code.scrollTop = code.scrollHeight;
        }

        function resetLab() {
            ch1_state.labItems = [];
            document.getElementById('lab-preview-display').innerHTML = `
                <div style="display: flex; height: 100%; align-items: center; justify-content: center; color: #9CA3AF; font-style: italic; font-size: 13px;" id="lab-preview-placeholder">
                    Canvas Kosong
                </div>
            `;
            document.getElementById('lab-code-display').innerHTML = '<span class="lab-code-placeholder">// Menunggu input instruksi...</span>';
        }

        // --- FINAL LOGIC & ALCHEMY HASH ---
        function ch1_startPostTest() {
            ch1_state.isPre = false;
            ch1_state.qIndex = 0;
            document.getElementById('posttest-intro').style.display = 'none';
            document.getElementById('posttest-container').style.display = 'block';
            ch1_renderQ();
        }

        function generateAlchemyHash(name, pre, post) {
            const dataPayload = {
                n: name,
                s1: pre,
                s2: post,
                t: Date.now()
            };
            
            const jsonStr = JSON.stringify(dataPayload);
            
            let obfuscated = "";
            for (let i = 0; i < jsonStr.length; i++) {
                obfuscated += String.fromCharCode(jsonStr.charCodeAt(i) + 1);
            }

            const encoded = btoa(obfuscated).replace(/=/g, '');
            const chunks = encoded.match(/.{1,4}/g);
            return chunks.join('-');
        }

        function ch1_renderResult() {
            const prePct = Math.round((ch1_state.preScore / 3) * 100);
            const postPct = Math.round((ch1_state.postScore / 3) * 100);
            
            document.getElementById('final-pre-score').innerText = prePct + '%';
            document.getElementById('final-post-score').innerText = postPct + '%';
            
            const analysis = document.getElementById('final-analysis');
            let key = '';

            // Syarat Lulus: PostTest 100% ATAU (PostTest >= 66% DAN ada kenaikan dari PreTest)
            // Menggunakan perbandingan postPct > prePct secara presisi sesuai instruksi
            const isPassed = postPct === 100 || (postPct >= 66 && postPct > prePct);

            if (isPassed) {
                key = generateAlchemyHash(ch1_state.userName, ch1_state.preScore, ch1_state.postScore);
                
                analysis.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 8px; color: var(--fg);">Growth Confirmed, ${state.userName}.</h3>
                        <p style="font-size: 13px; color: rgba(13, 13, 13, 0.7); line-height: 1.5;">Lo masuk dengan asumsi, lo keluar dengan pemahaman. Ini yang membedakan lo dari 90% pengguna internet lainnya.</p>
                    </div>
                    
                    <div style="background-color: #FFFFFF; border: 1px solid var(--fg); padding: 24px; border-radius: 2px; position: relative; box-shadow: 2px 2px 0 var(--fg); margin-top: 24px;">
                        <div class="flicker-label" style="position: absolute; top: -12px; right: 16px; background-color: var(--accent-success); color: var(--bg); border: 1px solid var(--fg); border-radius: 2px; padding: 2px 10px; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">GENESIS KEY ACQUIRED</div>
                        
                        <div style="font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.6; color: var(--fg); margin-bottom: 16px; text-align: left;">
                            <div style="border-bottom: 1px dashed var(--fg); padding-bottom: 8px; margin-bottom: 8px;">
                                > SYSTEM DIAGNOSTICS: COMPLETE<br>
                                > CANDIDATE: ${state.userName}
                            </div>
                            <table style="width: 100%; text-align: left; border-collapse: collapse;">
                                <tr>
                                    <th style="border-bottom: 1px solid var(--fg-faint); padding: 4px 0;">METRIC</th>
                                    <th style="border-bottom: 1px solid var(--fg-faint); padding: 4px 0; text-align: right;">SCORE</th>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0;">INITIAL LOGIC (PRE)</td>
                                    <td style="padding: 4px 0; text-align: right;">${Math.round((ch1_state.preScore / 3) * 100)}%</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0;">REVISED LOGIC (POST)</td>
                                    <td style="padding: 4px 0; text-align: right; color: var(--accent-success);">> ${Math.round((ch1_state.postScore / 3) * 100)}%</td>
                                </tr>
                            </table>
                        </div>
                        
                        <p style="font-size: 10px; color: rgba(13, 13, 13, 0.6); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold; text-align: left;">Akses Token Unik:</p>
                        <div style="font-family: 'DM Mono', monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; color: var(--fg); border: 1px dashed var(--fg-faint); padding: 12px; background-color: var(--bg); margin-bottom: 24px; word-wrap: break-word; user-select: all; text-align: left;" id="access-code">${key}</div>
                        
                        <div style="text-align: right; margin-top: 32px; border-top: 1px dashed var(--fg-faint); padding-top: 16px;">
                            <div style="font-family: 'Cormorant Garamond', serif; font-size: 24px; font-style: italic; font-weight: 700; text-transform: uppercase;">THE ALCHEMIST</div>
                            <div style="font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(13,13,13,0.5);">AUTHORIZED DIGITAL HASH</div>
                        </div>
                    </div>
                `;
            } else {
                analysis.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 8px; color: var(--fg);">Foundation Weak, ${state.userName}.</h3>
                        <p style="font-size: 13px; color: rgba(13, 13, 13, 0.7); line-height: 1.5; margin-bottom: 16px;">Lo masih ragu. Fondasi lo belum cukup kuat untuk memegang kunci level selanjutnya. Jangan bangun rumah di atas pasir.</p>
                        <button onclick="location.reload()" class="btn btn-secondary" style="width: 100%;">
                            Ulangi Materi (Reset Protokol)
                        </button>
                    </div>
                `;
            }
        }

        // --- SCROLL REVEAL OBSERVER ---
        document.addEventListener('DOMContentLoaded', () => {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });
        });

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
        // --- STATE MANAGEMENT ---
        let ch2_userState = {
            name: "Guest",
            ch1_pre: 0,
            ch1_post: 0,
            ch2_pre: 0,
            ch2_post: 0,
            qIndex: 0,
            isPre: true
        };

        // --- MINI DEMO LOGIC ---
        function miniQuiz(isCorrect) {
            const el = document.getElementById('mini-quiz-result');
            if(isCorrect) {
                el.innerText = "Benar! Logic: if(input === 2) return true";
                el.className = "text-xs text-[#10b981] font-bold h-4 font-mono";
            } else {
                el.innerText = "Salah. Logic: else return false";
                el.className = "text-xs text-red-500 font-bold h-4 font-mono";
            }
        }

        function miniGame(choice) {
            const target = Math.floor(Math.random() * 3) + 1;
            const el = document.getElementById('mini-game-result');
            
            if(choice === target) {
                el.innerHTML = `Menang! Komputer memilih <span class="text-[#10b981] font-bold">${target}</span>.`;
                el.className = "text-center text-xs text-[#0D0D0D] h-4 font-bold font-mono";
            } else {
                el.innerHTML = `Kalah. Komputer memilih <span class="text-red-500 font-bold">${target}</span>.`;
                el.className = "text-center text-xs text-gray-500 h-4 font-mono";
            }
        }

        function updateGreeting() {
            const el = document.getElementById('dynamic-greeting');
            const hour = new Date().getHours();
            let text = "Halo";
            if(hour < 12) text = "Selamat Pagi";
            else if(hour < 18) text = "Selamat Siang";
            else text = "Selamat Malam";
            
            el.innerText = `"${text}, ${userState.name || 'User'}."`;
        }

        // --- ch2_QUESTIONS DATABASE (Part 2 Focused with 5 Questions) ---
        const ch2_questions = [
            {
                q: "Untuk membuat 'Game Tebak Angka' sederhana, elemen logika apa yang paling krusial?",
                options: [
                    "Warna background yang cerah (CSS).",
                    "Fungsi pengacak angka (Randomizer) dan pembanding (If/Else).",
                    "Koneksi internet super cepat.",
                    "Database SQL yang mahal."
                ],
                correct: 1
            },
            {
                q: "Saat mengambil data dari API, mengapa kita menggunakan pemrograman asinkron (async/await)?",
                options: [
                    "Agar browser tidak freeze selama menunggu respons dari server.",
                    "Agar data terkirim lebih aman dan terenkripsi secara biner.",
                    "Untuk mengubah kode HTML menjadi instruksi CSS secara dinamis.",
                    "Agar memori RAM server tidak terbeban oleh request Client."
                ],
                correct: 0
            },
            {
                q: "Fungsi/objek JavaScript mana yang digunakan untuk mengirim HTTP request secara asinkron di browser?",
                options: [
                    "JSON.stringify()",
                    "Math.random()",
                    "fetch()",
                    "atob()"
                ],
                correct: 2
            },
            {
                q: "Di dalam Caesar Cipher (Shift +1), bagaimana cara mengembalikan pesan asli yang telah dienkripsi?",
                options: [
                    "Menggeser karakter dengan operasi charCodeAt(i) - 1.",
                    "Menambahkan spasi di setiap karakter kata.",
                    "Mengalikan kode biner karakter dengan index array.",
                    "Menggunakan fungsi btoa() tanpa modifikasi character code."
                ],
                correct: 0
            },
            {
                q: "Bagaimana cara menangani potensi error pada fetch() request agar aplikasi tidak crash?",
                options: [
                    "Membungkus kode di dalam block statement try...catch.",
                    "Mengubah semua variabel menjadi const.",
                    "Melakukan reload halaman secara otomatis.",
                    "Menghapus parameter endpoint API."
                ],
                correct: 0
            }
        ];

        // --- GATE LOGIC (DECRYPTION) ---
        function ch2_unlockGate() {
            const input = document.getElementById('genesis-key-input').value.trim().replace(/-/g, '');
            const errorMsg = document.getElementById('ch2-gate-error');
            
            if (!input) {
                errorMsg.classList.remove('hidden');
                return;
            }

            try {
                // 1. Base64 Decode
                const decodedStr = atob(input);
                
                // 2. De-obfuscate (Shift char code -1)
                let jsonStr = "";
                for (let i = 0; i < decodedStr.length; i++) {
                    jsonStr += String.fromCharCode(decodedStr.charCodeAt(i) - 1);
                }

                // 3. Parse JSON
                const data = JSON.parse(jsonStr);

                // Validasi struktur data dasar
                if (!data.n || data.s1 === undefined || data.s2 === undefined) {
                    throw new Error("Invalid Structure");
                }

                // Load Data
                ch2_userState.name = data.n;
                ch2_userState.ch1_pre = data.s1;
                ch2_userState.ch1_post = data.s2;

                // Update UI
                document.getElementById('user-display-name').innerText = ch2_userState.name;
                document.getElementById('p1-pre').innerText = Math.round((ch2_userState.ch1_pre/3)*100);
                document.getElementById('p1-post').innerText = Math.round((ch2_userState.ch1_post/3)*100);

                // Start Greeting Clock
                updateGreeting();
                setInterval(updateGreeting, 60000); // Update every minute

                // Transition
                document.getElementById('ch2-gate-section').classList.add('hidden');
                document.getElementById('main-content').classList.remove('hidden');
                window.scrollTo(0, 0);

            } catch (e) {
                console.error(e);
                errorMsg.innerText = "Error: Kunci Invalid. Pastikan menyalin dari Chapter 1 dengan benar.";
                errorMsg.classList.remove('hidden');
            }
        }

        // --- PRE-TEST LOGIC ---
        function ch2_startPreTest() {
            document.getElementById('pretest-intro').classList.add('hidden');
            document.getElementById('pretest-container').classList.remove('hidden');
            ch2_renderQ();
        }

        // --- RENDER ch2_QUESTIONS ---
        function ch2_renderQ() {
            const container = ch2_userState.isPre ? 'pre' : 'post';
            const q = ch2_questions[userState.qIndex];
            
            document.getElementById(`${container}-q-num`).innerText = ch2_userState.qIndex + 1;
            document.getElementById(`${container}-q-text`).innerText = q.q;
            
            const opts = document.getElementById(`${container}-options`);
            opts.innerHTML = '';
            
            q.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = "btn-ghost w-full text-left p-4 text-xs font-mono group flex justify-between items-center";
                btn.innerHTML = `<span>${opt}</span> <span class="opacity-0 group-hover:opacity-100 text-inherit font-bold transition-opacity">→</span>`;
                btn.onclick = () => ch2_answer(i);
                opts.appendChild(btn);
            });
        }

        function ch2_answer(idx) {
            if (idx === ch2_questions[userState.qIndex].correct) {
                if (ch2_userState.isPre) ch2_userState.ch2_pre++; else ch2_userState.ch2_post++;
            }
            
            ch2_userState.qIndex++;
            if (ch2_userState.qIndex < ch2_questions.length) {
                ch2_renderQ();
            } else {
                ch2_finishSection();
            }
        }

        function ch2_finishSection() {
            if (ch2_userState.isPre) {
                // Unlock Materi
                document.getElementById('ch2-pretest-section').innerHTML = `
                    <div class="p-6 text-center border border-[#10b981] bg-[#a7f3d0]/30 rounded-[2px] shadow-[2px_2px_0_#0d0d0d]">
                        <h3 class="text-[#0d0d0d] font-bold mb-2 font-serif text-lg">Kalibrasi Selesai</h3>
                        <p class="text-gray-700 text-sm font-mono">Sekarang, mari kita bedah mesinnya di bawah.</p>
                    </div>
                `;
                const materi = document.getElementById('ch2-materi-section');
                materi.classList.remove('opacity-20', 'blur-sm', 'pointer-events-none');
                
                // Activate Post Test trigger at bottom
                document.getElementById('ch2-posttest-section').classList.remove('hidden');

                setTimeout(() => materi.scrollIntoView({behavior: 'smooth'}), 500);
            } else {
                // Show Result
                document.getElementById('ch2-posttest-section').classList.add('hidden');
                document.getElementById('ch2-result-section').classList.remove('hidden');
                ch2_renderFinalResult();
            }
        }

        // --- SIMULATED API LOGIC ---
        function fetchSimulatedData() {
            const btn = document.getElementById('api-btn');
            const resultBox = document.getElementById('api-result');
            const packet = document.getElementById('api-packet');
            const statusText = document.getElementById('api-status-text');
            
            btn.disabled = true;
            btn.classList.add('opacity-50', 'pointer-events-none');
            resultBox.innerText = "// Menghubungkan...";
            statusText.innerText = "ASYNC FETCH() STARTED...";
            statusText.className = "text-[9px] font-mono text-amber-600 mt-2 font-bold tracking-wider flicker-effect";
            packet.classList.remove('hidden');
            
            // Animation: Packet goes Client -> Server
            packet.style.left = '0%';
            packet.style.transition = 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            setTimeout(() => {
                packet.style.left = 'calc(100% - 16px)';
                statusText.innerText = "HTTP REQUEST SENT (PENDING)...";
            }, 50);

            setTimeout(() => {
                // Server Processing
                statusText.innerText = "SERVER PROCESSING (PROMISE)...";
                statusText.className = "text-[9px] font-mono text-blue-600 mt-2 font-bold tracking-wider";
                resultBox.innerText = "try { parseRequest(); } catch(e) {}";
            }, 1250);

            setTimeout(() => {
                // Packet Return
                statusText.innerText = "SENDING RESPONSE BACK...";
                statusText.className = "text-[9px] font-mono text-[#10b981] mt-2 font-bold tracking-wider";
                packet.style.transition = 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                packet.style.left = '0%';
            }, 2200);

            setTimeout(() => {
                // Data Received
                const quotes = [
                    '"Stay hungry, stay foolish."',
                    '"Code is poetry."',
                    '"Simplicity is the ultimate sophistication."',
                    '"Hello World."',
                    '"Logic will get you from A to B. Imagination will take you everywhere."'
                ];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                
                resultBox.innerHTML = `<span class="text-[#10b981] font-bold">200 OK (JSON):</span><br>{ "quote": "${randomQuote}" }`;
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'pointer-events-none');
                statusText.innerText = "SUCCESS (RESOLVED)";
                statusText.className = "text-[9px] font-mono text-[#10b981] mt-2 font-bold tracking-wider";
                packet.classList.add('hidden');
            }, 3400);
        }

        // --- TIME MACHINE PROMISES LOGIC ---
        function updateTimeMachine(step) {
            const cs = document.getElementById('tm-callstack');
            const api = document.getElementById('tm-webapi');
            const queue = document.getElementById('tm-queue');
            const exp = document.getElementById('tm-explanation');
            
            if(!cs || !api || !queue || !exp) return;

            cs.innerHTML = '';
            api.innerHTML = '';
            queue.innerHTML = '';
            
            let htmlStack = '';
            let htmlApi = '';
            let htmlQueue = '';
            let textExp = '';
            
            const createBox = (text, color) => `<div class="bg-${color}-100 border border-[#0D0D0D] p-1 text-center text-[10px] font-bold">${text}</div>`;
            const createBoxDark = (text) => `<div class="bg-[#0D0D0D] text-[#10b981] border border-[#0D0D0D] p-1 text-center text-[10px] font-bold">${text}</div>`;
            
            step = parseInt(step);
            
            if (step === 0) {
                textExp = "0. Skrip mulai dieksekusi dari baris pertama.";
            } else if (step === 1) {
                htmlStack = createBox("console.log('1')", "white");
                textExp = "1. Tugas sinkron console.log('1') dieksekusi di Call Stack. Output: 1.";
            } else if (step === 2) {
                htmlStack = createBox("setTimeout(..., 0)", "white");
                htmlApi = createBox("Timer: 0ms", "yellow");
                textExp = "2. setTimeout masuk Call Stack, tapi karena asinkron, ia langsung diserahkan ke Web API untuk menghitung waktu (timer).";
            } else if (step === 3) {
                htmlApi = createBox("Timer: 0ms", "yellow");
                htmlStack = createBox("Promise.then", "white");
                textExp = "3. Promise diselesaikan, callback dari `.then()` tidak langsung jalan, melainkan dilempar ke Microtask Queue.";
                htmlQueue = createBoxDark("Microtask: log('3')");
            } else if (step === 4) {
                htmlApi = createBox("Timer Done", "gray");
                htmlStack = createBox("console.log('4')", "white");
                htmlQueue = createBoxDark("Microtask: log('3')") + createBox("Macrotask: log('2')", "yellow");
                textExp = "4. Timer Web API selesai dan melempar callback ke Macrotask Queue. Sementara itu Call Stack mengeksekusi console.log('4'). Output: 4.";
            } else if (step === 5) {
                htmlQueue = createBox("Macrotask: log('2')", "yellow");
                htmlStack = createBoxDark("console.log('3')");
                textExp = "5. Call Stack kosong! Event Loop mengecek Microtask Queue duluan. log('3') masuk Call Stack dan dieksekusi. Output: 3.";
            } else if (step === 6) {
                htmlStack = createBox("console.log('2')", "yellow");
                textExp = "6. Microtask kosong. Event Loop mengambil tugas dari Macrotask Queue. log('2') masuk Call Stack dan dieksekusi. Output: 2. Selesai.";
            }
            
            cs.innerHTML = htmlStack;
            api.innerHTML = htmlApi;
            queue.innerHTML = htmlQueue;
            exp.innerHTML = "<strong>Penjelasan:</strong> <br>" + textExp;
        }
        
        setTimeout(() => updateTimeMachine(0), 100); // init later

        // --- API CONTROL ROOM LOGIC ---
        async function runSimulatedNetworkFetch() {
            const btn = document.getElementById('api-btn-simulate');
            const delay = parseInt(document.getElementById('api-delay').value);
            const errProb = parseInt(document.getElementById('api-error').value);
            const logBox = document.getElementById('api-term-log');
            const statusLabel = document.getElementById('api-term-status');
            const progBar = document.getElementById('api-term-progress');
            
            btn.disabled = true;
            btn.classList.add('opacity-50');
            logBox.innerHTML = "> Fetching data from https://api.alchemist.com/secret...\n";
            statusLabel.innerText = "Connecting...";
            statusLabel.className = "text-yellow-500 animate-pulse";
            progBar.style.transitionDuration = delay + "ms";
            progBar.style.width = "100%";
            
            try {
                await new Promise(resolve => setTimeout(resolve, delay));
                
                const rand = Math.random() * 100;
                if (rand < errProb) {
                    throw new Error("500 Internal Server Error / Network Timeout");
                }
                
                logBox.innerHTML += `<span class="text-[#10b981]">> 200 OK</span>\n> Payload: { "status": "success", "data": "Tembaga menjadi Emas" }\n> Operation Completed.`;
                statusLabel.innerText = "Success";
                statusLabel.className = "text-[#10b981]";
                
            } catch (error) {
                logBox.innerHTML += `<span class="text-red-500">> ERR: ${error.message}</span>\n> Catch block executed.\n> Retrying is recommended.`;
                statusLabel.innerText = "Failed";
                statusLabel.className = "text-red-500";
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-50');
                setTimeout(() => {
                    progBar.style.transitionDuration = "0ms";
                    progBar.style.width = "0%";
                }, 500);
            }
        }

        // --- ENIGMA CONVEYOR BELT LOGIC ---
        async function runEnigma() {
            const inputTxt = document.getElementById('enigma-input').value.toUpperCase();
            const shiftVal = parseInt(document.getElementById('enigma-shift').value);
            const inBelt = document.getElementById('enigma-in-belt');
            const outBelt = document.getElementById('enigma-out-belt');
            const opNode = document.getElementById('enigma-op-node');
            
            inBelt.innerHTML = '';
            outBelt.innerHTML = '';
            
            if(!inputTxt) return;
            
            inputTxt.split('').forEach(char => {
                const div = document.createElement('div');
                div.className = 'belt-item';
                div.innerText = char;
                inBelt.appendChild(div);
            });
            
            opNode.innerText = shiftVal >= 0 ? `+${shiftVal}` : shiftVal;
            
            const items = inBelt.querySelectorAll('.belt-item');
            for(let i=0; i<items.length; i++) {
                items[i].classList.add('active');
                await new Promise(r => setTimeout(r, 400));
                
                const code = items[i].innerText.charCodeAt(0);
                let newCode = code;
                if (code >= 65 && code <= 90) {
                    newCode = ((code - 65 + shiftVal) % 26);
                    if (newCode < 0) newCode += 26;
                    newCode += 65;
                }
                const newChar = String.fromCharCode(newCode);
                
                items[i].classList.remove('active');
                items[i].classList.add('processed');
                
                const outDiv = document.createElement('div');
                outDiv.className = 'belt-item processed';
                outDiv.innerText = newChar;
                outBelt.appendChild(outDiv);
                
                await new Promise(r => setTimeout(r, 100));
            }
        }

        // --- POST-TEST START ---
        function ch2_startPostTest() {
            ch2_userState.isPre = false;
            ch2_userState.qIndex = 0;
            document.getElementById('posttest-intro').classList.add('hidden');
            document.getElementById('posttest-container').classList.remove('hidden');
            ch2_renderQ();
        }

        // --- ENCRYPTION LOGIC (EXODUS KEY) ---
        function generateExodusKey() {
            // Pack Data: Nama, Ch1 Scores, Ch2 Scores, Timestamp
            const payload = {
                n: ch2_userState.name,
                c1: [userState.ch1_pre, ch2_userState.ch1_post],
                c2: [userState.ch2_pre, ch2_userState.ch2_post],
                rank: "ALCHEMIST_L2",
                t: Date.now()
            };

            const jsonStr = JSON.stringify(payload);
            
            // Client-side simple obfuscation (Shift +1)
            let obfuscated = "";
            for (let i = 0; i < jsonStr.length; i++) {
                obfuscated += String.fromCharCode(jsonStr.charCodeAt(i) + 1);
            }

            const encoded = btoa(obfuscated).replace(/=/g, '');
            const chunks = encoded.match(/.{1,4}/g);
            return chunks ? chunks.join('-') : encoded;
        }

        function ch2_renderFinalResult() {
            const ch2_score = Math.round((ch2_userState.ch2_post / ch2_questions.length) * 100);
            
            document.getElementById('final-s1').innerText = Math.round((ch2_userState.ch1_post/3)*100) + "%";
            document.getElementById('final-s2').innerText = ch2_score + "%";

            const analysis = document.getElementById('final-analysis');
            let key = '';

            const passed = ch2_score >= 60; // 3 out of 5 is 60%

            if (passed) {
                key = generateExodusKey();
                analysis.innerHTML = `
                    <p class="text-[var(--fg)] font-serif font-bold text-xl mb-2">AKSES LEVEL 3 TERBUKA.</p>
                    <p class="mb-6 text-sm text-[var(--fg)] leading-relaxed font-mono">Lo sekarang paham bahwa HTML bisa 'berpikir' (Logic), 'berbicara' (API) secara asinkron, dan menyandikan datanya (Caesar Cipher). Lo bukan lagi sekadar menyusun bata, lo sedang merakit mesin digital.</p>
                    
                    <div class="neo-card bg-[#FAFAFA] p-6 relative group mt-6 break-words">
                        <div class="absolute top-0 right-0 bg-[var(--fg)] text-[var(--bg-card, #FFFFFF)] px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider border-l border-b border-[var(--fg)]">EXODUS KEY</div>
                        
                        <p class="text-xs text-[var(--fg)] font-mono mb-2 uppercase tracking-widest">SIMPAN KUNCI INI:</p>
                        <div class="font-mono text-lg tracking-widest text-[var(--fg)] select-all cursor-text mb-4 break-all border border-dashed border-[var(--fg-faint)] p-4 bg-[#FFFFFF] hover:bg-[var(--fg)] hover:text-[#FFFFFF] transition-all duration-0">${key}</div>
                        
                        <div class="border-t border-[var(--fg-faint)] pt-3 mt-4 text-[10px] font-mono text-[var(--fg)] flex justify-between uppercase items-center">
                            <span>Hash Code Verified</span>
                            <span class="font-serif italic font-bold text-sm">The Architect</span>
                        </div>
                    </div>
                `;
            } else {
                analysis.innerHTML = `
                    <p class="text-[var(--fg)] font-serif font-bold text-xl mb-2">LOGIC ERROR.</p>
                    <p class="mb-4 text-sm text-[var(--fg)] font-mono">Pemahaman lo tentang API, State, atau Sandi Caesar masih kabur. Jangan memaksa lanjut jika pondasi retak.</p>
                    <button onclick="location.reload()" class="btn-ghost text-xs px-4 py-2 font-mono mt-2">
                        RESET PROTOKOL CHAPTER 2
                    </button>
                `;
            }
        }
        
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
        
        const original_ch2_renderFinalResult = ch2_renderFinalResult;
        ch2_renderFinalResult = function() {
            original_ch2_renderFinalResult();
            const ch2_postPct = Math.round((ch2_userState.ch2_post / 3) * 100);
            if(ch2_postPct >= 66) {
                appState.ch2_passed = true;
                appState.ch2_pre = ch2_userState.ch2_pre;
                appState.ch2_post = ch2_userState.ch2_post;
                saveAppState();
                syncUIState();
                setTimeout(() => {
                    switchTab('ch3');
                }, 2500);
            }
        };

        // --- CHAPTER 3 JS ---
        // --- GLOBAL STATE ---
        let ch3_userState = {
            name: "Alchemist",
            ch1_scores: [0, 0], // pre, post
            ch2_scores: [0, 0], // pre, post
            ch3_pre: 0,
            ch3_post: 0,
            qIndex: 0,
            isPre: true
        };

        // --- ch3_QUESTIONS DATA (5 ch3_QUESTIONS ABOUT ADVANCED PROMPTING) ---
        const ch3_questions = [
            {
                q: "Mengapa kita sebaiknya menggunakan 'Reasoning Model' (seperti o1, o3-mini, atau DeepSeek R1) untuk tugas pemrograman yang rumit?",
                options: [
                    "Karena responsnya instan tanpa jeda sama sekali.",
                    "Karena mereka menggunakan Chain of Thought (proses berpikir internal) untuk menyusun modul logika dan mengurangi halusinasi kode.",
                    "Karena mereka gratis dan tidak membutuhkan koneksi internet sama sekali.",
                    "Karena model reasoning secara otomatis menghapus file di laptop kita jika salah ketik."
                ],
                correct: 1
            },
            {
                q: "Apa esensi mendasar dari teknik 'Few-shot prompting' dalam prompt engineering?",
                options: [
                    "Menuliskan prompt sesingkat mungkin agar AI tidak kehabisan memori token.",
                    "Menyisipkan satu atau beberapa contoh pasangan input-output yang diinginkan sebelum meminta AI menyelesaikan instruksi baru.",
                    "Mengunggah file PDF dokumentasi setebal 1000 halaman tanpa instruksi tambahan.",
                    "Menyuruh AI mematikan fitur auto-complete pada editor teks lokal."
                ],
                correct: 1
            },
            {
                q: "Bagaimana cara paling andal untuk memastikan model AI mengembalikan data terstruktur dalam format JSON yang bersih?",
                options: [
                    "Cukup mengetik 'Jangan lupa kirim JSON ya' di akhir percakapan.",
                    "Menggunakan fitur native JSON Mode/Structured Output, memberikan skema target secara kaku, atau menyuruh AI membungkus responnya dalam tag custom.",
                    "Menuliskan seluruh prompt dengan menggunakan huruf kapital (Caps Lock).",
                    "Mengubah nama ekstensi file program kita dari .html menjadi .json sebelum diunggah."
                ],
                correct: 1
            },
            {
                q: "Apa perbedaan mendasar antara 'System Instructions' dan 'User Message'?",
                options: [
                    "System Instructions mengatur parameter fundamental, batasan, dan persona model di tingkat root secara konsisten, sedangkan User Message berisi prompt dinamis per percakapan.",
                    "System Instructions ditulis oleh sistem komputer, sedangkan User Message ditulis oleh browser secara otomatis.",
                    "System Instructions hanya bisa dibaca oleh aplikasi Notepad, sedangkan User Message wajib dibaca oleh VS Code.",
                    "Tidak ada perbedaan sama sekali, keduanya memiliki prioritas pengolahan yang setara di dalam memori AI."
                ],
                correct: 0
            },
            {
                q: "Di bawah ini adalah langkah yang benar dalam metode 'Notepad offline deployment', KECUALI...",
                options: [
                    "Menyalin kode HTML utuh yang dihasilkan AI ke editor teks bawaan seperti Notepad.",
                    "Menyimpan file dengan nama berakhiran .html.",
                    "Pada opsi Save as type di Notepad, memilih All Files (*.*).",
                    "Mengunggah berkas HTML tersebut ke cloud VPS berbayar terlebih dahulu agar bisa dieksekusi secara lokal."
                ],
                correct: 3
            }
        ];

        // --- GATE DECRYPTION FROM CHAPTER 2 ---
        function ch3_unlockGate() {
            const input = document.getElementById('exodus-key-input').value.trim().replace(/-/g, '');
            const errorMsg = document.getElementById('ch3-gate-error');
            const gateCard = document.querySelector('#gate-section .card');

            if (!input) {
                showErrorGate("Kunci eksodus tidak boleh kosong.");
                return;
            }

            try {
                // 1. Base64 Decode
                const decodedStr = atob(input);

                // 2. De-obfuscate (Shift char code -1)
                let jsonStr = "";
                for (let i = 0; i < decodedStr.length; i++) {
                    jsonStr += String.fromCharCode(decodedStr.charCodeAt(i) - 1);
                }

                // 3. Parse JSON
                // Expected: { n, c1:[pre,post], c2:[pre,post] }
                const data = JSON.parse(jsonStr);

                if (!data.n || !data.c1 || !data.c2) {
                    throw new Error("Invalid structure");
                }

                // Load to state
                ch3_userState.name = data.n;
                ch3_userState.ch1_scores = data.c1;
                ch3_userState.ch2_scores = data.c2;

                // Update UI Display
                document.getElementById('user-display-name').innerText = ch3_userState.name;

                // Hitung rata-rata kuis lama (Chapter 1 & Chapter 2 menggunakan pembagi 6 karena masing-masing ada 3 pertanyaan, total pre+post = 6)
                const s1_avg_val = Math.round(((data.c1[0] + data.c1[1]) / 6) * 100);
                const s2_avg_val = Math.round(((data.c2[0] + data.c2[1]) / 6) * 100);

                document.getElementById('s1-avg').innerText = s1_avg_val;
                document.getElementById('s2-avg').innerText = s2_avg_val;

                // Transition to main content
                document.getElementById('ch3-gate-section').classList.add('hidden');
                document.getElementById('main-content').classList.remove('hidden');
                window.scrollTo(0, 0);

            } catch (e) {
                console.error(e);
                showErrorGate("Exodus Key tidak valid. Pastikan lo menyalin seluruh kode Exodus Key dengan benar.");
            }
        }

        function showErrorGate(msg) {
            const errorMsg = document.getElementById('ch3-gate-error');
            const gateCard = document.querySelector('#gate-section .card');
            
            errorMsg.innerText = msg;
            errorMsg.classList.remove('hidden');
            
            // Trigger shake effect
            gateCard.classList.remove('shake-trigger');
            void gateCard.offsetWidth; // Trigger reflow
            gateCard.classList.add('shake-trigger');
        }

        // --- PRETEST LOGIC ---
        function ch3_startPreTest() {
            document.getElementById('pretest-intro').classList.add('hidden');
            document.getElementById('pretest-container').classList.remove('hidden');
            ch3_renderQ();
        }

        function ch3_renderQ() {
            const container = ch3_userState.isPre ? 'pre' : 'post';
            const qData = ch3_questions[userState.qIndex];

            document.getElementById(`${container}-q-num`).innerText = ch3_userState.qIndex + 1;
            document.getElementById(`${container}-q-text`).innerText = qData.q;

            const optsDiv = document.getElementById(`${container}-options`);
            optsDiv.innerHTML = '';

            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span>${opt}</span><span class="arrow">&rarr;</span>`;
                btn.onclick = () => ch3_answer(idx);
                optsDiv.appendChild(btn);
            });
        }

        function ch3_answer(selectedIdx) {
            const correctIdx = ch3_questions[userState.qIndex].correct;
            if (selectedIdx === correctIdx) {
                if (ch3_userState.isPre) {
                    ch3_userState.ch3_pre++;
                } else {
                    ch3_userState.ch3_post++;
                }
            }

            ch3_userState.qIndex++;
            if (ch3_userState.qIndex < ch3_questions.length) {
                ch3_renderQ();
            } else {
                ch3_finishSection();
            }
        }

        function ch3_finishSection() {
            if (ch3_userState.isPre) {
                // Selesai pretest
                document.getElementById('ch3-pretest-section').innerHTML = `
                    <div style="text-align: center; padding: 10px 0;">
                        <span class="badge" style="background-color: var(--accent-light);">Kalibrasi Awal Selesai</span>
                        <h3 style="margin-top:5px; margin-bottom:10px;">Akses Materi Ascension Terbuka!</h3>
                        <p style="font-size:0.85rem; margin-bottom:0;">Baca dan pahami materi di bawah ini secara saksama. Ujian Akhir menunggu di bagian paling bawah halaman.</p>
                    </div>
                `;
                
                // Unlock materi
                const materi = document.getElementById('ch3-materi-section');
                materi.classList.remove('blur-locked');
                
                // Tampilkan post-test trigger di bawah
                document.getElementById('ch3-posttest-section').classList.remove('hidden');

                // Smooth scroll ke materi
                setTimeout(() => {
                    materi.scrollIntoView({ behavior: 'smooth' });
                }, 300);

            } else {
                // Selesai posttest
                document.getElementById('ch3-posttest-section').classList.add('hidden');
                document.getElementById('ch3-result-section').classList.remove('hidden');
                ch3_renderFinalResult();
                
                // Smooth scroll ke hasil
                setTimeout(() => {
                    document.getElementById('ch3-result-section').scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }

        // --- POST TEST LOGIC ---
        function ch3_startPostTest() {
            ch3_userState.isPre = false;
            ch3_userState.qIndex = 0;
            document.getElementById('posttest-intro').classList.add('hidden');
            document.getElementById('posttest-container').classList.remove('hidden');
            ch3_renderQ();
        }

        // --- ENCRYPTION LOGIC FOR PHILOSOPHER'S STONE ---
        function generatePhilosopherStone(rank) {
            const payload = {
                n: ch3_userState.name,
                c1: ch3_userState.ch1_scores,
                c2: ch3_userState.ch2_scores,
                c3: [userState.ch3_pre, ch3_userState.ch3_post],
                rank: rank,
                t: Date.now()
            };

            const jsonStr = JSON.stringify(payload);

            // Simple obfuscation (Shift +1)
            let obfuscated = "";
            for (let i = 0; i < jsonStr.length; i++) {
                obfuscated += String.fromCharCode(jsonStr.charCodeAt(i) + 1);
            }

            const encoded = btoa(obfuscated).replace(/=/g, '');
            // Formating XXXX-XXXX-XXXX-XXXX
            const chunks = encoded.match(/.{1,4}/g);
            return chunks ? chunks.join('-') : encoded;
        }

        // --- RENDER FINAL GRADE & KEY ---
        function ch3_renderFinalResult() {
            const ch3_questionsCount = ch3_questions.length;
            
            // Hitung rata-rata tiap chapter
            const s1_avg = ((ch3_userState.ch1_scores[0] + ch3_userState.ch1_scores[1]) / 6) * 100;
            const s2_avg = ((ch3_userState.ch2_scores[0] + ch3_userState.ch2_scores[1]) / 6) * 100;
            const s3_avg = ((ch3_userState.ch3_pre + ch3_userState.ch3_post) / (questionsCount * 2)) * 100;

            const total_avg = (s1_avg + s2_avg + s3_avg) / 3;

            // Render persentase Chapter 3 ke UI
            const s3_post_pct = Math.round((ch3_userState.ch3_post / ch3_questionsCount) * 100);
            document.getElementById('final-s1').innerText = Math.round((ch3_userState.ch1_scores[1] / 3) * 100) + "%";
            document.getElementById('final-s2').innerText = Math.round((ch3_userState.ch2_scores[1] / 3) * 100) + "%";
            document.getElementById('final-s3').innerText = s3_post_pct + "%";

            const title = document.getElementById('final-rank-title');
            const subtitle = document.getElementById('final-rank-subtitle');
            const analysis = document.getElementById('final-analysis');
            const resultBox = document.getElementById('ch3-result-section');

            let rank = "";
            let message = "";
            let isSuccess = false;

            if (total_avg >= 90) {
                rank = "VERIFIED_HUMAN_ALPHA";
                title.innerText = "VERIFIED HUMAN ALPHA";
                subtitle.innerText = "Grade: A (Sentient Architect)";
                message = "Luar biasa. Lo membuktikan bahwa otak lo bukan cuma kumpulan sirkuit memori basi, tapi lo punya pemahaman arsitektur prompt yang sangat matang. AI di tangan lo akan menjadi senjata manipulasi kode yang mematikan. Ini segel kelulusan lo, simpan baik-baik.";
                isSuccess = true;
            } else if (total_avg >= 70) {
                rank = "VERIFIED_HUMAN_BETA";
                title.innerText = "VERIFIED HUMAN BETA";
                subtitle.innerText = "Grade: B (Standard Prompt Operator)";
                message = "Lo lulus, tapi performa lo masih standar. Lo bisa ngasih perintah dasar tapi belum sepenuhnya memaksimalkan kendali sistem. Terus asah logika lo. Ini kunci kelulusan lo, jangan sampai hilang.";
                isSuccess = true;
            } else {
                rank = "UNVERIFIED_ORGANISM";
                title.innerText = "UNVERIFIED ORGANISM";
                subtitle.innerText = "Grade: F (Waste of Carbon)";
                message = "Menyedihkan. Hampir di semua kuis lo kebingungan. Lo kayaknya butuh lebih banyak latihan daripada sekadar copy-paste tanpa mikir. Tapi, karena The Alchemist itu murah hati, nih gue kasih kunci datanya. Belajar lagi sana.";
                isSuccess = false;
            }

            if (!isSuccess) {
                resultBox.style.backgroundColor = "#fee2e2";
                resultBox.style.borderColor = "#ef4444";
            }

            const finalKey = generatePhilosopherStone(rank);

            analysis.innerHTML = `
                <p style="font-style: italic; font-size: 1rem; margin-bottom: 20px; font-weight: 500;">"${message}"</p>
                <div style="margin-top: 25px;">
                    <label style="font-size: 0.75rem; font-weight: bold; color: var(--fg);">PHILOSOPHER'S STONE EXODUS KEY</label>
                    <div class="key-box">${finalKey}</div>
                    <p style="font-size: 0.7rem; color: #555; margin-top: 10px; font-style: italic;">
                        *Salin seluruh kode di atas. Kunci ini merangkum seluruh rekam jejak lo dari Chapter 1 sampai Chapter 3 secara permanen. Lo bisa menggunakannya di portal The Alchemist berikutnya.
                    </p>
                </div>
            `;
        }

        // --- INTERACTIVE FEATURES LOGIC ---
        
        // 1. Token Visualizer
        const tempSlider = document.getElementById('temp-slider');
        const tempVal = document.getElementById('temp-val');
        const chartContainer = document.getElementById('token-chart');
        
        // Base unnormalized probabilities for words: [pasar, sekolah, rumah, kerja, bulan]
        const baseLogits = [2.5, 2.0, 1.5, 1.0, -1.0];
        const labels = ['pasar', 'sekolah', 'rumah', 'kerja', 'bulan'];
        
        function updateChart() {
            if (!tempSlider) return;
            const T = parseFloat(tempSlider.value);
            tempVal.innerText = T.toFixed(1);
            
            // Softmax with temperature
            const maxLogit = Math.max(...baseLogits);
            const exps = baseLogits.map(l => Math.exp((l - maxLogit) / T));
            const sumExps = exps.reduce((a, b) => a + b, 0);
            const probs = exps.map(e => e / sumExps);
            
            chartContainer.innerHTML = '';
            probs.forEach((p, i) => {
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = Math.max((p * 100), 5) + '%';
                
                // Color change based on prob
                if (p > 0.4) bar.style.backgroundColor = '#22c55e'; // green
                else if (p > 0.1) bar.style.backgroundColor = '#3b82f6'; // blue
                else bar.style.backgroundColor = '#ef4444'; // red
                
                bar.innerHTML = `<span style="margin-bottom: 5px;">${(p*100).toFixed(1)}%</span>
                                 <span class="chart-label">${labels[i]}</span>`;
                chartContainer.appendChild(bar);
            });
        }
        if (tempSlider) {
            tempSlider.addEventListener('input', updateChart);
            updateChart(); // init
        }

        // 2. Prompt Chain Builder
        if (typeof Sortable !== 'undefined') {
            const availableNodes = document.getElementById('available-nodes');
            const activeNodes = document.getElementById('active-nodes');
            if (availableNodes && activeNodes) {
                new Sortable(availableNodes, {
                    group: 'shared',
                    animation: 150,
                    sort: false // Don't sort available nodes
                });
                new Sortable(activeNodes, {
                    group: 'shared',
                    animation: 150
                });
            }
        }

        // 3. Hacker Terminal Simulator
        const termInput = document.getElementById('term-input');
        const termOutput = document.getElementById('term-output');
        let termState = { temp: 0.7 };
        let isTyping = false;

        function typeOutput(text, callback) {
            isTyping = true;
            let i = 0;
            const line = document.createElement('div');
            termOutput.appendChild(line);
            
            function typeChar() {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    termOutput.parentElement.scrollTop = termOutput.parentElement.scrollHeight;
                    setTimeout(typeChar, 20);
                } else {
                    isTyping = false;
                    if (callback) callback();
                }
            }
            typeChar();
        }

        if (termInput) {
            termInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !isTyping) {
                    const cmd = this.value.trim();
                    this.value = '';
                    
                    if (!cmd) return;
                    
                    const echo = document.createElement('div');
                    echo.style.color = '#fff';
                    echo.textContent = `root@alchemist:~# ${cmd}`;
                    termOutput.appendChild(echo);
                    
                    const parts = cmd.split(' ');
                    const base = parts[0].toLowerCase();
                    
                    if (base === 'help') {
                        typeOutput("Commands:\n  help        - Show this message\n  set temp <v>- Set model temperature (0.1 - 2.0)\n  prompt <msg>- Send prompt to simulated LLM");
                    } else if (base === 'set' && parts[1] === 'temp') {
                        const v = parseFloat(parts[2]);
                        if (!isNaN(v)) {
                            termState.temp = v;
                            typeOutput(`System temperature set to ${v.toFixed(1)}`);
                        } else {
                            typeOutput("Error: Invalid temperature value.");
                        }
                    } else if (base === 'prompt') {
                        const promptMsg = parts.slice(1).join(' ');
                        if (!promptMsg) {
                            typeOutput("Error: Prompt cannot be empty.");
                            return;
                        }
                        
                        let response = "Processing...\n";
                        if (termState.temp > 1.5) {
                            response += "W4kTu AdAlah I1usi. K0d3 aDalAh K4caU. Zzz...";
                        } else if (termState.temp < 0.3) {
                            response += "Pesan diterima. Melaksanakan instruksi secara kaku.";
                        } else {
                            response += "Sintesis berhasil. Pola bahasa terdeteksi. Merespons secara optimal.";
                        }
                        typeOutput(`[LLM Response (Temp: ${termState.temp.toFixed(1)})]: ${response}`);
                    } else {
                        typeOutput(`Command not found: ${base}`);
                    }
                }
            });
        }
        
        // Auto-unlock gate for Ch3
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
        
        const original_ch3_renderFinalResult = ch3_renderFinalResult;
        ch3_renderFinalResult = function() {
            original_ch3_renderFinalResult();
            const ch3_postPct = Math.round((ch3_userState.ch3_post / 5) * 100);
            if(ch3_postPct >= 60) {
                appState.ch3_passed = true;
                appState.ch3_pre = ch3_userState.ch3_pre;
                appState.ch3_post = ch3_userState.ch3_post;
                
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
        let radarChart = null;
        let tiltInstance = null;

        window.addEventListener('DOMContentLoaded', () => {
            updateZoom(0.75);
        });

        function updateZoom(zoomVal) {
            const wrapper = document.getElementById('transcript-scale-wrapper');
            const frame = document.getElementById('document-frame');
            
            wrapper.style.transform = `scale(${zoomVal})`;
            document.getElementById('zoom-value').innerText = `${Math.round(zoomVal * 100)}%`;
            
            const a4HeightPx = 1118.7;
            const containerPadding = 48; 
            frame.style.height = `${(a4HeightPx * zoomVal) + containerPadding}px`;
        }

        function legacy_unlockTranscript() {
            const inputEl = document.getElementById('legacy-master-key-input');
            const rawInput = inputEl.value.trim();
            const cleanInput = rawInput.replace(/-/g, ''); 
            const errorMsg = document.getElementById('legacy-gate-error');
            
            if (!cleanInput) { 
                errorMsg.style.display = 'block'; 
                return; 
            }

            try {
                const decodedStr = atob(cleanInput);
                let jsonStr = "";
                for (let i = 0; i < decodedStr.length; i++) {
                    jsonStr += String.fromCharCode(decodedStr.charCodeAt(i) - 1);
                }
                const data = JSON.parse(jsonStr);

                if (!data.n) throw new Error("Invalid Data");

                // Populate fields
                document.getElementById('legacy-student-name').innerText = data.n.toUpperCase();
                document.getElementById('legacy-student-id').innerText = 'ID-' + data.t.toString().slice(-6);
                document.getElementById('legacy-final-rank').innerText = data.rank.replace(/_/g, ' ');
                
                const dateObj = new Date(data.t);
                document.getElementById('legacy-doc-date').innerText = dateObj.toLocaleDateString('en-GB').toUpperCase();
                
                const timeHex = Math.floor(dateObj.getTime() / 1000).toString(16).toUpperCase();
                let formattedKey = cleanInput.match(/.{1,4}/g)?.join('-') || cleanInput;
                document.getElementById('legacy-key-display').innerText = formattedKey;
                document.getElementById('legacy-time-hash').innerText = timeHex;

                document.getElementById('legacy-score-1').innerText = Math.round((data.c1[1]/3)*100) + "%";
                document.getElementById('legacy-score-2').innerText = Math.round((data.c2[1]/3)*100) + "%";
                document.getElementById('legacy-score-3').innerText = Math.round((data.c3[1]/3)*100) + "%";

                document.getElementById('legacy-gate-section').style.display = 'none';

                // Terminal Minting Animation
                const overlay = document.getElementById('minting-overlay');
                overlay.style.display = 'flex';
                const terminal = document.getElementById('terminal-content');
                terminal.innerHTML = "";
                
                const lines = [
                    "INITIALIZING SECURE CONNECTION...",
                    "VERIFYING CRYPTOGRAPHIC KEY...",
                    "DECRYPTING ALCHEMICAL LEDGER...",
                    "CALCULATING PROOF OF WORK...",
                    "MINTING RELIC CERTIFICATE..."
                ];
                
                let i = 0;
                function printLine() {
                    if (i < lines.length) {
                        terminal.innerHTML += '<div class="terminal-line">> ' + lines[i] + '</div>';
                        i++;
                        setTimeout(printLine, 300 + Math.random() * 400);
                    } else {
                        terminal.innerHTML += '<div class="terminal-line">> ACCESS GRANTED.</div>';
                        setTimeout(() => {
                            overlay.style.display = 'none';
                            document.getElementById('legacy-cert-section').style.display = 'flex';
                            
                            const zoomVal = document.getElementById('zoom-slider').value;
                            updateZoom(zoomVal);
                            
                            initChart(data);
                            initRanks(data);
                            initLedger(timeHex);
                            initTilt();
                            
                        }, 800);
                    }
                }
                printLine();

            } catch (e) {
                console.error(e);
                errorMsg.innerText = "Error: Key Invalid.";
                errorMsg.style.display = 'block';
            }
        }

        function initChart(data) {
            const ctx = document.getElementById('skills-radar').getContext('2d');
            if(radarChart) radarChart.destroy();

            const score1 = Math.round((data.c1[1]/3)*100);
            const score2 = Math.round((data.c2[1]/3)*100);
            const score3 = Math.round((data.c3[1]/3)*100);

            radarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Architecture', 'Logic', 'Prompting'],
                    datasets: [{
                        label: 'Skill Proficiency',
                        data: [score1, score2, score3],
                        backgroundColor: 'rgba(34, 197, 94, 0.2)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        pointBackgroundColor: 'rgba(13, 13, 13, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(13, 13, 13, 1)',
                        borderWidth: 1.5
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(13, 13, 13, 0.2)' },
                            grid: { color: 'rgba(13, 13, 13, 0.1)' },
                            pointLabels: {
                                font: { family: "'DM Mono', monospace", size: 9, weight: 'bold' },
                                color: '#0D0D0D'
                            },
                            ticks: { display: false, min: 0, max: 100 }
                        }
                    },
                    plugins: { legend: { display: false } },
                    maintainAspectRatio: false
                }
            });
        }

        function initRanks(data) {
            const rankStr = (data.rank || '').toUpperCase();
            let activeIdx = 0;
            if(rankStr.includes('RUBEDO')) activeIdx = 3;
            else if(rankStr.includes('CITRINITAS')) activeIdx = 2;
            else if(rankStr.includes('ALBEDO')) activeIdx = 1;
            else if(rankStr.includes('NIGREDO')) activeIdx = 0;
            else {
                const avg = (data.c1[1] + data.c2[1] + data.c3[1]) / 9;
                if(avg >= 0.9) activeIdx = 3;
                else if(avg >= 0.7) activeIdx = 2;
                else if(avg >= 0.4) activeIdx = 1;
            }

            const rankIds = ['rank-nigredo', 'rank-albedo', 'rank-citrinitas', 'rank-rubedo'];
            for(let i=0; i<4; i++) {
                const el = document.getElementById(rankIds[i]);
                el.classList.remove('active', 'achieved');
                if (i < activeIdx) el.classList.add('achieved');
                if (i === activeIdx) el.classList.add('active');
            }
        }

        function initLedger(timeHex) {
            const tbody = document.getElementById('ledger-tbody');
            tbody.innerHTML = '';
            let currentHash = timeHex;
            for(let j=0; j<4; j++) {
                currentHash = btoa(currentHash + j * 13).replace(/=/g, '').substring(0, 32).toUpperCase();
                tbody.innerHTML += <tr>
                    <td>BLOCK #</td>
                    <td>...</td>
                    <td style="color: var(--accent-success); font-weight: bold;">VALID</td>
                </tr>;
            }
        }

        function initTilt() {
            const container = document.getElementById('legacy-transcript-container');
            VanillaTilt.init(container, {
                max: 2,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                gyroscope: true
            });
            tiltInstance = container.vanillaTilt;
        }

        function legacy_downloadPDF() {
            const element = document.getElementById('legacy-transcript-container');
            const name = document.getElementById('legacy-student-name').innerText.replace(/\s+/g, '_'); 
            const id = document.getElementById('legacy-student-id').innerText.replace('ID-', '');
            
            const btn = document.querySelector('.btn-small');
            const originalText = btn.innerText;
            
            btn.innerText = "GENERATING...";
            btn.disabled = true;

            if (tiltInstance) {
                tiltInstance.destroy();
            }
            element.style.transform = "none";
            element.style.boxShadow = "none";

            setTimeout(() => {
                const opt = {
                    margin: 0,
                    filename: OFFICIAL_TRANSCRIPT__.pdf,
                    image: { type: 'jpeg', quality: 1.0 },
                    html2canvas: { 
                        scale: 3, 
                        useCORS: true,
                        logging: false,
                        letterRendering: true,
                        scrollY: 0
                    },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(element).save().then(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    initTilt();
                }).catch(err => {
                    console.error(err);
                    btn.innerText = originalText;
                    btn.disabled = false;
                    initTilt();
                });
            }, 500);
        }

        // --- WARRANTY JS ---
        function showError() {
            const err = document.getElementById('verify-error');
            err.style.display = 'block';
        }

        function hideError() {
            const err = document.getElementById('verify-error');
            err.style.display = 'none';
        }

        function warranty_verifyKey() {
            hideError();
            const rawInput = document.getElementById('warranty-verify-input').value.trim();
            if (!rawInput) {
                showError();
                return;
            }
            
            // Note: The Key format in Cert was Base64 + "-TIMEHASH". 
            // We need to handle both raw Base64 and formatted key.
            let payloadPart = rawInput;
            if (rawInput.includes('-')) {
                const chunks = rawInput.split('-');
                const possibleBase64 = chunks.join('');
                
                // Try decoding full string first
                if (warranty_tryDecode(possibleBase64)) return;

                // Try removing last chunk (assuming it's timestamp suffix)
                const withoutSuffix = chunks.slice(0, -1).join('');
                if (warranty_tryDecode(withoutSuffix)) return;
                
                // Try raw
                if (warranty_tryDecode(rawInput)) return;

                showError();
            } else {
                if (!warranty_tryDecode(rawInput)) showError();
            }
        }

        function warranty_tryDecode(str) {
            try {
                // Decode Logic (Reverse of Ch3)
                const decodedStr = atob(str);
                let jsonStr = "";
                for (let i = 0; i < decodedStr.length; i++) {
                    jsonStr += String.fromCharCode(decodedStr.charCodeAt(i) - 1);
                }
                const data = JSON.parse(jsonStr);

                if (!data.n || !data.rank) return false;

                startDecryptionSequence(data);
                return true;
            } catch (e) {
                return false;
            }
        }

        function startDecryptionSequence(data) {
            document.getElementById('scanner-section').classList.add('hidden');
            document.getElementById('decryption-section').classList.remove('hidden');
            
            const terminal = document.getElementById('terminal-content');
            terminal.innerHTML = '';
            
            const lines = [
                "INITIATING SECURE HANDSHAKE...",
                "ESTABLISHING CONNECTION TO ALCHEMIST PROTOCOL...",
                "BYPASSING MAINFRAME FIREWALL...",
                "ACCESS GRANTED.",
                "DECRYPTING PAYLOAD..."
            ];
            
            let i = 0;
            const interval = setInterval(() => {
                if (i < lines.length) {
                    const line = document.createElement('div');
                    line.className = 'terminal-line';
                    line.innerText = `> ${lines[i]}`;
                    terminal.appendChild(line);
                    
                    // Hex garbage
                    for (let j = 0; j < 2; j++) {
                        const hex = document.createElement('div');
                        hex.className = 'terminal-line';
                        hex.style.opacity = '0.5';
                        hex.innerText = Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
                        terminal.appendChild(hex);
                    }
                    terminal.parentElement.scrollTop = terminal.parentElement.scrollHeight;
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        document.getElementById('decryption-section').classList.add('hidden');
                        warranty_renderDashboard(data);
                    }, 600);
                }
            }, 300);
        }

        function warranty_renderDashboard(data) {
            document.getElementById('dashboard-section').classList.remove('hidden');

            // Populate Data
            document.getElementById('card-name').innerText = data.n;
            document.getElementById('card-rank').innerText = data.rank.replace(/_/g, ' ');
            document.getElementById('card-id').innerText = `ID-${data.t.toString(16).toUpperCase()}`;
            
            const dateObj = new Date(data.t);
            document.getElementById('data-date').innerText = dateObj.toLocaleString('id-ID');

            document.getElementById('raw-data-display').innerText = JSON.stringify(data, null, 2);

            // Chart Data
            // Calc Averages for Chart Points
            const s1 = data.c1 ? Math.round((data.c1[1]/3)*100) : 50; 
            const s2 = data.c2 ? Math.round((data.c2[1]/3)*100) : 0; 
            const s3 = data.c3 ? Math.round((data.c3[1]/3)*100) : 0; 

            const logicScore = s2;
            const uiScore = s1;
            const archScore = s3;
            const syncScore = Math.round((s1+s2+s3)/3);
            const debugScore = Math.min(100, s2 + 30);

            // Render Radar Chart
            const ctx = document.getElementById('evolutionChart').getContext('2d');
            if(window.evolutionChartInstance) {
                window.evolutionChartInstance.destroy();
            }

            window.evolutionChartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Structure (UI)', 'Logic (JS)', 'Architecture', 'Synchronization', 'Debugging'],
                    datasets: [{
                        label: 'Competency Matrix',
                        data: [uiScore, logicScore, archScore, syncScore, debugScore],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderWidth: 2,
                        pointBackgroundColor: '#0D0D0D',
                        pointBorderColor: '#10B981',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(13, 13, 13, 0.2)' },
                            grid: { color: 'rgba(13, 13, 13, 0.2)' },
                            pointLabels: {
                                color: '#0D0D0D',
                                font: { family: 'DM Mono', size: 11, weight: 'bold' }
                            },
                            ticks: {
                                display: false,
                                min: 0,
                                max: 100
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });

            // Update Skill Tree nodes based on data
            if(s2 > 0) document.getElementById('node-js').classList.add('active');
            if(s3 > 0) document.getElementById('node-react').classList.add('active');
        }

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
    