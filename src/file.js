import fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);
console.log(__filename ,'filename')

const __dirname = path.dirname(__filename);
console.log(__dirname ,'dirname')

const  dataDirPath= path.join(__dirname,'..' ,"data")
const dataFilePath = path.join(dataDirPath, "users.json");



export const initializeDataFile =() =>{
  
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath, { recursive: true });
    console.log("data directory does not exist , creating.....");
  }
  else{
    console.log("data directory exists");
  }
  
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2), 'utf8');
     console.log("data directory does not exist , creating.....");
  } 
};
 export const readData = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      initializeDataFile();
    }
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read data: ${error.message}`);
  }
};

 export const writeData = (data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, jsonString, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write data: ${error.message}`);
  }
};



export const initializeAdmin = () => {
    const existing = readData();
    const hasAdmin = existing.some(u => u.role === 'admin');
    if (hasAdmin) {
        return;
    }
    const admin = {
        id: 1,
        name:process.env.ADMIN_NAME,
        phone:process.env.ADMIN_PHONE,
        email:process.env.ADMIN_EMAIL,
        password:process.env.ADMIN_PASS,
        role: 'admin',
    };
   
    
    
    existing.push(admin);
    writeData(existing);
};