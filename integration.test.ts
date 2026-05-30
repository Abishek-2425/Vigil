import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Integration Configuration Checks', () => {
  const rootDir = path.resolve(__dirname, './')

  it('Confirm .env.local is in .gitignore', () => {
    const gitignorePath = path.join(rootDir, '.gitignore')
    expect(fs.existsSync(gitignorePath)).toBe(true)
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
    
    // Check for .env.local or .env*
    const hasEnvLocal = gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env*')
    expect(hasEnvLocal).toBe(true)
  })

  it('Confirm all required environment variables are present in .env.local', () => {
    const envLocalPath = path.join(rootDir, '.env.local')
    expect(fs.existsSync(envLocalPath)).toBe(true)
    const envContent = fs.readFileSync(envLocalPath, 'utf8')

    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'CRON_SECRET',
      'GMAIL_USER',
      'GMAIL_APP_PASSWORD'
    ]

    for (const v of requiredVars) {
      expect(envContent).toContain(v)
      // Assert it is defined (i.e. has a value after '=')
      const regex = new RegExp(`^${v}=.+`, 'm')
      expect(envContent).toMatch(regex)
    }
  })

  it('Confirm vercel.json cron is correctly configured', () => {
    const vercelJsonPath = path.join(rootDir, 'vercel.json')
    expect(fs.existsSync(vercelJsonPath)).toBe(true)
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'))

    expect(vercelConfig.crons).toBeInstanceOf(Array)
    const cronEntry = vercelConfig.crons.find((c: any) => c.path === '/api/cron')
    expect(cronEntry).toBeDefined()
    expect(cronEntry.schedule).toBe('*/5 * * * *')
  })

  it('Confirm Supabase RLS policies are defined in schema.sql', () => {
    const schemaPath = path.join(rootDir, 'schema.sql')
    expect(fs.existsSync(schemaPath)).toBe(true)
    const schemaContent = fs.readFileSync(schemaPath, 'utf8')

    // Confirm RLS is enabled for all 3 tables
    expect(schemaContent).toContain('alter table public.monitors enable row level security')
    expect(schemaContent).toContain('alter table public.checks enable row level security')
    expect(schemaContent).toContain('alter table public.incidents enable row level security')

    // Confirm policies are created
    expect(schemaContent).toContain('create policy "Users can view their own monitors"')
    expect(schemaContent).toContain('create policy "Users can view checks of their own monitors"')
    expect(schemaContent).toContain('create policy "Users can view incidents of their own monitors"')
  })
})
