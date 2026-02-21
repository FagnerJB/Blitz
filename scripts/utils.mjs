import fs from 'fs/promises'

const getInfo = async () => {
   const filePath = './Blitz_template/current_book/OEBPS/content.opf'

   let data

   try {
      data = await fs.readFile(filePath, 'utf8')
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   let info = {}

   info.lang = data.match(/<dc:language>(.+)<\/dc:language>/)[1]
   info.title = data.match(/<dc:title id="t1">(.+)<\/dc:title>/)[1]
   info.author = data.match(/<dc:creator id="creator1">(.+)<\/dc:creator>/)[1]

   return info
}

export { getInfo }
