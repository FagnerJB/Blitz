import fs from 'fs/promises'
import epubZip from 'epub-zip'
import { parseFile } from 'key-value-file'

const init = async () => {
   const info = await parseFile('./Blitz_template/current_book/INFO.env')

   const title = remSpaces(info.get('TITLE'))
   const author = remSpaces(info.get('AUTHOR'))
   await updateContent()

   const content = await epubZip('./Blitz_template/current_book')
   await fs.writeFile(`./Blitz_template/${author}-${title}.epub`, content)

   console.log('eBook created!')
}

const updateContent = async () => {
   const filePath = './Blitz_template/current_book/OEBPS/content.opf'
   let data

   try {
      data = await fs.readFile(filePath, 'utf8')
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   const utcNow = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

   data = data.replace(
      /(<meta property="dcterms:modified">)[^<]+(<\/meta>)/,
      `$1${utcNow}$2`,
   )

   try {
      await fs.writeFile(filePath, data)
   } catch (fail) {
      console.error('Error writing file:', fail)
      return
   }
}

const remSpaces = (text) => text.replace(/\W+/gi, '')

init()
