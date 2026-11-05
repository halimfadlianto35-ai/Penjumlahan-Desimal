import { DecimalStepDetail, Operation, PlaceValueInfo } from '../types/math';

export const PLACE_VALUES: Record<number, PlaceValueInfo> = {
  2: { label: 'Ratusan', shortLabel: 'R', value: 100, fractionText: '100', color: 'text-purple-600', bgLight: 'bg-purple-50' },
  1: { label: 'Puluhan', shortLabel: 'P', value: 10, fractionText: '10', color: 'text-indigo-600', bgLight: 'bg-indigo-50' },
  0: { label: 'Satuan', shortLabel: 'S', value: 1, fractionText: '1', color: 'text-blue-600', bgLight: 'bg-blue-50' },
  [-1]: { label: 'Persepuluhan', shortLabel: '1/10', value: 0.1, fractionText: '1/10 (0,1)', color: 'text-emerald-600', bgLight: 'bg-emerald-50' },
  [-2]: { label: 'Perseratusan', shortLabel: '1/100', value: 0.01, fractionText: '1/100 (0,01)', color: 'text-amber-600', bgLight: 'bg-amber-50' },
  [-3]: { label: 'Perseribuan', shortLabel: '1/1000', value: 0.001, fractionText: '1/1000 (0,001)', color: 'text-rose-600', bgLight: 'bg-rose-50' },
};

export interface ProcessedDecimalNumber {
  raw: number;
  originalString: string;
  integerPart: string;
  fractionPart: string;
  paddedString: string;
  paddedFractionPart: string;
  hasGhostZeroes: boolean;
  ghostZeroCount: number;
}

export interface DecimalCalculationPlan {
  num1: ProcessedDecimalNumber;
  num2: ProcessedDecimalNumber;
  operation: Operation;
  maxDecimals: number;
  maxIntegers: number;
  resultRaw: number;
  resultString: string;
  columns: number[]; // e.g. [1, 0, -1, -2] (from left to right)
  steps: DecimalStepDetail[];
}

