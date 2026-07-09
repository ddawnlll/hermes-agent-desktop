import { readDesktopFileText } from '@/lib/desktop-fs'

// ── Types ────────────────────────────────────────────────────────────────────

export interface RegistryProject {
  id: string
  name: string
  adapter: string
  ledger_path: string
  board_name: string
  status: 'active' | 'paused' | 'archived' | 'incubating'
  goal_status: string
  registered_at: string
}

export interface Registry {
  schema_version: number
  projects: RegistryProject[]
}

// ── Reader ───────────────────────────────────────────────────────────────────

const REGISTRY_PATHS = [
  '~/.hermes-pack/registry.yaml',
  '~/.hermes/registry.yaml',
]

function expandHome(p: string): string {
  if (p.startsWith('~/') || p === '~') {
    const home = process.env.HOME || process.env.USERPROFILE || '~'
    return p.replace(/^~/, home)
  }
  return p
}

/**
 * Parse a simple YAML array of objects.
 * Handles the registry.yaml format:
 *   schema_version: 1
 *   projects:
 *     - id: foo
 *       name: Foo
 *       ...
 */
function parseRegistryYaml(text: string): Registry | null {
  try {
    const lines = text.split('\n')
    const result: Record<string, unknown> = {}
    let currentArray: Record<string, unknown>[] | null = null
    let currentObj: Record<string, unknown> | null = null
    let currentKey = ''

    for (const raw of lines) {
      const line = raw.replace(/#.*$/, '').trim()
      if (!line) continue

      // Top-level key
      const topMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/)
      if (topMatch && !line.startsWith(' ')) {
        const key = topMatch[1]
        const val = topMatch[2].trim()
        if (val === '') {
          // Could be array start
          currentKey = key
          currentArray = []
          result[key] = currentArray
        } else {
          result[key] = parseYamlValue(val)
          currentArray = null
          currentObj = null
        }
        continue
      }

      // Array item start
      if (line.startsWith('- ')) {
        if (currentArray) {
          currentObj = {}
          currentArray.push(currentObj)
          const rest = line.slice(2).trim()
          if (rest.includes(':')) {
            const [k, v] = rest.split(':', 2)
            currentObj[k.trim()] = parseYamlValue(v.trim())
          }
        }
        continue
      }

      // Object key-value inside array item
      if (currentObj && line.match(/^\s+[a-zA-Z_]/)) {
        const kvMatch = line.match(/^\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/)
        if (kvMatch) {
          currentObj[kvMatch[1]] = parseYamlValue(kvMatch[2].trim())
        }
      }
    }

    if (typeof result.schema_version !== 'number') return null
    if (!Array.isArray(result.projects)) return null

    return {
      schema_version: result.schema_version as number,
      projects: (result.projects as Record<string, unknown>[]).map((p) => ({
        id: String(p.id || ''),
        name: String(p.name || ''),
        adapter: String(p.adapter || ''),
        ledger_path: String(p.ledger_path || ''),
        board_name: String(p.board_name || ''),
        status: validateStatus(p.status),
        goal_status: String(p.goal_status || 'none'),
        registered_at: String(p.registered_at || ''),
      })),
    }
  } catch {
    return null
  }
}

function parseYamlValue(val: string): unknown {
  if (val === 'true') return true
  if (val === 'false') return false
  if (val === 'null' || val === '~') return null
  if (/^-?\d+\.?\d*$/.test(val)) {
    const num = Number(val)
    if (!Number.isNaN(num)) return num
  }
  // Strip quotes
  if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
    return val.slice(1, -1)
  }
  return val
}

function validateStatus(val: unknown): RegistryProject['status'] {
  if (val === 'active' || val === 'paused' || val === 'archived' || val === 'incubating') return val
  return 'active'
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Read the hermes-pack registry.yaml from known locations.
 * Returns null if no registry file is found.
 */
export async function readRegistry(): Promise<Registry | null> {
  for (const relPath of REGISTRY_PATHS) {
    try {
      const fullPath = expandHome(relPath)
      const result = await readDesktopFileText(fullPath)
      if (result.binary) continue
      const parsed = parseRegistryYaml(result.text)
      if (parsed && parsed.projects.length > 0) return parsed
    } catch {
      // ENOENT or parse error — try next path
    }
  }
  return null
}

/**
 * Get the default project (first active one, or first overall).
 */
export function getDefaultProject(registry: Registry): RegistryProject | null {
  const active = registry.projects.filter((p) => p.status === 'active')
  return active[0] || registry.projects[0] || null
}
