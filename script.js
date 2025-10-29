// --- Inisialisasi Chart.js ---
let ekskulChart;

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi grafik saat DOM selesai dimuat
    initializeChart();
    
    // Setup event listener untuk Drag-and-Drop
    setupDragAndDrop();
    
    // Setup event listener untuk tombol Mulai Belajar
    document.getElementById('mulai-belajar').addEventListener('click', () => {
        document.getElementById('pembuka').style.display = 'none';
        document.getElementById('konten-utama').style.display = 'block';
    });
});

/**
 * Fungsi untuk menampilkan/menyembunyikan penjelasan singkat di bagian Materi Interaktif.
 * @param {string} id - ID tahap materi ('kumpul', 'olah', 'visual', 'interp').
 */
function showExplanation(id) {
    const expElement = document.getElementById(`exp-${id}`);
    const allExpElements = document.querySelectorAll('[id^="exp-"]');
    
    allExpElements.forEach(el => {
        if (el.id !== `exp-${id}` && !el.classList.contains('hidden')) {
            el.classList.add('hidden');
        }
    });

    // Toggle tampilan penjelasan
    expElement.classList.toggle('hidden');
}


// --- Latihan Interaktif: Kuis Pilihan Ganda ---

/**
 * Memeriksa jawaban Pilihan Ganda dan menghitung skor.
 */
function checkPG() {
    const answers = {
        soal1: "Visualisasi Data", // Jawaban C
        soal2: "Pengolahan Data"  // Jawaban B
    };
    let score = 0;
    const totalSoal = 2;
    const scorePerSoal = 100 / totalSoal;

    for (let i = 1; i <= totalSoal; i++) {
        const questionName = `soal${i}`;
        const feedbackElement = document.getElementById(`feedback${i}`);
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        
        // Reset feedback
        feedbackElement.classList.add('hidden');
        feedbackElement.textContent = '';
        feedbackElement.classList.remove('text-green-500', 'text-red-500');

        if (selectedOption) {
            const selectedJawaban = selectedOption.getAttribute('data-jawaban');
            if (selectedJawaban === answers[questionName]) {
                score += scorePerSoal;
                feedbackElement.textContent = "✅ Benar! Itu adalah tahap " + answers[questionName] + ".";
                feedbackElement.classList.add('text-green-500');
            } else {
                feedbackElement.textContent = "❌ Salah. Jawaban yang benar adalah " + answers[questionName] + ".";
                feedbackElement.classList.add('text-red-500');
            }
        } else {
            feedbackElement.textContent = "Silakan pilih jawaban terlebih dahulu.";
            feedbackElement.classList.add('text-red-500');
        }
        
        feedbackElement.classList.remove('hidden');
    }

    // Tampilkan skor
    const skorElement = document.getElementById('skor-pg');
    skorElement.textContent = `Skor Pilihan Ganda Anda: ${score} / 100`;
    
    // Simpan skor PG ke memori untuk Evaluasi Akhir
    localStorage.setItem('skorPG', score);
}

// --- Latihan Interaktif: Drag and Drop ---

/**
 * Menyiapkan fungsionalitas Drag-and-Drop.
 */
function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.drag-source');
    const dropTargets = document.querySelectorAll('.drop-target');

    draggables.forEach(drag => {
        drag.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            setTimeout(() => {
                e.target.classList.add('opacity-50', 'border-dashed');
            }, 0);
        });
        
        drag.addEventListener('dragend', (e) => {
            e.target.classList.remove('opacity-50', 'border-dashed');
        });
    });

    dropTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault(); // Mengizinkan drop
            target.classList.add('bg-blue-200'); // Efek hover saat drag di atas target
        });

        target.addEventListener('dragleave', (e) => {
            target.classList.remove('bg-blue-200');
        });

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('bg-blue-200');
            const data = e.dataTransfer.getData('text/plain');
            const draggableElement = document.getElementById(data);
            
            // Hanya izinkan satu elemen per target
            if (target.children.length === 0) {
                target.appendChild(draggableElement);
                draggableElement.classList.remove('bg-red-300', 'border-dashed'); // Hapus styling dari drag-source
                draggableElement.classList.add('bg-white', 'shadow'); // Tambah styling untuk elemen yang sudah didrop
            }
        });
    });
}

/**
 * Memeriksa urutan Drag-and-Drop dan menghitung skor.
 */
function checkDragDrop() {
    let correctDrops = 0;
    const totalDrops = 4;
    const scorePerDrop = 100 / totalDrops;

    for (let i = 1; i <= totalDrops; i++) {
        const dropTarget = document.getElementById(`drop-${i}`);
        const expectedOrder = dropTarget.getAttribute('data-expected');
        
        // Reset class
        dropTarget.classList.remove('correct-drop', 'incorrect-drop');
        
        if (dropTarget.children.length > 0) {
            const droppedElement = dropTarget.children[0];
            const actualOrder = droppedElement.getAttribute('data-order');
            
            if (actualOrder === expectedOrder) {
                correctDrops++;
                dropTarget.classList.add('correct-drop');
            } else {
                dropTarget.classList.add('incorrect-drop');
            }
        } else {
            dropTarget.classList.add('incorrect-drop');
        }
    }

    const finalScore = correctDrops * scorePerDrop;
    const skorElement = document.getElementById('skor-drag-drop');
    skorElement.textContent = `Skor Drag-and-Drop Anda: ${finalScore} / 100 (${correctDrops} urutan benar)`;
    
    // Simpan skor DD ke memori untuk Evaluasi Akhir
    localStorage.setItem('skorDD', finalScore);
}

