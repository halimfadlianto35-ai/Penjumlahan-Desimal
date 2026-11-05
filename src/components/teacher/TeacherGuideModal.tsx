import React from 'react';
import { X, Printer, BookOpen, AlertOctagon, CheckSquare, Lightbulb, FileText } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Panduan Guru & Rangkuman Materi Pembelajaran
              </h3>
              <p className="text-xs text-slate-500">
                Pedoman Pedagogis & Lembar Refleksi Pembelajaran Bilangan Desimal (SMP / SD Fase C-D)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed print:p-0 print:text-black">
          {/* Section 1: Tujuan Pembelajaran (Capaian Pembelajaran) */}
          <div className="space-y-2">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              1. Capaian & Tujuan Pembelajaran (TP)
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
              <li>Peserta didik mampu memahami konsep nilai tempat bilangan desimal (satuan, persepuluhan, perseratusan, perseribuan).</li>
              <li>Peserta didik mampu melakukan operasi penjumlahan bilangan desimal bersusun dengan menerapkan penyelarasan tanda koma dan teknik menyimpan.</li>
              <li>Peserta didik mampu melakukan operasi pengurangan bilangan desimal bersusun dengan menambahkan angka nol bantuan dan teknik meminjam.</li>
              <li>Peserta didik mampu menyelesaikan masalah kontekstual nyata yang berkaitan dengan berat, panjang, dan uang menggunakan desimal.</li>
            </ul>
          </div>

          {/* Section 2: 3 Miskonsepsi Utama Siswa */}
          <div className="space-y-3">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              2. Tiga Miskonsepsi Terbesar Siswa & Solusinya
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20">
                <div className="font-semibold text-rose-700 dark:text-rose-300 text-xs mb-1">
                  Miskonsepsi 1: Rata Kanan
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Siswa memperlakukan desimal seperti bilangan bulat biasa dengan meratakan digit paling kanan, sehingga persepuluhan dijumlahkan dengan perseratusan.
                </p>
                <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Solusi: Garis laser koma vertikal harus lurus tanpa kompromi!
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="font-semibold text-amber-700 dark:text-amber-300 text-xs mb-1">
                  Miskonsepsi 2: Lupa Nol Pengurang
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pada contoh 5,4 - 2,18, siswa langsung menurunkan angka 8 ke bawah tanpa meminjam.
                </p>
                <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Solusi: Biasakan menulis 5,40 sehingga terlihat jelas 0 - 8 memerlukan pinjaman.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20">
                <div className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs mb-1">
                  Miskonsepsi 3: Koma Berpindah
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Siswa menghitung jumlah angka di belakang koma seperti pada perkalian, lalu meletakkan koma di posisi yang salah.
                </p>
                <div className="mt-2 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Solusi: Tanda koma hanya "turun lift" tegak lurus ke hasil akhir.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Ringkasan Langkah Operasi (Cheatsheet) */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              3. Rumus Praktis Mengingat (Jingle Pembelajaran)
            </h4>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm text-center font-bold text-indigo-600 dark:text-indigo-400">
              "Luruskan Koma, Lengkapi Nolnya, Hitung dari Kanan, Turunkan Komanya!"
            </div>
          </div>

          {/* Section 4: Contoh Lembar Latihan Siswa */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              4. Lembar Latihan Singkat Mandiri
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center">
                1) 3,45 + 2,8 = ...
                <div className="text-[10px] text-slate-400 mt-1 font-sans">(Kunci: 6,25)</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center">
                2) 14,2 - 5,75 = ...
                <div className="text-[10px] text-slate-400 mt-1 font-sans">(Kunci: 8,45)</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center">
                3) 0,85 + 12,6 = ...
                <div className="text-[10px] text-slate-400 mt-1 font-sans">(Kunci: 13,45)</div>
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center">
                4) 20,0 - 7,42 = ...
                <div className="text-[10px] text-slate-400 mt-1 font-sans">(Kunci: 12,58)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
