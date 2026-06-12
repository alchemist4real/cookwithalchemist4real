import sys

filepath = r'd:\DOWNLOAD\cookwithalchemist4real\src\legacy_transcript.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CDNs
content = content.replace(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>\n    <!-- Chart.js -->\n    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n    <!-- Vanilla Tilt -->\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.0/vanilla-tilt.min.js"></script>'
)

# 2. Add CSS
css_addition = '''        /* --- NEW ELEMENTS --- */
        .performance-section {
            display: grid;
            grid-template-columns: 3fr 2fr;
            gap: 6mm;
            margin-bottom: 8mm;
            align-items: stretch;
        }

        .chart-container {
            width: 100%;
            height: 100%;
            min-height: 140px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--fg);
            background-color: var(--bg);
            padding: 2mm;
            position: relative;
            box-sizing: border-box;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
        }

        .ranks-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8mm;
            border: 1px solid var(--fg);
            background: var(--bg);
            padding: 4mm;
            box-shadow: 2px 2px 0 var(--fg);
        }

        .rank-step {
            text-align: center;
            font-family: var(--font-mono);
            font-size: 8pt;
            font-weight: 700;
            color: var(--fg-faint);
            flex: 1;
            position: relative;
            text-transform: uppercase;
            transition: all 0.3s;
        }

        .rank-step:not(:last-child)::after {
            content: "→";
            position: absolute;
            right: -5px;
            top: 20%;
            transform: translateY(-50%);
            color: var(--fg-faint);
        }

        .rank-step.active {
            color: var(--accent-success);
            text-shadow: 0 0 5px rgba(34, 197, 94, 0.4);
        }

        .rank-step.achieved {
            color: var(--fg);
        }

        .ledger-container {
            border: 1px solid var(--fg);
            background-color: var(--bg);
            padding: 4mm;
            margin-bottom: 8mm;
            box-shadow: 2px 2px 0 var(--fg);
        }

        .ledger-title {
            font-family: var(--font-mono);
            font-size: 7.5pt;
            font-weight: 700;
            margin-bottom: 3mm;
            text-transform: uppercase;
            color: var(--fg);
            letter-spacing: 1px;
            border-bottom: 1px dashed var(--fg-faint);
            padding-bottom: 2mm;
        }

        .ledger-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--font-mono);
            font-size: 6.5pt;
        }

        .ledger-table th, .ledger-table td {
            border: 1px dotted var(--fg-faint);
            padding: 2mm;
            text-align: left;
            color: var(--fg);
        }

        .ledger-table th {
            background: var(--fg);
            color: var(--bg-card);
            font-weight: 700;
        }

        /* Minting Animation Overlay */
        #minting-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(13, 13, 13, 0.95);
            z-index: 10000;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            padding: 10%;
            font-family: var(--font-mono);
            color: var(--accent-success);
        }

        .terminal-line {
            margin-bottom: 10px;
            font-size: 16px;
            text-shadow: 0 0 4px rgba(34, 197, 94, 0.6);
        }

        .terminal-cursor {
            display: inline-block;
            width: 10px;
            height: 16px;
            background: var(--accent-success);
            animation: blink 1s step-end infinite;
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.8);
        }
    </style>'''
content = content.replace('    </style>', css_addition)

# 3. Add overlay
content = content.replace(
    '<body class="antialiased">',
    '<body class="antialiased">\n\n    <!-- MINTING ANIMATION OVERLAY -->\n    <div id="minting-overlay">\n        <div id="terminal-content"></div>\n        <div class="terminal-cursor"></div>\n    </div>'
)

# 4. Replace body section
old_html = '''                    <!-- GRADES TABLE -->
                    <table class="grades-table">
                        <thead>
                            <tr>
                                <th style="width: 18%">CODE</th>
                                <th style="width: 62%">SUBJECT MODULE</th>
                                <th style="width: 20%; text-align: right;">SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="grade-code">ARC-101</td>
                                <td class="grade-subject">
                                    <div class="grade-subject-title">Structural Architecture</div>
                                    <span class="grade-subject-desc">Single File HTML Philosophy, DOM Structure</span>
                                </td>
                                <td class="grade-score" id="score-1">0%</td>
                            </tr>
                            <tr>
                                <td class="grade-code">LOG-202</td>
                                <td class="grade-subject">
                                    <div class="grade-subject-title">Digital Logic Systems</div>
                                    <span class="grade-subject-desc">State Management, API Integration (No-DB)</span>
                                </td>
                                <td class="grade-score" id="score-2">0%</td>
                            </tr>
                            <tr>
                                <td class="grade-code">PRM-303</td>
                                <td class="grade-subject">
                                    <div class="grade-subject-title">Advanced Prompt Engineering</div>
                                    <span class="grade-subject-desc">Reasoning Models, Meta-Prompting, Context Optimization</span>
                                </td>
                                <td class="grade-score" id="score-3">0%</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- FINAL VERDICT -->
                    <div class="verdict-box">
                        <div class="verdict-title">Final Classification Rank</div>
                        <div class="verdict-rank" id="final-rank">VERIFIED HUMAN</div>
                    </div>

                    <!-- KEY SECTION -->
                    <div class="key-section">
                        <div class="key-title">ENCRYPTED RECOVERY KEY (PHILOSOPHER'S STONE)</div>
                        <div class="key-code" id="key-display">XXXX-XXXX-XXXX-XXXX</div>
                        <div class="key-hash">TIMESTAMP HASH: <span id="time-hash">---</span></div>
                    </div>'''

