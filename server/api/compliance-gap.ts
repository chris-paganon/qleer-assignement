import type {
  ClauseStatusRecord,
  ComplianceGapGroup,
  ComplianceGapStatus,
  EvaluationDataset
} from '~~/shared/types/evaluation'
import evaluationFixture from '~~/server/data/evaluation.json'

const statusOrder: ComplianceGapStatus[] = ['FAIL', 'MISSING', 'N/A']

const statusLabels: Record<ComplianceGapStatus, string> = {
  FAIL: 'Fails',
  MISSING: 'Missing info',
  'N/A': 'Not applicable'
}

function compareRecords(a: ClauseStatusRecord, b: ClauseStatusRecord) {
  return a.index - b.index || a.created_at.localeCompare(b.created_at)
}

export default defineEventHandler(async (): Promise<ComplianceGapGroup[]> => {
  const dataset = evaluationFixture as EvaluationDataset

  return statusOrder.map((status) => {
    const items = dataset
      .filter((item): item is ClauseStatusRecord => item.status === status)
      .sort(compareRecords)

    return {
      status,
      label: statusLabels[status],
      count: items.length,
      items
    }
  }).filter(group => group.count > 0)
})
