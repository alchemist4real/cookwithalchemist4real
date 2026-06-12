import re

with open(r'd:\DOWNLOAD\cookwithalchemist4real\src\ch1_structure.html', 'r', encoding='utf-8') as f:
    content = f.read()

# CSS Variables
content = content.replace('--fg-faint: rgba(13, 13, 13, 0.15);', '--fg-faint: #C4C4C4;')
content = content.replace('--accent: #10b981; /* emerald green */', '--accent: #0D0D0D;')
content = content.replace('--accent-dim: #a7f3d0;', '--accent-success: #10B981;')

# Fix logo badge
content = content.replace('color: var(--fg);\n            border: 1px solid var(--fg);\n            border-radius: 2px;\n            padding: 1px 8px;', 'color: var(--bg);\n            border: 1px solid var(--fg);\n            border-radius: 2px;\n            padding: 1px 8px;')

# Fix button CSS
btn_css_old = '''        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: var(--accent);
            color: var(--fg);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 12px 24px;
            font-size: 12px;
            font-weight: 700;
            font-family: 'DM Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;
            box-shadow: 2px 2px 0 var(--fg);
            transition: transform 0.1s, box-shadow 0.1s, background-color 0.2s;
        }

        .btn:hover {
            transform: translate(-1px, -1px);
            box-shadow: 3px 3px 0 var(--fg);
            background-color: #059669;
        }

        .btn:active {
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 0 var(--fg);
        }

        .btn-secondary {
            background-color: var(--bg);
        }
        .btn-secondary:hover {
            background-color: #EBEBEB;
        }'''

btn_css_new = '''        .btn, .btn-ghost {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: transparent;
            color: var(--fg);
            border: 1px solid var(--fg);
            border-radius: 2px;
            padding: 12px 24px;
            font-size: 12px;
            font-weight: 700;
            font-family: 'DM Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;
            box-shadow: 2px 2px 0 var(--fg);
            transition: 0s;
        }

        .btn:hover, .btn-ghost:hover {
            transform: translate(-2px, -2px);
            box-shadow: 4px 4px 0 var(--fg);
            background-color: var(--fg);
            color: var(--bg);
        }

        .btn:active, .btn-ghost:active {
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 0 var(--fg);
        }

        .btn-secondary {
            background-color: var(--bg);
        }
        .btn-secondary:hover {
            background-color: var(--fg);
            color: var(--bg);
        }'''
content = content.replace(btn_css_old, btn_css_new)

# Add .input-text css
input_css = '''        .input-text {
            width: 100%;
            padding: 12px 16px;
            font-family: 'DM Mono', monospace;
            font-size: 13px;
            color: var(--fg);
            background-color: transparent;
            border: 1px solid var(--fg-faint);
            border-radius: 2px;
            outline: none;
            transition: border-color 0s;
        }
        .input-text:focus {
            border-color: var(--fg);
        }'''
if '.input-text' not in content:
    content = content.replace('        /* Option buttons inside tests */', input_css + '\n\n        /* Option buttons inside tests */')

# Option arrow
content = content.replace('color: var(--accent);\n            font-weight: bold;', 'color: var(--fg);\n            font-weight: bold;')

# Badge dot
content = content.replace('background-color: var(--accent);\n            animation: pulse-dot', 'background-color: var(--accent-success);\n            animation: pulse-dot')

# Glitch
content = content.replace('0% { text-shadow: 1px 0 var(--accent), -1px 0 #ff0055; }', '0% { text-shadow: 1px 0 var(--fg), -1px 0 var(--accent-success); }')
content = content.replace('33% { text-shadow: -1px 0 var(--accent), 1px 0 #ff0055; }', '33% { text-shadow: -1px 0 var(--fg), 1px 0 var(--accent-success); }')
content = content.replace('66% { text-shadow: 1px 1px var(--accent), -1px -1px #ff0055; }', '66% { text-shadow: 1px 1px var(--fg), -1px -1px var(--accent-success); }')
content = content.replace('100% { text-shadow: -1px -1px var(--accent), 1px 1px #ff0055; }', '100% { text-shadow: -1px -1px var(--fg), 1px 1px var(--accent-success); }')

# Xray toggle btn
content = content.replace('background-color: var(--accent);\n            color: var(--fg);', 'background-color: var(--fg);\n            color: var(--bg);')

# Xray tag
content = content.replace('background-color: var(--accent);\n            color: var(--fg);', 'background-color: var(--fg);\n            color: var(--bg);')

# vp-btn shadow
content = content.replace('box-shadow: 2px 2px 0 var(--accent);', 'box-shadow: 2px 2px 0 var(--fg-faint);')

# Xray active
content = content.replace('outline: 1px dashed var(--accent) !important;', 'outline: 1px dashed var(--accent-success) !important;')

# Lab input btn tag
content = content.replace('color: var(--accent);\n            font-weight: 700;', 'color: var(--fg);\n            font-weight: 700;')

# pulse-border
content = content.replace('to { border-bottom-color: var(--accent); }', 'to { border-bottom-color: var(--fg); }')

# demo-nav
content = content.replace('border-color: var(--accent);', 'border-color: var(--fg);')
content = content.replace('background-color: rgba(16, 185, 129, 0.05);', 'background-color: rgba(13, 13, 13, 0.05);')


