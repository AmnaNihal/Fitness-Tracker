import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas'; // Make sure to npm install html2canvas

export const generatePDFReport = async (userProfile, workouts) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Set Background to Black
  doc.setFillColor(20, 20, 20); 
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Header & Title
  doc.setFontSize(22);
  doc.setTextColor(191, 255, 0); // Lime Green
  doc.text('FITNESS TRACKER PROGRESS REPORT', 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 33);

  // 3. CAPTURE & ADD CHART IMAGE
  const chartElement = document.getElementById('volume-chart-id');
  let currentY = 48; // Where the next element starts if no chart

  if (chartElement) {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#141414',
      scale: 2, // High resolution
    });
    const imgData = canvas.toDataURL('image/png');
    // Add image: doc.addImage(imageData, format, x, y, width, height)
    doc.addImage(imgData, 'PNG', 14, 40, 182, 60);
    currentY = 110; // Push stats down so they don't overlap the chart
  }

  // 4. Athlete Stats Section
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('Athlete Overview', 14, currentY);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Name', 'Weight', 'Height', 'Calorie Goal']],
    body: [[
      userProfile.name, 
      `${userProfile.weight} kg`, 
      `${userProfile.height} cm`, 
      `${userProfile.dailyCalorieGoal} kcal`
    ]],
    theme: 'grid',
    styles: { 
      fillColor: [30, 30, 30], 
      textColor: [255, 255, 255], 
      lineColor: [60, 60, 60] 
    },
    headStyles: { 
      fillColor: [191, 255, 0], 
      textColor: [0, 0, 0],
      fontStyle: 'bold' 
    }
  });

  // 5. Workout History Section
  const nextY = doc.lastAutoTable.finalY + 15;
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('Recent Workout History', 14, nextY);
  
  const workoutData = workouts.map(w => [
    new Date(w.createdAt).toLocaleDateString(),
    w.name,
    w.category,
    w.exercises ? w.exercises.length : 0
  ]);

  autoTable(doc, {
    startY: nextY + 5,
    head: [['Date', 'Workout', 'Category', 'Exercises']],
    body: workoutData,
    theme: 'striped',
    styles: { 
      fillColor: [25, 25, 25], 
      textColor: [220, 220, 220],
      lineColor: [40, 40, 40]
    },
    headStyles: { 
      fillColor: [191, 255, 0], 
      textColor: [0, 0, 0],
      fontStyle: 'bold' 
    },
    alternateRowStyles: {
      fillColor: [35, 35, 35] 
    }
  });

  // 6. Save the PDF
  doc.save(`${userProfile.name.replace(/\s+/g, '_')}_Pro_Report.pdf`);
};