// --- Simulasi Mini & Grafik Interaktif (Chart.js) ---

/**
 * Menginisialisasi grafik Chart.js.
 */
function initializeChart() {
    const ctx = document.getElementById('ekskulChart').getContext('2d');
    
    // Data awal
    const labels = ['Futsal', 'Pramuka', 'Robotik', 'Seni'];
    const dataValues = [50, 35, 15, 20];

    ekskulChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Siswa (Orang)',
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', // Merah
                    'rgba(54, 162, 235, 0.7)', // Biru
                    'rgba(255, 206, 86, 0.7)', // Kuning
                    'rgba(75, 192, 192, 0.7)'  // Hijau
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Siswa'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Tampilkan interpretasi awal
    updateInterpretation(dataValues, labels);
}

/**
 * Mengambil data dari input, memperbarui grafik, dan menampilkan interpretasi.
 */
function updateChart() {
    const labels = ['Futsal', 'Pramuka', 'Robotik', 'Seni'];
    const inputIds = ['input-futsal', 'input-pramuka', 'input-robotik', 'input-seni'];
    
    const newValues = inputIds.map(id => {
        // Pastikan nilai adalah angka dan tidak kurang dari 0
        return Math.max(0, parseInt(document.getElementById(id).value) || 0); 
    });

    // Update data grafik
    ekskulChart.data.datasets[0].data = newValues;
    ekskulChart.update();
    
    // Tampilkan interpretasi hasil analisis
    updateInterpretation(newValues, labels);
}

/**
 * Menampilkan hasil interpretasi data secara otomatis.
 * @param {number[]} data - Array jumlah siswa.
 * @param {string[]} labels - Array nama ekskul.
 */
function updateInterpretation(data, labels) {
    const totalSiswa = data.reduce((sum, current) => sum + current, 0);
    const maxSiswa = Math.max(...data);
    const minSiswa = Math.min(...data);
    
    const ekskulPopuler = labels[data.indexOf(maxSiswa)];
    const ekskulSepi = labels[data.indexOf(minSiswa)];
    
    let interpretationText = `Total siswa yang mengikuti survei adalah **${totalSiswa}** orang.`;
    
    if (totalSiswa > 0) {
        interpretationText += ` Kegiatan ekstrakurikuler yang paling diminati adalah **${ekskulPopuler}** dengan ${maxSiswa} siswa,`;
        interpretationText += ` sedangkan yang paling sedikit peminat adalah **${ekskulSepi}** dengan ${minSiswa} siswa.`;
        
        // Contoh analisis lanjutan:
        if (maxSiswa > totalSiswa * 0.5) {
             interpretationText += ` Ini menunjukkan **${ekskulPopuler}** adalah kegiatan yang sangat dominan.`;
        }
        
    } else {
        interpretationText = "Tidak ada data yang dimasukkan. Silakan masukkan angka di kolom input.";
    }

    // Menghilangkan tag HTML saat menampilkan ke innerHTML untuk keamanan.
    document.getElementById('interpretasi-hasil').innerHTML = interpretationText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

// --- Evaluasi Akhir ---

/**
 * Menghitung dan menampilkan skor total akhir.
 */
function hitungTotalSkor() {
    // Ambil skor dari localStorage, jika tidak ada, default ke 0
    const skorPG = parseFloat(localStorage.getItem('skorPG')) || 0;
    const skorDD = parseFloat(localStorage.getItem('skorDD')) || 0;
    
    const finalSkorPG = document.getElementById('final-skor-pg');
    const finalSkorDD = document.getElementById('final-skor-dd');
    const totalNilaiElement = document.getElementById('total-nilai');
    const finalKeterangan = document.getElementById('final-keterangan');

    finalSkorPG.textContent = skorPG.toFixed(0);
    finalSkorDD.textContent = skorDD.toFixed(0);

    // Nilai akhir adalah rata-rata dari kedua skor
    const totalNilai = ((skorPG + skorDD) / 2).toFixed(0);
    totalNilaiElement.textContent = totalNilai;

    let keterangan = "";
    if (totalNilai >= 90) {
        keterangan = "Luar Biasa! Pemahamanmu tentang Analisis Data sangat baik!";
        totalNilaiElement.classList.remove('text-red-600', 'text-yellow-600');
        totalNilaiElement.classList.add('text-green-600');
    } else if (totalNilai >= 70) {
        keterangan = "Bagus! Kamu telah memahami konsep dasar Analisis Data dengan baik.";
        totalNilaiElement.classList.remove('text-red-600', 'text-green-600');
        totalNilaiElement.classList.add('text-yellow-600');
    } else {
        keterangan = "Terus semangat belajar! Coba ulangi lagi materi dan latihannya.";
        totalNilaiElement.classList.remove('text-green-600', 'text-yellow-600');
        totalNilaiElement.classList.add('text-red-600');
    }
    
    finalKeterangan.textContent = keterangan;
}