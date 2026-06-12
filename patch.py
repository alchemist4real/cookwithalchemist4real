import sys
import os

filepath = r'd:\DOWNLOAD\cookwithalchemist4real\src\warranty_check.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace <style> block
start_style = content.find('<style>')
end_style = content.find('</style>') + len('</style>')

new_style = """<style>
        :root {
            --bg: #FAFAFA;
            --bg-card: #FFFFFF;
            --fg: #0D0D0D;
            --fg-faint: #C4C4C4;
            --accent: #0D0D0D;
            --accent-success: #10B981;
            --font-heading: 'Cormorant Garamond', serif;
            --font-body: 'DM Mono', monospace;
            --shadow-flat: 2px 2px 0 var(--fg);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg);
            color: var(--fg);
            font-family: var(--font-body);
            font-size: 13px;
            line-height: 1.5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }

        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none;
            opacity: 0.035;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            z-index: 9999;
        }

        ::selection {
            background-color: var(--fg);
            color: #FFF;
        }

        header {
            border-bottom: 1px solid var(--fg);
            background-color: var(--bg);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .nav-container {
            max-width: 680px;
            margin: 0 auto;
            padding: 1.25rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .brand-logo {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .brand-badge {
            font-family: var(--font-body);
            font-size: 0.8rem;
            font-weight: 500;
            background-color: var(--fg);
            color: var(--bg);
            border: 1px solid var(--fg);
            padding: 0.1rem 0.4rem;
            border-radius: 2px;
        }

        .system-version {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.7;
        }

        main {
            flex-grow: 1;
            padding: 3rem 1.5rem;
            max-width: 680px;
            width: 100%;
            margin: 0 auto;
        }

        h1 {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1rem;
            text-align: center;
        }

        p { margin-bottom: 1rem; }

        .subtitle {
            text-align: center;
            max-width: 460px;
            margin: 0 auto 2.5rem auto;
            font-size: 0.9rem;
            opacity: 0.85;
            line-height: 1.6;
        }

        .brutalist-card {
            background-color: var(--bg-card);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 2rem;
            margin-bottom: 2rem;
            transition: transform 0s, box-shadow 0s;
        }

        .brutalist-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: var(--shadow-flat);
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 1.5rem 0;
        }

        .brutalist-input {
            width: 100%;
            background-color: var(--bg-card);
            border: 1px solid var(--fg-faint);
            border-radius: 2px;
            padding: 1rem;
            font-family: var(--font-body);
            font-size: 0.85rem;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            outline: none;
            transition: 0s;
            color: var(--fg);
        }

        .brutalist-input:focus {
            transform: translate(-2px, -2px);
            box-shadow: 2px 2px 0 var(--fg);
            border-color: var(--fg);
        }

        .btn-ghost {
            width: 100%;
            background-color: transparent;
            color: var(--fg);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 1rem;
            font-family: var(--font-body);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            cursor: pointer;
            transition: 0s;
        }

        .btn-ghost:hover {
            background-color: var(--fg);
            color: var(--bg-card);
            transform: translate(-2px, -2px);
            box-shadow: 2px 2px 0 var(--fg);
        }

        .btn-ghost:active {
            transform: translate(0px, 0px);
            box-shadow: none;
        }

        .error-message {
            color: var(--fg);
            background-color: var(--bg-card);
            border: 1px solid var(--fg);
            font-size: 0.75rem;
            font-weight: bold;
            margin-top: 0.5rem;
            padding: 0.5rem;
            text-align: center;
            display: none;
            border-radius: 2px;
        }

        .scanner-container {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem auto;
            border: 1px solid var(--fg);
            border-radius: 2px;
            position: relative;
            overflow: hidden;
            background-color: var(--bg-card);
            box-shadow: 2px 2px 0 var(--fg);
        }

        .scanner-line {
            width: 100%;
            height: 6px;
            background-color: var(--fg);
            border-top: 1px solid var(--fg);
            border-bottom: 1px solid var(--fg);
            position: absolute;
            top: 0; left: 0;
            animation: brutal-scan 2.5s steps(24, end) infinite;
        }

        .scanner-bg-pulse {
            position: absolute;
            inset: 0;
            background-color: var(--fg);
            opacity: 0.05;
            animation: pulse-step 2.5s steps(5, end) infinite;
        }

        .scanner-icon {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center;
            z-index: 10;
        }

        @keyframes brutal-scan {
            0% { top: 0%; }
            50% { top: calc(100% - 8px); }
            100% { top: 0%; }
        }

        @keyframes pulse-step {
            0%, 100% { opacity: 0.02; }
            50% { opacity: 0.15; }
        }

        .id-card-wrapper { margin: 2rem 0; }

        .id-card-title {
            font-size: 0.85rem;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 0.1em;
            margin-bottom: 0.75rem;
            border-bottom: 1px solid var(--fg);
            padding-bottom: 0.25rem;
        }

        .id-card {
            background-color: var(--bg-card);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 1.75rem;
            position: relative;
            transition: transform 0s, box-shadow 0s;
        }

        .id-card:hover {
            transform: translate(-2px, -2px);
            box-shadow: var(--shadow-flat);
        }

        .id-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            padding-top: 0.5rem;
        }

        .id-card-brand {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1.25rem;
            text-transform: uppercase;
            line-height: 1;
        }

        .id-card-tag {
            font-size: 0.7rem;
            background-color: var(--fg);
            color: var(--bg);
            border: 1px solid var(--fg);
            padding: 0.15rem 0.4rem;
            font-weight: bold;
            border-radius: 2px;
        }

        .id-card-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.75rem;
        }

        .id-card-field { display: flex; flex-direction: column; }

        .id-card-label {
            font-size: 0.65rem;
            text-transform: uppercase;
            opacity: 0.6;
            margin-bottom: 0.35rem;
        }

        .id-card-val {
            font-weight: 500;
            word-break: break-all;
        }

        .id-card-val-accent {
            font-weight: bold;
            background-color: var(--fg);
            color: var(--bg);
            border: 1px solid var(--fg);
            padding: 0.15rem 0.5rem;
            width: fit-content;
            border-radius: 2px;
        }

        .id-card-footer {
            border-top: 1px solid var(--fg);
            padding-top: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 0.65rem;
        }

        .id-card-disclaimer {
            max-width: 65%;
            line-height: 1.4;
            opacity: 0.75;
        }

        .id-card-signature {
            text-align: right;
            font-family: var(--font-heading);
            font-weight: bold;
            font-style: italic;
            font-size: 0.95rem;
            text-transform: uppercase;
        }

        .status-banner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--bg-card);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 1.25rem 1.5rem;
            box-shadow: var(--shadow-flat);
            margin-bottom: 2.5rem;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: bold;
            font-size: 1.2rem;
            margin-top: 0.25rem;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--accent-success);
            border: 1px solid var(--fg);
            display: inline-block;
            animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.15); }
        }

        .status-label {
            font-size: 0.65rem;
            text-transform: uppercase;
            opacity: 0.6;
        }

        .section-title {
            font-family: var(--font-heading);
            font-size: 1.8rem;
            font-weight: bold;
            border-bottom: 1px solid var(--fg);
            margin-bottom: 1.25rem;
            padding-bottom: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .chart-box {
            background-color: var(--bg-card);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: var(--shadow-flat);
            height: 250px;
            position: relative;
        }

        .chart-caption {
            font-size: 0.75rem;
            text-align: center;
            font-style: italic;
            opacity: 0.8;
            margin-top: 0.75rem;
        }

        .raw-display-box {
            background-color: var(--bg-card);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 1.25rem;
            overflow-x: auto;
            font-family: var(--font-body);
            font-size: 0.75rem;
            color: var(--fg);
            box-shadow: var(--shadow-flat);
            transition: transform 0s, box-shadow 0s;
        }

        .raw-display-box:hover {
            transform: translate(-2px, -2px);
            box-shadow: var(--shadow-flat);
        }

        .raw-display-box pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        footer {
            border-top: 1px solid var(--fg);
            background-color: var(--bg-card);
            padding: 2.5rem 1.5rem;
            text-align: center;
            font-size: 0.75rem;
            opacity: 0.8;
            margin-top: auto;
        }

        .footer-logo {
            font-family: var(--font-heading);
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }

        .hidden { display: none !important; }
        .text-center { text-align: center; }

        .reset-btn {
            background: none;
            border: none;
            text-decoration: underline;
            font-family: var(--font-body);
            font-size: 0.75rem;
            color: var(--fg);
            cursor: pointer;
            margin-top: 2rem;
            opacity: 0.7;
        }

        .reset-btn:hover {
            opacity: 1;
            color: var(--fg);
            font-weight: bold;
        }

        .anim-glitch {
            position: relative;
            animation: glitch-skew 1s infinite linear alternate-reverse;
            display: inline-block;
        }
        .anim-glitch::before, .anim-glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
        }
        .anim-glitch::before {
            left: 2px;
            text-shadow: -1px 0 var(--fg);
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .anim-glitch::after {
            left: -2px;
            text-shadow: -1px 0 var(--fg);
            clip: rect(44px, 450px, 56px, 0);
            animation: glitch-anim2 5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
            0% { clip: rect(10px, 9999px, 83px, 0); }
            20% { clip: rect(62px, 9999px, 14px, 0); }
            40% { clip: rect(34px, 9999px, 53px, 0); }
            60% { clip: rect(98px, 9999px, 25px, 0); }
            80% { clip: rect(15px, 9999px, 76px, 0); }
            100% { clip: rect(42px, 9999px, 91px, 0); }
        }
        @keyframes glitch-anim2 {
            0% { clip: rect(65px, 9999px, 100px, 0); }
            20% { clip: rect(21px, 9999px, 73px, 0); }
            40% { clip: rect(86px, 9999px, 12px, 0); }
            60% { clip: rect(43px, 9999px, 55px, 0); }
            80% { clip: rect(9px, 9999px, 34px, 0); }
            100% { clip: rect(55px, 9999px, 88px, 0); }
        }
        @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            10% { transform: skew(-2deg); }
            20% { transform: skew(2deg); }
            30% { transform: skew(0deg); }
            100% { transform: skew(0deg); }
        }

        .anim-flicker {
            animation: flicker 2s linear infinite;
        }
        @keyframes flicker {
            0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% { opacity: 1; }
            20%, 21.999%, 63%, 63.999%, 65%, 69.999% { opacity: 0.4; }
        }

        @media (max-width: 600px) {
            h1 { font-size: 2rem; }
            .id-card-row { grid-template-columns: 1fr; gap: 1rem; }
        }
    </style>"""

content = content[:start_style] + new_style + content[end_style:]

# 2. HTML Replacements
content = content.replace('<h1>Verifikasi Identitas</h1>', '<h1 class="anim-glitch" data-text="Verifikasi Identitas">Verifikasi Identitas</h1>')
content = content.replace('AUTHENTIC', '<span class="anim-flicker">AUTHENTIC</span>')
content = content.replace('class="brutalist-btn"', 'class="btn-ghost"')
content = content.replace('background-color: var(--accent); padding: 0.1rem 0.3rem; font-weight: bold; border: 1px solid var(--fg); border-radius: 2px;', 'background-color: var(--fg); color: var(--bg); padding: 0.1rem 0.3rem; font-weight: bold; border: 1px solid var(--fg); border-radius: 2px;')

# Chart JS replacement
content = content.replace("pointBackgroundColor: '#fbbf24',", "pointBackgroundColor: '#10B981',")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
