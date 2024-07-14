import fs from 'fs'

export default users = [
    {
        id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
        name: 'Alexus',
        password: '123456',
        profile_image: fs.readFileSync('./images/apple.jpg')
    },
    {
        id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
        name: 'Barney',
        password: '123456',
        profile_image: fs.readFileSync('./images/broccoli.jpg')
    },
    {
        id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
        name: 'Carrie',
        password: '123456',
        profile_image: fs.readFileSync('../images/carrot.jpg')
    },
];