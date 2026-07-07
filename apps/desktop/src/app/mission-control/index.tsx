import { PAGE_INSET_X, PAGE_MAX_W } from '@/app/layout-constants'
import { cn } from '@/lib/utils'

import { BudgetBar } from './budget-bar'
import { GateFlow, type GateStats } from './gate-flow'
import { LiveTicker, type TickerEvent } from './live-ticker'
import { TickSummary } from './tick-summary'
import { type WorkerInfo, WorkerStatus } from './worker-status'

const EMPTY_TICK = null
const EMPTY_WORKERS: WorkerInfo[] = []

const EMPTY_GATES: GateStats = {
  T0: { pass_count: 0, fail_count: 0, last_transition: null },
  T1: { pass_count: 0, fail_count: 0, last_transition: null },
  T2: { pass_count: 0, fail_count: 0, last_transition: null },
  T3: { pass_count: 0, fail_count: 0, last_transition: null }
}

const EMPTY_EVENTS: TickerEvent[] = []

export function MissionControlView() {
  // TODO: wire to ledger-reader store / hooks
  const loading = true
  const tick = EMPTY_TICK
  const workers = EMPTY_WORKERS
  const gates = EMPTY_GATES
  const events = EMPTY_EVENTS

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
            <span className="inline-block size-1.5 rounded-full bg-yellow-500" />
            <span>waiting for ledger…</span>
          </div>
        </div>

        {/* Top row: tick summary + budget + workers */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TickSummary loading={loading} tick={tick} />
          <BudgetBar loading={loading} spent={0} total={25} />
          <WorkerStatus loading={loading} workers={workers} />
        </div>

        {/* Middle: gate flow */}
        <GateFlow gates={gates} loading={loading} />

        {/* Bottom: live ticker */}
        <LiveTicker events={events} loading={loading} />
      </div>
    </div>
  )
}
