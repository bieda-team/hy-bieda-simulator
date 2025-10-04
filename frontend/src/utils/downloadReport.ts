"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ensure correct import
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface PensionReportData {
  date: string;
  time: string;
  expectedPension: number;
  age: number;
  gender: string;
  income: number;
  includesSickLeave: boolean;
  savings: number;
  actualPension: number;
  adjustedPension: number;
  postalCode: string;
}

/**
 * Generates and triggers a download of a PDF pension report.
 */
export function downloadPDFReport(data: PensionReportData) {
  try {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Raport prognozy emerytury", 14, 20);
    doc.setFontSize(12);
    doc.text(`Data wygenerowania: ${data.date} ${data.time}`, 14, 30);

    (autoTable as any)(doc, {
      startY: 40,
      head: [["Parametr", "Wartość"]],
      body: [
        ["Oczekiwana emerytura", `${data.expectedPension} PLN`],
        ["Wiek", data.age.toString()],
        ["Płeć", data.gender],
        ["Wynagrodzenie", `${data.income} PLN`],
        ["Uwzględniał okresy choroby", data.includesSickLeave ? "Tak" : "Nie"],
        ["Środki na koncie i Subkoncie", `${data.savings} PLN`],
        ["Emerytura rzeczywista", `${data.actualPension} PLN`],
        ["Emerytura urealniona", `${data.adjustedPension} PLN`],
        ["Kod pocztowy", data.postalCode],
      ],
    });

    doc.save(`raport_emerytura_${data.date}.pdf`);
  } catch (err) {
    console.error("Błąd generowania PDF:", err);
    alert("Nie udało się wygenerować raportu PDF.");
  }
}

/**
 * Exports usage data for administrators as XLSX.
 */
export function downloadXLSXReport(records: PensionReportData[]) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Raport Użycia");

    const xlsData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `raport_uzycia_${new Date().toISOString().split("T")[0]}.xlsx`);
  } catch (err) {
    console.error("Błąd generowania XLSX:", err);
    alert("Nie udało się pobrać raportu XLSX.");
  }
}
