#!/usr/bin/env tsx
import { execSync } from 'child_process'
import readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
rl.question('This will DROP all data. Type "yes" to continue: ', (answer) => {
  rl.close()
  if (answer.trim() !== 'yes') {
    console.log('Aborted.')
    process.exit(0)
  }
  console.log('Running migrate:fresh...')
  execSync('pnpm payload migrate:fresh', { stdio: 'inherit' })
})
