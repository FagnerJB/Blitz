import fs from 'fs/promises'
import inquirer from 'inquirer'
import { parseFile } from 'key-value-file'
import { randomUUID } from 'crypto'

const templates = [
   {
      role: 'chapter',
      file: 'chapter',
      type: 'bodymatter',
      nav: true,
      toc: true,
   },
   {
      role: 'prologue',
      file: 'prologue',
      type: 'bodymatter',
      nav: true,
      toc: true,
   },
   {
      role: 'epilogue',
      file: 'epilogue',
      type: 'bodymatter',
      nav: true,
      toc: true,
   },
   {
      role: 'dedication',
      file: 'dedication',
      type: 'frontmatter',
      nav: true,
      toc: false,
   },
   {
      role: 'preface',
      file: 'preface',
      type: 'frontmatter',
      nav: true,
      toc: false,
   },
   {
      role: 'introduction',
      file: 'introduction',
      type: 'frontmatter',
      nav: true,
      toc: false,
   },
   {
      file: 'credits',
      role: 'other-credits',
      type: 'backmatter',
      nav: true,
      toc: true,
   },
   {
      role: 'appendix',
      file: 'appendix',
      type: 'backmatter',
      nav: true,
      toc: false,
   },
   {
      role: 'conclusion',
      file: 'conclusion',
      type: 'backmatter',
      nav: true,
      toc: false,
   },
   {
      role: 'acknowledgments',
      file: 'acknowledgments',
      type: 'frontmatter',
      nav: true,
      toc: false,
   },
   {
      role: 'foreword',
      file: 'foreword',
      type: 'frontmatter',
      nav: true,
      toc: false,
   },
   {
      role: 'preamble',
      file: 'preamble',
      type: 'frontmatter',
      nav: false,
      toc: false,
   },
   {
      role: 'division',
      file: 'division',
      type: 'bodymatter',
      nav: true,
      toc: false,
   },
   {
      role: 'afterword',
      file: 'afterword',
      type: 'backmatter',
      nav: true,
      toc: false,
   },
]

const init = async () => {
   try {
      await fs.access(
         './Blitz_template/current_book/INFO.env',
         fs.constants.F_OK,
      )
   } catch {
      try {
         await newBook()
      } catch (fail) {
         console.error(fail)
      }
   }

   newTemplates()
}

const newBook = async () => {
   console.log('Creating new Book..')

   try {
      await fs.cp(
         './Blitz_template/Blitz_epub3',
         './Blitz_template/current_book',
         { recursive: true },
      )
   } catch (fail) {
      console.error('Book not copied:', fail)
      return
   }

   await fs.rm('./Blitz_template/current_book/OEBPS/templates', {
      recursive: true,
      force: true,
   })

   const answers = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Title:', required: true },
      {
         type: 'input',
         name: 'subtitle',
         message: 'Subtitle/Short description:',
         required: true,
      },
      { type: 'input', name: 'author', message: 'Author:', required: true },
      {
         type: 'input',
         name: 'lang',
         message: 'Language Code:',
         default: 'en',
         required: true,
      },
      {
         type: 'input',
         name: 'ean',
         message: 'EAN:',
         default: '',
      },
      {
         type: 'input',
         name: 'isbn',
         message: 'ISBN:',
         default: '',
      },
   ])

   const info = await parseFile('./Blitz_template/current_book/INFO.env')

   info
      .set('TITLE', answers.title)
      .set('AUTHOR', answers.author)
      .set('LANG', answers.lang)
      .writeFile()

   const files = [
      'content.opf',
      'toc.ncx',
      'content/00-cover.xhtml',
      'nav.xhtml',
      'content/00-titlepage.xhtml',
   ]

   const names = answers.author.trim().split(/\s+/)
   const last = names.pop()

   const replaces = {
      '%TITLE%': answers.title,
      '%SUBTITLE%': answers.subtitle,
      '%AUTHOR%': answers.author,
      '%LANG%': answers.lang,
      '%AUTHOR_REVERSE%': `${last}, ${names.join(' ')}`,
      '%ISBN%': answers.isbn,
      '%EAN%': answers.ean,
      '%UNIQUE%': randomUUID(),
   }

   files.forEach(async (file) => {
      await updateFile(`./Blitz_template/current_book/OEBPS/${file}`, replaces)
   })
}

