const fs = require('fs');
let html = fs.readFileSync('ch2_transmutation.html', 'utf8');

const startMarker = '<!-- MATERI 3: THE API & ASYNC -->';
const endMarker = '<!-- MATERI 4: AI & DESIGN RELEVANSI -->';
const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if(startIndex !== -1 && endIndex !== -1) {
    const replacement = `<!-- MATERI 3: THE EVENT LOOP, ASYNC, AND API -->
                    <div class="prose prose-lg max-w-none font-mono text-sm text-gray-700">
                        <h2 class="text-[#0D0D0D] font-serif font-bold text-3xl mb-4 border-b border-[#0d0d0d] pb-2 glitch-effect">3. Mesin Waktu: Event Loop, Asinkron, & API</h2>
                        
                        <!-- 3A. Event Loop & Task Queue -->
                        <div class="mb-12">
                            <h3 class="text-[#0D0D0D] font-serif font-bold text-2xl">3A. Konkurensi Satu Jalur: Event Loop & Task Queue</h3>
                            <p class="my-4">
                                JavaScript lahir sebagai bahasa <strong>Single-Threaded</strong>. Artinya, dia cuma punya satu tangan (satu <strong>Call Stack</strong>) untuk mengerjakan tugas. Dia mengeksekusi kode baris demi baris, dari atas ke bawah. Kalau ada tugas berat (misalnya menghitung angka miliaran, atau menunggu download file besar), tangan ini akan "nyangkut" dan seluruh halaman web akan nge-<em>freeze</em> (blocking).
                            </p>
                            <p class="my-4">
                                Lantas, bagaimana browser modern bisa mendownload gambar, menjalankan animasi, dan merespons klik mouse lo secara bersamaan tanpa freeze? Rahasianya ada pada <strong>Event Loop</strong> dan <strong>Web APIs</strong>.
                            </p>
                            <div class="bg-white border border-[#0D0D0D] p-6 rounded-[2px] shadow-[4px_4px_0_#0d0d0d] my-6 text-sm">
                                <h4 class="text-lg font-bold text-[#10b981] mb-2 uppercase">Anatomi Mesin Waktu JS:</h4>
                                <ul class="list-disc pl-5 space-y-2">
                                    <li><strong>Call Stack:</strong> Tempat tugas sinkron (langsung) dieksekusi. "LIFO" (Last In, First Out). Tugas yang masuk terakhir diselesaikan pertama.</li>
                                    <li><strong>Web APIs:</strong> Tangan tambahan yang disediakan browser (seperti <code>setTimeout</code>, <code>fetch</code>, DOM events). Kalau JavaScript ketemu tugas asinkron, dia bakal "lempar" tugas itu ke Web API, lalu Call Stack lanjut ngerjain baris kode berikutnya.</li>
                                    <li><strong>Task Queue (Macrotask) & Microtask Queue:</strong> Ruang tunggu. Saat Web API selesai ngerjain tugas, dia gak langsung nyela Call Stack. Dia masukin <em>callback</em>-nya ke ruang tunggu. <em>Microtask</em> (seperti Promise) punya prioritas lebih tinggi daripada <em>Macrotask</em> (seperti setTimeout).</li>
                                    <li><strong>Event Loop:</strong> Penjaga pintu yang terus muter-muter mengecek: <em>"Apakah Call Stack udah kosong?"</em> Kalau kosong, dia ambil tugas dari antrean Microtask dulu, baru kemudian Task Queue, untuk dimasukkan ke Call Stack.</li>
                                </ul>
                            </div>
                            
                            <!-- INTERACTIVE: TIME MACHINE PROMISES -->
                            <div class="not-prose my-10 neo-card p-6 bg-white relative overflow-hidden shadow-[4px_4px_0_#0d0d0d]">
                                <div class="absolute top-0 left-0 bg-[#0d0d0d] text-xs text-[#FAFAFA] px-3 py-1 font-mono uppercase tracking-widest border-r border-b border-[#0d0d0d]">TIME MACHINE: EVENT LOOP VISUALIZER</div>
                                <div class="mt-8 mb-4 text-xs text-gray-600">Simulasikan bagaimana Call Stack dan Web API bekerja. Geser slider untuk menggerakkan waktu maju/mundur.</div>
                                
                                <div class="flex flex-col gap-4">
                                    <div class="flex gap-4 items-stretch h-64">
                                        <!-- Call Stack -->
                                        <div class="w-1/3 border border-[#0D0D0D] flex flex-col justify-end bg-gray-50 p-2 relative">
                                            <div class="absolute top-0 w-full text-center text-[10px] bg-[#0D0D0D] text-white py-1 -mx-2">CALL STACK</div>
                                            <div id="tm-callstack" class="flex flex-col gap-1 w-full justify-end"></div>
                                        </div>
                                        <!-- Web API -->
                                        <div class="w-1/3 border border-[#0D0D0D] flex flex-col bg-gray-50 p-2 relative">
                                            <div class="absolute top-0 w-full text-center text-[10px] bg-[#0D0D0D] text-white py-1 -mx-2">WEB APIs</div>
                                            <div id="tm-webapi" class="mt-6 flex flex-col gap-1 w-full"></div>
                                        </div>
                                        <!-- Task Queue -->
                                        <div class="w-1/3 border border-[#0D0D0D] flex flex-col bg-gray-50 p-2 relative">
                                            <div class="absolute top-0 w-full text-center text-[10px] bg-[#0D0D0D] text-white py-1 -mx-2">QUEUE (Micro/Macro)</div>
                                            <div id="tm-queue" class="mt-6 flex flex-col gap-1 w-full"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="text-xs font-bold uppercase tracking-widest text-[#0D0D0D]">Timeline Control</label>
                                        <input type="range" id="tm-slider" min="0" max="6" value="0" step="1" class="neo-slider mt-2" oninput="updateTimeMachine(this.value)">
                                        <div class="flex justify-between text-[10px] font-bold mt-1 text-gray-500" id="tm-steps-label">
                                            <span>Start</span>
                                            <span>log(1)</span>\n                                            <span>timeout</span>
                                            <span>Promise</span>
                                            <span>log(4)</span>
                                            <span>Micro</span>
                                            <span>Macro</span>
                                        </div>
                                        <div id="tm-explanation" class="mt-4 p-3 bg-green-50 border border-[#10b981] text-xs font-mono text-[#0D0D0D]">
                                            Tarik slider untuk melihat urutan eksekusi.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 3B. Callback Hell vs Promises -->
                        <div class="mb-12">
                            <h3 class="text-[#0D0D0D] font-serif font-bold text-2xl">3B. Evolusi Asinkron: Callback Hell ke Promises</h3>
                            <p class="my-4">
                                Dulu, satu-satunya cara JavaScript menangani tugas yang belum selesai adalah dengan <strong>Callback</strong>. Lo menitipkan sebuah fungsi ke fungsi lain untuk dijalankan "nanti". Masalahnya, kalau lo punya banyak tugas berurutan, kodenya akan menjorok ke kanan membentuk "Pyramid of Doom" atau <strong>Callback Hell</strong>.
                            </p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                                <div class="bg-gray-100 p-4 border border-red-500 rounded-[2px] shadow-[2px_2px_0_#ef4444]">
                                    <h4 class="text-red-600 font-bold mb-2 text-sm uppercase">Era Kuno (Callback Hell)</h4>
                                    <pre class="text-[10px] overflow-x-auto text-gray-800"><code>getData(function(a){
    getMoreData(a, function(b){
        getMoreData(b, function(c){
            getMoreData(c, function(d){
                console.log("Welcome to hell", d);
            });
        });
    });
});</code></pre>
                                </div>
                                <div class="bg-gray-100 p-4 border border-[#10b981] rounded-[2px] shadow-[2px_2px_0_#10b981]">
                                    <h4 class="text-[#10b981] font-bold mb-2 text-sm uppercase">Era Modern (Async / Await)</h4>
                                    <pre class="text-[10px] overflow-x-auto text-gray-800"><code>async function fetchAll() {
    try {
        const a = await getData();
        const b = await getMoreData(a);
        const c = await getMoreData(b);
        const d = await getMoreData(c);
        console.log("Heaven", d);
    } catch(err) {
        console.error(err);
    }
}</code></pre>
                                </div>
                            </div>
                            
                            <p class="my-4">
                                <strong>Promise</strong> adalah objek yang merepresentasikan keberhasilan (resolve) atau kegagalan (reject) dari operasi asinkron. Dengan sintaks <code>async/await</code>, kode asinkron lo terlihat linear dan sinkron, sehingga sangat mudah dibaca.
                            </p>
                        </div>

                        <!-- 3C. HTTP Request Anatomy & API Control Room -->
                        <div class="mb-12">
                            <h3 class="text-[#0D0D0D] font-serif font-bold text-2xl">3C. Anatomi Komunikasi Internet (HTTP)</h3>
                            <p class="my-4">
                                Saat JavaScript memanggil <code>fetch('https://api.com/data')</code>, dia mengirimkan <strong>HTTP Request</strong>. Ini adalah standar format amplop pos di dunia internet. Amplop ini berisi:
                            </p>
                            <ul class="list-none space-y-3 pl-0 mb-6">
                                <li class="flex gap-4 items-center bg-white border border-gray-300 p-3 shadow-[1px_1px_0_#0D0D0D]">
                                    <span class="bg-[#0D0D0D] text-white px-2 py-1 text-xs font-bold">METHOD</span>
                                    <span class="text-sm">Tindakan apa? GET (minta), POST (kirim), PUT/PATCH (ubah), DELETE (hapus).</span>
                                </li>
                                <li class="flex gap-4 items-center bg-white border border-gray-300 p-3 shadow-[1px_1px_0_#0D0D0D]">
                                    <span class="bg-[#0D0D0D] text-white px-2 py-1 text-xs font-bold">HEADERS</span>
                                    <span class="text-sm">Informasi meta. Misalnya jenis data <code>Content-Type: application/json</code>.</span>
                                </li>
                                <li class="flex gap-4 items-center bg-white border border-gray-300 p-3 shadow-[1px_1px_0_#0D0D0D]">
                                    <span class="bg-[#0D0D0D] text-white px-2 py-1 text-xs font-bold">BODY</span>
                                    <span class="text-sm">Isi surat. Hanya ada di POST/PUT. Biasanya format JSON yang dikirim ke server.</span>
                                </li>
                            </ul>
                            
                            <!-- INTERACTIVE: API CONTROL ROOM -->
                            <div class="not-prose my-10 neo-card p-6 bg-white relative overflow-hidden shadow-[4px_4px_0_#0d0d0d]">
                                <div class="absolute top-0 right-0 bg-[#10b981] text-[#0d0d0d] px-3 py-1 text-xs font-mono font-bold uppercase border-l border-b border-[#0d0d0d]">API CONTROL ROOM</div>
                                <h4 class="font-serif text-xl font-bold mt-4 mb-2">Simulasi Kegagalan Jaringan</h4>
                                <p class="text-xs text-gray-600 mb-6">Di dunia nyata, API tidak selalu instan dan sukses. Atur delay jaringan dan probabilitas error, lalu tembak request untuk melihat bagaimana JavaScript menanganinya via Try/Catch.</p>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div class="space-y-6">
                                        <!-- Controls -->
                                        <div class="bg-gray-50 p-4 border border-gray-300">
                                            <div class="flex justify-between text-xs font-bold mb-2">
                                                <span>Network Delay (Latency)</span>
                                                <span id="api-delay-val">500ms</span>
                                            </div>
                                            <input type="range" id="api-delay" min="100" max="3000" step="100" value="500" class="neo-slider" oninput="document.getElementById('api-delay-val').innerText = this.value + 'ms'">
                                        </div>
                                        <div class="bg-gray-50 p-4 border border-gray-300">
                                            <div class="flex justify-between text-xs font-bold mb-2">
                                                <span>Error Probability</span>
                                                <span id="api-error-val">20%</span>
                                            </div>
                                            <input type="range" id="api-error" min="0" max="100" step="10" value="20" class="neo-slider" oninput="document.getElementById('api-error-val').innerText = this.value + '%'">
                                        </div>
                                        <button id="api-btn-simulate" onclick="runSimulatedNetworkFetch()" class="btn-ghost w-full py-3 text-sm uppercase tracking-wider font-bold">
                                            KIRIM HTTP REQUEST
                                        </button>
                                    </div>
                                    
                                    <!-- Result Terminal -->
                                    <div class="bg-[#0D0D0D] border border-gray-500 p-4 text-[#10b981] font-mono text-[10px] leading-relaxed relative flex flex-col h-full min-h-[200px]">
                                        <div class="flex justify-between border-b border-gray-700 pb-2 mb-2 text-gray-500 text-[8px] uppercase tracking-widest">
                                            <span>Terminal</span>
                                            <span>Status: <span id="api-term-status" class="text-yellow-500">Idle</span></span>
                                        </div>
                                        <div id="api-term-log" class="flex-grow overflow-y-auto whitespace-pre-wrap flex flex-col justify-end">
> Awaiting command...
                                        </div>
                                        <!-- Progress Bar -->
                                        <div class="h-1 w-full bg-gray-800 mt-2">
                                            <div id="api-term-progress" class="h-full bg-[#10b981] w-0 transition-all duration-75"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 3D. Modulo Cryptography & Caesar Cipher -->
                        <div class="mb-12">
                            <h3 class="text-[#0D0D0D] font-serif font-bold text-2xl">3D. Kriptografi Modulo: Menyembunyikan Rahasia di Klien</h3>
                            <p class="my-4">
                                Saat lo mendesain website tanpa server backend (hanya HTML statis), data rahasia seperti "kunci jawaban kuis" atau "skor sementara" mudah diintip user dengan fitur <em>Inspect Element</em>. Di situlah kita membutuhkan teknik <strong>Obfuscation</strong> atau penyandian ringan.
                            </p>
                            <p class="my-4">
                                Salah satu teknik tertua adalah <strong>Caesar Cipher</strong>. Penggeseran dilakukan lewat operasi penambahan dan <strong>Modulo (Sisa Bagi)</strong> agar saat mencapai huruf 'Z', dia kembali memutar ke huruf 'A'.
                            </p>

                            <!-- INTERACTIVE: ENIGMA CONVEYOR BELT -->
                            <div class="not-prose my-10 neo-card p-6 bg-white relative overflow-hidden shadow-[4px_4px_0_#0d0d0d]">
                                <div class="absolute top-0 left-0 bg-[#0d0d0d] text-white px-3 py-1 text-xs font-mono font-bold uppercase border-r border-b border-[#0d0d0d]">ENIGMA CONVEYOR BELT</div>
                                <h4 class="font-serif text-xl font-bold mt-8 mb-2">Simulasi Enkripsi Geser (Shift Cipher)</h4>
                                <p class="text-xs text-gray-600 mb-6">Pilih teks, atur nilai pergeseran (shift keys), dan lihat animasi bagaimana tiap karakter ditransformasikan melalui mesin Enigma Mini.</p>
                                
                                <div class="bg-gray-50 border border-[#0D0D0D] p-4 flex flex-col gap-4">
                                    <div class="flex gap-4 items-end">
                                        <div class="flex-grow">
                                            <label class="text-[10px] uppercase font-bold text-gray-500 block mb-1">Plaintext:</label>
                                            <input type="text" id="enigma-input" value="ALCHEMIST" maxlength="12" class="neo-input w-full p-2 uppercase font-mono text-sm tracking-widest text-center">
                                        </div>
                                        <div class="w-24">
                                            <label class="text-[10px] uppercase font-bold text-gray-500 block mb-1">Shift:</label>
                                            <input type="number" id="enigma-shift" value="3" min="-10" max="10" class="neo-input w-full p-2 font-mono text-sm text-center">
                                        </div>
                                        <button onclick="runEnigma()" class="btn-ghost px-4 py-2 text-sm uppercase font-bold h-[42px]">Proses</button>
                                    </div>
                                    
                                    <div class="mt-4 border-t border-gray-300 pt-4">
                                        <div class="text-[10px] font-bold text-gray-500 uppercase mb-2">Mesin Prosesor Karakter:</div>
                                        <div class="flex flex-col items-center gap-4 py-4">
                                            <!-- Input Row -->
                                            <div id="enigma-in-belt" class="conveyor-belt min-h-[50px] w-full justify-center"></div>
                                            <!-- Processor Node -->
                                            <div class="w-12 h-12 bg-[#0D0D0D] text-white flex items-center justify-center font-bold relative animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                                <span id="enigma-op-node">f(x)</span>
                                            </div>
                                            <!-- Output Row -->
                                            <div id="enigma-out-belt" class="conveyor-belt min-h-[50px] w-full justify-center border-[#10b981] bg-[#a7f3d0]/10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
`;
    html = html.slice(0, startIndex) + replacement + "\n\n                    " + html.slice(endIndex);
}