# inline replacements
content = content.replace('decoration-color: var(--accent);', 'decoration-color: var(--fg);')
content = content.replace('color: var(--accent);', 'color: var(--fg);')
content = content.replace('color: var(--accent-success); font-weight: 700; padding', 'color: var(--bg); font-weight: 700; padding')
content = content.replace('border-left: 2px solid var(--accent);', 'border-left: 2px solid var(--fg);')

content = content.replace('background-color: rgba(16, 185, 129, 0.05); border: 1px solid var(--accent);', 'background-color: rgba(13, 13, 13, 0.05); border: 1px solid var(--fg);')

# The Gate (Form Input)
# (Done in CSS)

# The Transcript
old_transcript = '''<div style="background-color: #FFFFFF; border: 1px solid var(--fg); padding: 24px; border-radius: 2px; position: relative; box-shadow: 2px 2px 0 var(--fg); margin-top: 24px; word-break: break-all;">
                        <div style="position: absolute; top: -12px; right: 16px; background-color: var(--accent); color: var(--fg); border: 1px solid var(--fg); border-radius: 2px; padding: 2px 10px; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">GENESIS KEY ACQUIRED</div>
                        
                        <p style="font-size: 10px; color: rgba(13, 13, 13, 0.6); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Akses Token Unik:</p>
                        <div style="font-family: \\'DM Mono\\', monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; color: var(--fg); border: 1px dashed var(--fg-faint); padding: 12px; background-color: var(--bg); margin-bottom: 16px; word-wrap: break-word; user-select: all;" id="access-code">${key}</div>
                        
                        <p style="font-size: 10px; color: rgba(13, 13, 13, 0.5); border-top: 1px dashed var(--fg-faint); padding-top: 12px; font-style: italic; line-height: 1.4;">
                            Salin token di atas. Data lo (Nama: ${state.userName}, Pre: ${state.preScore}, Post: ${state.postScore}) tersimpan secara kriptografis di dalamnya. Gunakan ini untuk membuka <span style="color: var(--fg); font-weight: bold; text-decoration: underline;">"Chapter 2"</span> nanti.
                        </p>
                    </div>'''

new_transcript = '''<div style="background-color: #FFFFFF; border: 1px solid var(--fg); padding: 24px; border-radius: 2px; position: relative; box-shadow: 2px 2px 0 var(--fg); margin-top: 24px;">
                        <div class="flicker-label" style="position: absolute; top: -12px; right: 16px; background-color: var(--accent-success); color: var(--bg); border: 1px solid var(--fg); border-radius: 2px; padding: 2px 10px; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">GENESIS KEY ACQUIRED</div>
                        
                        <div style="font-family: \\'DM Mono\\', monospace; font-size: 12px; line-height: 1.6; color: var(--fg); margin-bottom: 16px; text-align: left;">
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
                                    <td style="padding: 4px 0; text-align: right;">${Math.round((state.preScore / 3) * 100)}%</td>
                                </tr>
                                <tr>
                                    <td style="padding: 4px 0;">REVISED LOGIC (POST)</td>
                                    <td style="padding: 4px 0; text-align: right; color: var(--accent-success);">> ${Math.round((state.postScore / 3) * 100)}%</td>
                                </tr>
                            </table>
                        </div>
                        
                        <p style="font-size: 10px; color: rgba(13, 13, 13, 0.6); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold; text-align: left;">Akses Token Unik:</p>
                        <div style="font-family: \\'DM Mono\\', monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; color: var(--fg); border: 1px dashed var(--fg-faint); padding: 12px; background-color: var(--bg); margin-bottom: 24px; word-wrap: break-word; user-select: all; text-align: left;" id="access-code">${key}</div>
                        
                        <div style="text-align: right; margin-top: 32px; border-top: 1px dashed var(--fg-faint); padding-top: 16px;">
                            <div style="font-family: \\'Cormorant Garamond\\', serif; font-size: 24px; font-style: italic; font-weight: 700; text-transform: uppercase;">THE ALCHEMIST</div>
                            <div style="font-family: \\'DM Mono\\', monospace; font-size: 9px; color: rgba(13,13,13,0.5);">AUTHORIZED DIGITAL HASH</div>
                        </div>
                    </div>'''

content = content.replace(old_transcript, new_transcript)

# Some remaining color issues
# flicker-label background-color: var(--accent-success) instead of var(--accent) where we used var(--fg) earlier
content = content.replace('background-color: var(--fg); color: var(--bg); font-size: 11px; font-weight: 700; padding: 2px 8px; border: 1px solid var(--fg); border-radius: 2px; margin-left: 8px;">THE LAB</span>', 'background-color: var(--accent-success); color: var(--bg); font-size: 11px; font-weight: 700; padding: 2px 8px; border: 1px solid var(--fg); border-radius: 2px; margin-left: 8px;">THE LAB</span>')

# Final score coloring
content = content.replace('color: var(--fg);">Sesudah</div>', 'color: var(--accent-success);">Sesudah</div>')
content = content.replace('color: var(--fg);">0%</div>', 'color: var(--accent-success);">0%</div>')
content = content.replace('top: 0; color: var(--fg); animation:', 'top: 0; color: var(--accent-success); animation:')

with open(r'd:\DOWNLOAD\cookwithalchemist4real\src\ch1_structure.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Replaced successfully')
