const fs = require('fs/promises')

async function main() {
    const url = "https://api.memegen.link/templates/";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const templates = await response.json();
        let fileString = 'export default templates = [\n'

        for (const template of templates) {
            let { id, name, lines, keywords} = template
            name = name.toLowerCase()

            fileString += '\t{\n'
            fileString += `\t\tid: "${id}",\n`
            fileString += `\t\tname: "${name}",\n`
            fileString += `\t\tlines: ${lines},\n`
            fileString += `\t\tkeywords: [\n`

            for (let word of keywords) {
                word = word.toLowerCase()
                fileString += `\t\t\t"${word}",\n`
            }

            fileString += '\t\t],\n'
            fileString += '\t},\n'
        }

        fileString += ']'


        await fs.writeFile(
            `${__dirname}/placeholder/templates.js`,
            fileString
        )        

    } catch (error) {
        console.error(error.message);
    }
}
  
main().catch((err) => {
    console.error(
        'An error occurred while fetching template data: ',
        err,
    );
});