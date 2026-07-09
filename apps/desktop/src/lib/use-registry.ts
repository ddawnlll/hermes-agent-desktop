import { useEffect, useState } from 'react'
import { getDefaultProject, readRegistry, type Registry, type RegistryProject } from './registry-reader'
import { setLedgerPath } from './ledger-reader'

const STORAGE_KEY = 'hermes-selected-project-id'

export function useRegistry() {
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const reg = await readRegistry()
      if (cancelled) return
      setRegistry(reg)
      if (reg) {
        // Auto-select if nothing selected or selection is invalid
        const valid = reg.projects.find((p) => p.id === selectedId)
        if (!valid) {
          const def = getDefaultProject(reg)
          if (def) {
            setSelectedId(def.id)
            setLedgerPath(def.ledger_path)
          }
        } else {
          setLedgerPath(valid.ledger_path)
        }
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const selectProject = (project: RegistryProject) => {
    setSelectedId(project.id)
    setLedgerPath(project.ledger_path)
    try { localStorage.setItem(STORAGE_KEY, project.id) } catch { /* noop */ }
  }

  const selected = registry?.projects.find((p) => p.id === selectedId) || null

  return { registry, selected, selectProject, loading }
}
