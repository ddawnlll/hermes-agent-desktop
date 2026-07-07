import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

import { PAGE_INSET_X, PAGE_MAX_W } from '@/app/layout-constants'
import { Codicon } from '@/components/ui/codicon'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// ── Stub — subagent will flesh these out ────────────────────────────────

export function MissionControlView() {
  return (
    <div className={cn('flex h-full flex-col overflow-y-auto', PAGE_INSET_X)}>
      <div className={cn('mx-auto flex w-full flex-col gap-6 py-6', PAGE_MAX_W)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Mission Control</h1>
            <p className="mt-1 text-sm text-muted-foreground">AlphaForge orchestrator dashboard</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Codicon name="broadcast" className="size-3" />
            <span>disconnected</span>
          </div>
        </div>

        {/* Placeholder grid — TODO: real components from subagent */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <PanelSkeleton title="Tick Summary" />
          <PanelSkeleton title="Budget" />
          <PanelSkeleton title="Worker Status" />
          <PanelSkeleton title="Gate Flow" />
          <PanelSkeleton title="Live Ticker" className="md:col-span-2 lg:col-span-2" />
        </div>
      </div>
    </div>
  )
}

function PanelSkeleton({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-(--ui-stroke-tertiary) bg-(--ui-editor-surface-background) p-4', className)}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}