// Now replace JS
const jsStartMarker = '// --- POST-TEST START ---';
const jsStartIndex = html.indexOf(jsStartMarker);

if(jsStartIndex !== -1) {
    const jsReplacement = `// --- TIME MACHINE PROMISES LOGIC ---
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
            
            const createBox = (text, color) => \`<div class="bg-\${color}-100 border border-[#0D0D0D] p-1 text-center text-[10px] font-bold">\${text}</div>\`;
            const createBoxDark = (text) => \`<div class="bg-[#0D0D0D] text-[#10b981] border border-[#0D0D0D] p-1 text-center text-[10px] font-bold">\${text}</div>\`;
            
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
                textExp = "3. Promise diselesaikan, callback dari \`.then()\` tidak langsung jalan, melainkan dilempar ke Microtask Queue.";
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
            logBox.innerHTML = "> Fetching data from https://api.alchemist.com/secret...\\n";
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
                
                logBox.innerHTML += \`<span class="text-[#10b981]">> 200 OK</span>\\n> Payload: { "status": "success", "data": "Tembaga menjadi Emas" }\\n> Operation Completed.\`;
                statusLabel.innerText = "Success";
                statusLabel.className = "text-[#10b981]";
                
            } catch (error) {
                logBox.innerHTML += \`<span class="text-red-500">> ERR: \${error.message}</span>\\n> Catch block executed.\\n> Retrying is recommended.\`;
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
            
            opNode.innerText = shiftVal >= 0 ? \`+\${shiftVal}\` : shiftVal;
            
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

        // --- POST-TEST START ---`;

    html = html.slice(0, jsStartIndex) + jsReplacement + html.slice(jsStartIndex + jsStartMarker.length);
}

fs.writeFileSync('ch2_transmutation.html', html);
console.log('Update Complete.');
