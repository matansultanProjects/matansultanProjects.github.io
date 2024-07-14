const API_KEY = 'AIzaSyCMK7424Okm_fN04bZbDK4eL-mn9IDYZrI';

async function convertToVCF() {
    const sheetUrl = document.getElementById('sheetUrl').value;
    const classNumber = document.getElementById('classNumber').value;

    const sheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)[1];
    const range = 'A2:J'; // Assuming the data might go up to column J

    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${API_KEY}`);
        const data = await response.json();

        if (data.values) {
            let vcfContent = '';

            data.values.forEach(row => {
                const [studentName, , , status, , studentPhone, , parentPhone] = row;

                if (status && status.trim() === "לומד") {
                    if (studentPhone) {
                        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${studentName} ${classNumber} פייתון\nTEL;TYPE=CELL:${studentPhone}\nEND:VCARD\n`;
                    }
                    if (parentPhone) {
                        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:הורה של ${studentName} מקבוצה ${classNumber}\nTEL;TYPE=CELL:${parentPhone}\nEND:VCARD\n`;
                    }
                }
            });

            if (vcfContent) {
                const blob = new Blob([vcfContent], { type: 'text/vcard' });
                const url = URL.createObjectURL(blob);

                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = url;
                downloadLink.download = `class_${classNumber}.vcf`;
                downloadLink.style.display = 'block';
            } else {
                alert('לא נמצאו נתונים ליצירה קובץ VCF');
            }
        } else {
            alert('לא נמצאו נתונים בגיליון');
        }
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        alert('שגיאה בעת שליפת הנתונים או עיבודם');
    } finally {
        loadingSpinner.style.display = 'none';
    }
}