const updateFile = async (filePath, replaces) => {
   let data

   try {
      data = await fs.readFile(filePath, 'utf8')
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   for (const [search, replace] of Object.entries(replaces)) {
      data = data.replaceAll(search, replace)
   }

   try {
      await fs.writeFile(filePath, data)
   } catch (fail) {
      console.error('Error writing file:', fail)
      return
   }
}

const newTemplates = async () => {
   const answers = await inquirer.prompt([
      {
         type: 'select',
         name: 'template',
         message: `Select a template to add:`,
         loop: false,
         default: 0,
         required: true,
         choices: templates.map(({ file }, idx) => ({
            value: idx,
            name: file,
         })),
      },
      {
         type: 'number',
         default: 1,
         min: 1,
         name: 'quantity',
         message: 'How many?',
         required: true,
      },
   ])

   const template = templates[answers.template]
   let files

   try {
      files = await fs.readdir('./Blitz_template/current_book/OEBPS/content')
   } catch (fail) {
      console.error('Error reading directory:', fail)
      return
   }

   for (let index = 0; index < answers.quantity; index++) {
      let count = files.length - 2 + index
      count = count.toString().padStart(2, '0')

      await updateNav(template, count)
      await updateContent(template, count)
      await updateToc(template, count)
      await creteTemplate(template, count)
   }
}

const updateNav = async (template, count) => {
   const filePath = './Blitz_template/current_book/OEBPS/nav.xhtml'
   let data

   try {
      data = await fs.readFile(filePath, 'utf8')
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   data = data.replace(
      '<!-- %NAV_ITEMS% -->',
      `<li>
   <a href="content/${count}-${template.file}.xhtml">${template.file}</a>
</li>
<!-- %NAV_ITEMS% -->`,
   )

   try {
      await fs.writeFile(filePath, data)
   } catch (fail) {
      console.error('Error writing file:', failç)
      return
   }

   console.log('Nav updated!')
}

const updateContent = async (template, count) => {
   const filePath = './Blitz_template/current_book/OEBPS/content.opf'
   let data

   try {
      data = await fs.readFile(filePath, 'utf8')
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   data = data.replace(
      '<!-- %MANIFEST_ITEMS% -->',
      `<item href="content/${count}-${template.file}.xhtml" id="xhtml-${count}-${template.file}" media-type="application/xhtml+xml" />
<!-- %MANIFEST_ITEMS% -->`,
   )
   data = data.replace(
      '<!-- %SPINE_ITEMS% -->',
      `<itemref idref="xhtml-${count}-${template.file}" />
<!-- %SPINE_ITEMS% -->`,
   )

   try {
      await fs.writeFile(filePath, data)
   } catch (fail) {
      console.error('Error writing file:', fail)
      return
   }

   console.log('Content updated!')
}

const updateToc = async (template, count) => {
   const filePath = './Blitz_template/current_book/OEBPS/toc.ncx'
   let data

   try {
      data = await fs.readFile(filePath, 'utf8')
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   data = data.replace(
      '<!-- %TOC_ITEMS% -->',
      `<navPoint id="nav-${count}">
   <navLabel>
      <text>${template.file}</text>
   </navLabel>
   <content src="content/${count}-${template.file}.xhtml" />
</navPoint>
<!-- %TOC_ITEMS% -->`,
   )

   try {
      fs.writeFile(filePath, data)
   } catch (fail) {
      console.error('Error writing file:', fail)
      return
   }

   console.log('Toc updated!')
}

const creteTemplate = async (template, count) => {
   let data

   try {
      data = await fs.readFile(
         './Blitz_template/Blitz_epub3/OEBPS/templates/TEMPLATE.xhtml',
         'utf8',
      )
   } catch (fail) {
      console.error('Error reading file:', fail)
      return
   }

   const info = await parseFile('./Blitz_template/current_book/INFO.env')

   data = data.replaceAll('%TITLE%', info.get('TITLE'))
   data = data.replaceAll('%LANG%', info.get('LANG'))
   data = data.replaceAll('%ROLE%', template.role)
   data = data.replaceAll('%TYPE%', template.type)
   data = data.replaceAll('%FILE%', template.file)

   try {
      await fs.writeFile(
         `./Blitz_template/current_book/OEBPS/content/${count}-${template.file}.xhtml`,
         data,
      )
   } catch (fail) {
      console.error('Error writing file:', fail)
      return
   }

   console.log('Template created!')
}

init()
