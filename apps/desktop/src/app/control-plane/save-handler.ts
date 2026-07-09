// Helper: build control.yaml content from form state
export function buildControlYaml(opts: {
  mode: string
  budgetNum: number
  workersNum: number
  instruction: string
  allowedPaths: string[]
  forbiddenPaths: string[]
}): string {
  const lines: string[] = [
    'schema_version: 1',
    'mode: ' + opts.mode,
    'budget_usd: ' + opts.budgetNum,
    'parallel_workers: ' + opts.workersNum,
    'human_instruction: ' + JSON.stringify(opts.instruction),
    'allowed_paths: [' + opts.allowedPaths.map(p => JSON.stringify(p)).join(', ') + ']',
    'forbidden_paths: [' + opts.forbiddenPaths.map(p => JSON.stringify(p)).join(', ') + ']',
  ]
  return lines.join('\n')
}
