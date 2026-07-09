import { useStore } from '@nanostores/react'

import { Codicon } from '@/components/ui/codicon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useRegistry, type RegistryProject } from '@/lib/use-registry'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  paused: 'bg-yellow-500/20 text-yellow-400',
  archived: 'bg-gray-500/20 text-gray-400',
  incubating: 'bg-blue-500/20 text-blue-400',
}

interface ProjectSelectorProps {
  className?: string
}

export function ProjectSelector({ className }: ProjectSelectorProps) {
  const { registry, selected, selectProject, loading } = useRegistry()

  if (loading || !registry || registry.projects.length <= 1) {
    return null
  }

  return (
    <div className={cn('px-2 py-1', className)}>
      <Select
        onValueChange={(id) => {
          const project = registry.projects.find((p) => p.id === id)
          if (project) selectProject(project)
        }}
        value={selected?.id || ''}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {registry.projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <span>{project.name}</span>
                <span className={cn('rounded px-1 py-0.5 text-[0.6rem] font-medium', STATUS_COLORS[project.status])}>
                  {project.status}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
