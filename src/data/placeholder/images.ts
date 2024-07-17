import * as fs from 'fs';
const __dirname = import.meta.dirname;

export default [
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B8',
        data: fs.readFileSync(`${__dirname}/../images/apple.jpg`),
        mime_type: 'image/jpeg',
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B7',
        data: fs.readFileSync(`${__dirname}/../images/broccoli.jpg`),
        mime_type: 'image/jpeg',
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B5',
        data: fs.readFileSync(`${__dirname}/../images/nobody_cares.png`),
        mime_type: 'image/png',
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B4',
        data: fs.readFileSync(`${__dirname}/../images/aint_got_time.png`),
        mime_type: 'image/png',
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B3',
        data: fs.readFileSync(`${__dirname}/../images/aag.png`),
        mime_type: 'image/png',
    },
];