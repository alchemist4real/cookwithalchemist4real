import sys
import re

filepath = r'd:\DOWNLOAD\cookwithalchemist4real\src\legacy_transcript.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if not script_match:
    print('Script not found')
    sys.exit(1)

new_script = '''
        let radarChart = null;
        let tiltInstance = null;

        window.addEventListener('DOMContentLoaded', () => {
            updateZoom(0.75);
        });

        function updateZoom(zoomVal) {
            const wrapper = document.getElementById('transcript-scale-wrapper');
            const frame = document.getElementById('document-frame');
            
            wrapper.style.transform = scale();
            document.getElementById('zoom-value').innerText = ${Math.round(zoomVal * 100)}%;
            
            const a4HeightPx = 1118.7;
            const containerPadding = 48; 
            frame.style.height = ${(a4HeightPx * zoomVal) + containerPadding}px;
        }

        function unlockTranscript() {
            const inputEl = document.getElementById('master-key-input');
            const rawInput = inputEl.value.trim();
            const cleanInput = rawInput.replace(/-/g, ''); 
            const errorMsg = document.getElementById('gate-error');
            
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
                document.getElementById('student-name').innerText = data.n.toUpperCase();
                document.getElementById('student-id').innerText = ID-;
                document.getElementById('final-rank').innerText = data.rank.replace(/_/g, ' ');
                
                const dateObj = new Date(data.t);
                document.getElementById('doc-date').innerText = dateObj.toLocaleDateString('en-GB').toUpperCase();
                
                const timeHex = Math.floor(dateObj.getTime() / 1000).toString(16).toUpperCase();
                let formattedKey = cleanInput.match(/.{1,4}/g)?.join('-') || cleanInput;
                document.getElementById('key-display').innerText = formattedKey;
                document.getElementById('time-hash').innerText = timeHex;

                document.getElementById('score-1').innerText = Math.round((data.c1[1]/3)*100) + "%";
                document.getElementById('score-2').innerText = Math.round((data.c2[1]/3)*100) + "%";
                document.getElementById('score-3').innerText = Math.round((data.c3[1]/3)*100) + "%";

                document.getElementById('gate-section').style.display = 'none';

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
                        terminal.innerHTML += <div class="terminal-line">> </div>;
                        i++;
                        setTimeout(printLine, 300 + Math.random() * 400);
                    } else {
                        terminal.innerHTML += <div class="terminal-line">> ACCESS GRANTED.</div>;
                        setTimeout(() => {
                            overlay.style.display = 'none';
                            document.getElementById('cert-section').style.display = 'flex';
                            
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
            const container = document.getElementById('transcript-container');
            VanillaTilt.init(container, {
                max: 2,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                gyroscope: true
            });
            tiltInstance = container.vanillaTilt;
        }

        function downloadPDF() {
            const element = document.getElementById('transcript-container');
            const name = document.getElementById('student-name').innerText.replace(/\s+/g, '_'); 
            const id = document.getElementById('student-id').innerText.replace('ID-', '');
            
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
'''

content = content[:script_match.start(1)] + "\n" + new_script + "\n    " + content[script_match.end(1):]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Update part 2 done")
