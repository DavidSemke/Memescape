import * as fs from "fs"
import { v4 as uuidv4 } from "uuid"
const __dirname = import.meta.dirname

export default function createUserImageData() {
  const fileNames = fs.readdirSync(`${__dirname}/../images/user`)

  return fileNames.map((name) => {
    let ext = name.split(".")[1]

    if (ext === "jpg") {
      ext = "jpeg"
    }

    return {
      id: uuidv4(),
      data: fs.readFileSync(`${__dirname}/../images/user/${name}`),
      mime_type: `image/${ext}`,
    }
  })
}