export function formatIndonesianNumber(val: number, maxFractionDigits: number = 3): string {
  // Use comma for decimal separator
  return val.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

export function parseIndonesianInput(input: string): number {
  const sanitized = input.trim().replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}

export function analyzeDecimal(num: number, targetFractionDigits: number): ProcessedDecimalNumber {
  const str = num.toString();
  const parts = str.split('.');
  const integerPart = parts[0] || '0';
  const fractionPart = parts[1] || '';
  const currentFractionDigits = fractionPart.length;

  const ghostZeroCount = Math.max(0, targetFractionDigits - currentFractionDigits);
  const paddedFractionPart = fractionPart + '0'.repeat(ghostZeroCount);
  const paddedString = targetFractionDigits > 0 
    ? `${integerPart},${paddedFractionPart}` 
    : integerPart;

  return {
    raw: num,
    originalString: currentFractionDigits > 0 ? `${integerPart},${fractionPart}` : integerPart,
    integerPart,
    fractionPart,
    paddedString,
    paddedFractionPart,
    hasGhostZeroes: ghostZeroCount > 0,
    ghostZeroCount,
  };
}

export function generateDecimalCalculationPlan(
  rawNum1: number,
  rawNum2: number,
  operation: Operation
): DecimalCalculationPlan {
  // For subtraction, ensure num1 >= num2 for primary school demo clarity
  let num1Val = rawNum1;
  let num2Val = rawNum2;
  if (operation === '-' && num1Val < num2Val) {
    // swap to keep positive for primary/middle school curriculum
    const temp = num1Val;
    num1Val = num2Val;
    num2Val = temp;
  }

  const str1 = num1Val.toString();
  const str2 = num2Val.toString();
  const frac1 = str1.split('.')[1] || '';
  const frac2 = str2.split('.')[1] || '';
  const maxDecimals = Math.max(frac1.length, frac2.length);

  const num1 = analyzeDecimal(num1Val, maxDecimals);
  const num2 = analyzeDecimal(num2Val, maxDecimals);

  const intMax = Math.max(num1.integerPart.length, num2.integerPart.length);
  const maxIntegers = Math.max(intMax, 1);

  // Columns from highest integer place to lowest decimal place
  // e.g. for 2 integer digits and 2 decimal digits: [1, 0, -1, -2]
  const columns: number[] = [];
  for (let p = maxIntegers - 1; p >= 0; p--) {
    columns.push(p);
  }
  for (let p = -1; p >= -maxDecimals; p--) {
    columns.push(p);
  }

  const steps: DecimalStepDetail[] = [];
  let stepCounter = 1;

  // Step 1: Align by decimal comma
  steps.push({
    stepIndex: stepCounter++,
    title: 'Luruskan Tanda Koma!',
    description: 'Tuliskan kedua bilangan bersusun ke bawah. Pastikan tanda koma (,) berada tepat sejajar satu garis vertikal.',
    narration: 'Langkah pertama dan paling penting: luruskan tanda koma tepat sejajar ke bawah!',
    highlightCommas: true,
  });

  // Step 2: Ghost zero if needed
  if (num1.hasGhostZeroes || num2.hasGhostZeroes) {
    const target = num1.hasGhostZeroes ? num1.originalString : num2.originalString;
    const ghostCount = num1.hasGhostZeroes ? num1.ghostZeroCount : num2.ghostZeroCount;
    steps.push({
      stepIndex: stepCounter++,
      title: 'Bantu dengan Angka Nol Bayangan (0)',
      description: `Panjang angka di belakang koma belum sama. Tambahkan ${ghostCount} angka 0 di belakang ${target} agar nilai tempatnya lengkap.`,
      narration: `Tambahkan angka nol bantuan di belakang agar jumlah angka desimal sama dan nilai tempat tidak tertukar.`,
      highlightGhostZero: true,
    });
  }

  // Calculate column by column from right to left (lowest decimal to highest integer)
  const calculationColumns = [...columns].reverse(); // from -maxDecimals up to maxIntegers-1
  let currentCarry = 0;
  const runningDigits: { [col: number]: number } = {};

  // For subtraction, keep track of borrows
  const workingNum1Digits: { [col: number]: number } = {};
  const workingNum2Digits: { [col: number]: number } = {};

  calculationColumns.forEach(col => {
    workingNum1Digits[col] = getDigitAtPlace(num1Val, col);
    workingNum2Digits[col] = getDigitAtPlace(num2Val, col);
  });

  if (operation === '+') {
    calculationColumns.forEach(col => {
      const placeInfo = PLACE_VALUES[col] || { label: `Nilai 10^${col}`, shortLabel: `${col}` };
      const d1 = getDigitAtPlace(num1Val, col);
      const d2 = getDigitAtPlace(num2Val, col);
      const sum = d1 + d2 + currentCarry;
      const resultDigit = sum % 10;
      const newCarry = Math.floor(sum / 10);

      const carryText = currentCarry > 0 ? ` + simpanan ${currentCarry}` : '';
      let desc = `Hitung kolom ${placeInfo.label}: ${d1} + ${d2}${carryText} = ${sum}.`;
      let narr = `Pada kolom ${placeInfo.label}, jumlahkan ${d1} ditambah ${d2}${carryText}, hasilnya ${sum}.`;

      if (newCarry > 0) {
        desc += ` Tulis ${resultDigit}, lalu simpan ${newCarry} ke kolom sebelah kiri.`;
        narr += ` Tulis angka ${resultDigit}, dan simpan ${newCarry} ke kolom sebelah kiri.`;
      } else {
        desc += ` Tulis ${resultDigit}.`;
        narr += ` Tulis angka ${resultDigit}.`;
      }

      runningDigits[col] = resultDigit;

      steps.push({
        stepIndex: stepCounter++,
        title: `Jumlahkan Kolom ${placeInfo.label}`,
        description: desc,
        narration: narr,
        columnFocus: col,
        carryOrBorrow: newCarry > 0 ? {
          type: 'carry',
          fromCol: col,
          toCol: col + 1,
          amount: newCarry,
        } : undefined,
      });

      currentCarry = newCarry;
    });

    // If there's a leftover carry at the very left
    if (currentCarry > 0) {
      const highestCol = Math.max(...columns) + 1;
      const placeInfo = PLACE_VALUES[highestCol] || { label: 'Kolom Terdepan' };
      steps.push({
        stepIndex: stepCounter++,
        title: `Turunkan Simpanan Terakhir`,
        description: `Turunkan angka simpanan ${currentCarry} pada kolom ${placeInfo.label}.`,
        narration: `Terakhir, turunkan angka simpanan ${currentCarry} ke posisi paling depan.`,
        columnFocus: highestCol,
      });
      runningDigits[highestCol] = currentCarry;
    }
  } else {
    // Subtraction
    calculationColumns.forEach((col, idx) => {
      const placeInfo = PLACE_VALUES[col] || { label: `Nilai 10^${col}`, shortLabel: `${col}` };
      let d1 = workingNum1Digits[col];
      const d2 = workingNum2Digits[col];

      if (d1 < d2) {
        // Need to borrow from the next column to the left
        const nextCol = calculationColumns[idx + 1];
        const nextPlaceInfo = PLACE_VALUES[nextCol] || { label: 'kolom sebelah kiri' };

        // Borrow 1 from nextCol
        const prevNextColVal = workingNum1Digits[nextCol];
        workingNum1Digits[nextCol] -= 1;
        const borrowedVal = d1 + 10;
        workingNum1Digits[col] = borrowedVal;

        steps.push({
          stepIndex: stepCounter++,
          title: `Pinjam dari Kolom ${nextPlaceInfo.label}`,
          description: `Karena ${d1} lebih kecil dari ${d2}, pinjam 1 dari ${nextPlaceInfo.label} (${prevNextColVal} menjadi ${workingNum1Digits[nextCol]}). Angka ${d1} bertambah 10 menjadi ${borrowedVal}.`,
          narration: `Karena angka ${d1} tidak cukup dikurangi ${d2}, pinjam 1 dari kolom ${nextPlaceInfo.label}. Angka berubah menjadi ${borrowedVal}.`,
          columnFocus: col,
          carryOrBorrow: {
            type: 'borrow',
            fromCol: nextCol,
            toCol: col,
            amount: 1,
            previousVal: prevNextColVal,
            newVal: workingNum1Digits[nextCol],
          },
        });

        d1 = borrowedVal;
      }

      const diff = d1 - d2;
      runningDigits[col] = diff;

      steps.push({
        stepIndex: stepCounter++,
        title: `Kurangkan Kolom ${placeInfo.label}`,
        description: `Hitung ${d1} - ${d2} = ${diff}. Tuliskan ${diff} di bawah garis.`,
        narration: `Kurangkan ${d1} dengan ${d2}, hasilnya adalah ${diff}.`,
        columnFocus: col,
      });
    });
  }

  // Final step: Drop the comma!
  const finalRawResult = operation === '+' ? num1Val + num2Val : num1Val - num2Val;
  const roundedResult = Math.round(finalRawResult * 1000000) / 1000000;
  const resultString = formatIndonesianNumber(roundedResult, maxDecimals);

  steps.push({
    stepIndex: stepCounter++,
    title: 'Turunkan Tanda Koma!',
    description: `Turunkan tanda koma lurus sejajar ke hasil akhir. Diperoleh jawaban: ${resultString}`,
    narration: `Terakhir, jangan lupa turunkan tanda koma tepat sejajar ke bawah. Hasil akhirnya adalah ${resultString}!`,
    highlightCommas: true,
  });

  return {
    num1,
    num2,
    operation,
    maxDecimals,
    maxIntegers,
    resultRaw: roundedResult,
    resultString,
    columns,
    steps,
  };
}

export function getDigitAtPlace(num: number, place: number): number {
  // place: 0 is units, 1 is tens, -1 is tenths, -2 is hundredths, etc.
  const str = num.toString();
  const parts = str.split('.');
  const intStr = parts[0] || '0';
  const fracStr = parts[1] || '';

  if (place >= 0) {
    const idx = intStr.length - 1 - place;
    if (idx >= 0 && idx < intStr.length) {
      return parseInt(intStr[idx], 10);
    }
    return 0;
  } else {
    const fracIdx = Math.abs(place) - 1;
    if (fracIdx >= 0 && fracIdx < fracStr.length) {
      return parseInt(fracStr[fracIdx], 10);
    }
    return 0;
  }
}