new_html = '''                    <!-- GRADES & RADAR SECTION -->
                    <div class="performance-section">
                        <table class="grades-table" style="margin-bottom: 0;">
                            <thead>
                                <tr>
                                    <th style="width: 18%">CODE</th>
                                    <th style="width: 62%">SUBJECT MODULE</th>
                                    <th style="width: 20%; text-align: right;">SCORE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="grade-code">ARC-101</td>
                                    <td class="grade-subject">
                                        <div class="grade-subject-title">Structural Architecture</div>
                                        <span class="grade-subject-desc">Single File HTML Philosophy, DOM Structure</span>
                                    </td>
                                    <td class="grade-score" id="score-1">0%</td>
                                </tr>
                                <tr>
                                    <td class="grade-code">LOG-202</td>
                                    <td class="grade-subject">
                                        <div class="grade-subject-title">Digital Logic Systems</div>
                                        <span class="grade-subject-desc">State Management, API Integration (No-DB)</span>
                                    </td>
                                    <td class="grade-score" id="score-2">0%</td>
                                </tr>
                                <tr>
                                    <td class="grade-code">PRM-303</td>
                                    <td class="grade-subject">
                                        <div class="grade-subject-title">Advanced Prompt Engineering</div>
                                        <span class="grade-subject-desc">Reasoning Models, Meta-Prompting, Context Optimization</span>
                                    </td>
                                    <td class="grade-score" id="score-3">0%</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="chart-container">
                            <canvas id="skills-radar"></canvas>
                        </div>
                    </div>

                    <!-- ALCHEMICAL PROGRESSION -->
                    <div class="ranks-container">
                        <div class="rank-step" id="rank-nigredo">NIGREDO<br><span style="font-size:5pt; font-weight:400;">Decomposition</span></div>
                        <div class="rank-step" id="rank-albedo">ALBEDO<br><span style="font-size:5pt; font-weight:400;">Purification</span></div>
                        <div class="rank-step" id="rank-citrinitas">CITRINITAS<br><span style="font-size:5pt; font-weight:400;">Awakening</span></div>
                        <div class="rank-step" id="rank-rubedo">RUBEDO<br><span style="font-size:5pt; font-weight:400;">Realization</span></div>
                    </div>

                    <div style="display: flex; gap: 8mm; margin-bottom: 8mm;">
                        <!-- FINAL VERDICT -->
                        <div class="verdict-box" style="flex: 1; margin-bottom: 0;">
                            <div class="verdict-title">Final Classification Rank</div>
                            <div class="verdict-rank" id="final-rank">VERIFIED HUMAN</div>
                        </div>

                        <!-- KEY SECTION -->
                        <div class="key-section" style="flex: 1; margin-bottom: 0;">
                            <div class="key-title">ENCRYPTED RECOVERY KEY</div>
                            <div class="key-code" id="key-display">XXXX-XXXX-XXXX-XXXX</div>
                            <div class="key-hash">TIMESTAMP HASH: <span id="time-hash">---</span></div>
                        </div>
                    </div>

                    <!-- CRYPTOGRAPHIC LEDGER -->
                    <div class="ledger-container">
                        <div class="ledger-title">Cryptographic Proof of Work Ledger</div>
                        <table class="ledger-table">
                            <thead>
                                <tr>
                                    <th style="width: 25%">BLOCK HEIGHT</th>
                                    <th style="width: 50%">SHA-256 CHECKSUM (TRUNCATED)</th>
                                    <th style="width: 25%">CONSENSUS</th>
                                </tr>
                            </thead>
                            <tbody id="ledger-tbody">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>'''

if old_html in content:
    content = content.replace(old_html, new_html)
else:
    print('Warning: old HTML block not found. Trying flexible replacement.')
    sys.exit(1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Update part 1 done")
