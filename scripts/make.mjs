import fs from 'fs/promises'
import epubZip from 'epub-zip'
import { getInfo } from './utils.mjs'

const init = async () => {
   const info = await getInfo()

   const title = remSpaces(info.title)
   const author = remSpaces(info.author)
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
