import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

import { PAGE_INSET_X, PAGE_MAX_W } from '@/app/layout-constants'
import { Codicon } from '@/components/ui/codicon'
import { cn } from '@/lib/utils'

export function ControlPlaneView() {
  const [mode, setMode] = useState('auto')
  const [budget, setBudget] = useState('25')
  const [parallelWorkers, setParallelWorkers] = useState('3')

  return (
    <div className={cn('flex h-full flex-col overflow-y-auto', PAGE_INSET_X)}>
      <div className={cn('mx-auto flex w-full flex-col gap-6 py-6', PAGE_MAX_W)}>
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Control Plane</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Orchestrator configuration — reads/writes <code className="rounded bg-(--ui-editor-surface-background) px-1 py-0.5 text-xs">control.yaml</code>
          </p>
        </div>

        {/* Placeholder form — TODO: real form from subagent */}
        <div className="rounded-lg border border-(--ui-stroke-tertiary) bg-(--ui-editor-surface-background) p-6">
          <h2 className="mb-4 text-sm font-semibold">Control Plane form will go here</h2>
          <p className="text-xs text-muted-foreground">Human instruction, budget, parallel workers, allowed/forbidden paths</p>
        </div>
      </div>
    </div>
  )
}
