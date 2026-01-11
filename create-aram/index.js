#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectName = process.argv[2] || 'my-aram-app'
const targetDir = path.resolve(process.cwd(), projectName)

console.log(`
⚡ Creating Aram app: ${projectName}
`)

if (fs.existsSync(targetDir)) {
    console.log(`❌ Directory "${projectName}" already exists!`)
    process.exit(1)
}

const templateDir = path.join(__dirname, 'template')

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true })
    for (const file of fs.readdirSync(src)) {
        const srcFile = path.join(src, file)
        const destFile = path.join(dest, file)
        const stat = fs.statSync(srcFile)
        if (stat.isDirectory()) {
            copyDir(srcFile, destFile)
        } else {
            fs.copyFileSync(srcFile, destFile)
        }
    }
}

copyDir(templateDir, targetDir)

const pkgPath = path.join(targetDir, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
pkg.name = projectName
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

console.log(`✅ Done! To get started:

   cd ${projectName}
   npm install
   npm run dev

🚀 Happy coding in Aram!
`)
