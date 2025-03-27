
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

// Add the correct types for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// School info for report headers
const SCHOOL_INFO = {
  name: "MADRASAH AT-TAHZIB KEKAIT",
  address: "Jl. Pariwisata, Kekait, Kec. Gunung Sari, Kabupaten Lombok Barat, Nusa Tenggara Barat 83351",
  phone: "0811-3908-8586",
  email: "madrasah.attahzib@gmail.com",
  website: "www.madrasahattahzib.com",
  logo: "/madrasah-logo.png" // Logo path (replace with actual logo)
};

// Function to add header with logo to PDF
export const addReportHeader = (doc: jsPDF, title: string): void => {
  // Add logo (aligned to left)
  try {
    doc.addImage("/placeholder.svg", "JPEG", 15, 10, 25, 25);
  } catch (error) {
    console.error("Error adding logo:", error);
    // Continue without logo if there's an error
  }
  
  // Add school info (aligned to center)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(SCHOOL_INFO.name, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(SCHOOL_INFO.address, doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
  
  const contactInfo = `Telp: ${SCHOOL_INFO.phone} | Email: ${SCHOOL_INFO.email}`;
  doc.text(contactInfo, doc.internal.pageSize.getWidth() / 2, 25, { align: "center" });
  
  // Add line separator
  doc.setLineWidth(0.5);
  doc.line(15, 30, doc.internal.pageSize.getWidth() - 15, 30);
  
  // Add report title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
  
  // Return starting Y position for the content
  return;
};
