import mongoose from 'mongoose';
import { config } from 'dotenv';
import dbConnection from '../config/dbConnection.js';
import FileType from '../models/fileTypeModel.js';

config(); 

const fileTypes = [
  { label: 'PDF', key: 'pdf' },
  { label: 'ZIP', key: 'zip' },
  { label: 'MP4', key: 'mp4' },
  { label: 'MP3', key: 'mp3' },
  { label: 'JPG', key: 'jpg' },
  { label: 'PNG', key: 'png' },
  { label: 'GIF', key: 'gif' },
  { label: 'DOCX', key: 'docx' },
  { label: 'TXT', key: 'txt' },
  { label: 'EPUB', key: 'epub' },
  { label: 'EXE', key: 'exe' },
  { label: 'AVI', key: 'avi' },
  { label: 'MOV', key: 'mov' },
  { label: 'WMV', key: 'wmv' },
  { label: 'PSD', key: 'psd' },
  { label: 'AI', key: 'ai' },
  { label: 'SVG', key: 'svg' },
  { label: 'RTF', key: 'rtf' },
  { label: 'XLSX', key: 'xlsx' },
  { label: 'CSV', key: 'csv' },
  { label: 'JSON', key: 'json' }
];

const seedFileTypes = async () => {
  try {
    await dbConnection();
    await FileType.deleteMany();
    await FileType.insertMany(fileTypes);
    console.log('File types seeded successfully');
  } catch (err) {
    console.error('Error seeding file types:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedFileTypes();