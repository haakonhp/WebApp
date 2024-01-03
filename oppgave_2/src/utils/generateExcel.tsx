import { ActivityResponse } from '@/types/activity';
import * as XLSX from 'xlsx';

// https://sheetjs.com/
export default function downloadExcel(jsonData: ActivityResponse) {
    if (!jsonData) {
        console.error('Invalid JSON data for Excel export');
        return;
    }

    const mainData = { ...jsonData };

    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet([mainData]);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Workout Details');

    const output = XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' });

    function jsonToArray(s: string) {
        if (!s) {
            console.error('Failed to generate Excel file');
            return new ArrayBuffer(0);
        }

        const buffer = new ArrayBuffer(s.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buffer;
    }

    const blob = new Blob([jsonToArray(output)], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "WorkoutDetails.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

