// utils/exportUtils.js

// 导出 CSV 格式
export const exportToCSV = (data, filename = 'data.csv') => {
  console.log('Data to be exported to CSV:', data); // 打印导出的数据
  const csvContent = "data:text/csv;charset=utf-8,"
    + data.map(e => Object.values(e).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


// 导出 PDF 格式
import jsPDF from 'jspdf';
export const exportToPDF = (data, filename = 'data.pdf') => {
  const doc = new jsPDF();
  let y = 10;

  data.forEach(item => {
    doc.text(`Title: ${item.title}`, 10, y);
    doc.text(`Content: ${item.content}`, 10, y + 10);
    y += 20;
  });

  doc.save(filename);
};
