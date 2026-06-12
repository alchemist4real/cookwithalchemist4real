import re

with open(r'd:\DOWNLOAD\cookwithalchemist4real\src\ch1_structure.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix flicker label
content = content.replace(
    '<span class="flicker-label" style="background-color: var(--fg); color: var(--fg); font-size: 11px; font-weight: 700; padding: 2px 8px; border: 1px solid var(--fg); border-radius: 2px; margin-left: 8px;">THE LAB</span>',
    '<span class="flicker-label" style="background-color: var(--accent-success); color: var(--bg); font-size: 11px; font-weight: 700; padding: 2px 8px; border: 1px solid var(--fg); border-radius: 2px; margin-left: 8px;">THE LAB</span>'
)

# Fix paragraph border left
content = content.replace(
    'p style="background-color: rgba(13, 13, 13, 0.05); border: 1px solid var(--accent);',
    'p style="background-color: rgba(13, 13, 13, 0.05); border: 1px solid var(--fg);'
)

# Fix GENESIS KEY ACQUIRED div and old transcript. Let's use regex to replace the entire transcript block.
old_transcript_pattern = re.compile(r'<div style="background-color: #FFFFFF; border: 1px solid var\(--fg\); padding: 24px; border-radius: 2px; position: relative; box-shadow: 2px 2px 0 var\(--fg\); margin-top: 24px; word-break: break-all;">.*?</div>\s*`;', re.DOTALL)

new_transcript = """<div style="background-color: #FFFFFF; border: 1px solid var(--fg); padding: 24px; border-radius: 2px; position: relative; box-shadow: 2px 2px 0 var(--fg); margin-top: 24px;">
                        <div class="flicker-label" style="position: absolute; top: -12px; right: 16px; background-color: var(--accent-success); color: var(--bg); border: 1px solid var(--fg); border-radius: 2px; padding: 2px 10px; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">GENESIS KEY ACQUIRED</div>
                        
                        <div style="font-family: \'DM Mono\', monospace; font-size: 12px; line-height: 1.6; color: var(--fg); margin-bottom: 16px; text-align: left;">
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
                        <div style="font-family: \'DM Mono\', monospace; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; color: var(--fg); border: 1px dashed var(--fg-faint); padding: 12px; background-color: var(--bg); margin-bottom: 24px; word-wrap: break-word; user-select: all; text-align: left;" id="access-code">${key}</div>
                        
                        <div style="text-align: right; margin-top: 32px; border-top: 1px dashed var(--fg-faint); padding-top: 16px;">
                            <div style="font-family: \'Cormorant Garamond\', serif; font-size: 24px; font-style: italic; font-weight: 700; text-transform: uppercase;">THE ALCHEMIST</div>
                            <div style="font-family: \'DM Mono\', monospace; font-size: 9px; color: rgba(13,13,13,0.5);">AUTHORIZED DIGITAL HASH</div>
                        </div>
                    </div>
                `;"""

content = old_transcript_pattern.sub(new_transcript, content)

with open(r'd:\DOWNLOAD\cookwithalchemist4real\src\ch1_structure.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixes applied.")
