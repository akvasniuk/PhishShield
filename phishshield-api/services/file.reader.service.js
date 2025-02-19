const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const {fromBufferWithMime} = require("textract");

async function readFileByMimeType(file) {
    const {mimetype, data} = file;

    try {
        switch (mimetype) {
            case 'application/pdf':
                return await readPdf(data);

            case 'application/octet-stream':
                return readTxt(data);

            case 'text/plain':
                return readTxt(data);

            case 'application/msword':
                return await readDoc(data);

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return await readDocx(data);

            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return readXlsx(data);

            default:
                throw new Error(`Format ${mimetype} doesn't support.`);
        }
    } catch (error) {
        console.error('Reading error:', error);
        return 'Occur error when reading file';
    }
}

async function readDocx(buffer) {
    const {value} = await mammoth.extractRawText({buffer});
    return value;
}

function readDoc(buffer) {
    return new Promise((resolve, reject) => {
        fromBufferWithMime('application/msword', buffer, (error, text) => {
            if (error) return reject(error);
            resolve(text);
        });
    });
}

async function readPdf(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
}

function readTxt(buffer) {
    return buffer.toString('utf-8');
}

function readXlsx(buffer) {
    const workbook = xlsx.read(buffer, {type: 'buffer'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return xlsx.utils.sheet_to_csv(worksheet);
}

module.exports = {
    readFileByMimeType
}
