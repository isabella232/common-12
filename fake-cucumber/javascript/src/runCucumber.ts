import { Query as GherkinQuery } from '@cucumber/gherkin-utils'
import GherkinQueryStream from './GherkinQueryStream.js'
import makeTestPlan from './makeTestPlan.js'
import { Readable, Writable } from 'stream'
import SupportCode from './SupportCode.js'
import { MakeTestPlan, RunOptions } from './types.js'
import makeTestCase from './makeTestCase.js'

const DEFAULT_OPTIONS: RunOptions = {
  allowedRetries: 0,
}

export default async function runCucumber(
  supportCode: SupportCode,
  gherkinEnvelopeStream: Readable,
  gherkinQuery: GherkinQuery,
  envelopeOutputStream: Writable,
  runOptions: RunOptions = DEFAULT_OPTIONS,
  makeTestPlanFn: MakeTestPlan<SupportCode> = makeTestPlan
) {
  const gherkinQueryStream = new GherkinQueryStream(gherkinQuery)
  gherkinEnvelopeStream.pipe(gherkinQueryStream).pipe(envelopeOutputStream, { end: false })

  await new Promise((resolve, reject) => {
    gherkinQueryStream.on('end', resolve)
    gherkinQueryStream.on('error', reject)
    gherkinEnvelopeStream.on('error', reject)
  })

  const testPlan = makeTestPlanFn(gherkinQuery, supportCode, runOptions, makeTestCase)
  await testPlan.execute((envelope) => {
    envelopeOutputStream.write(envelope)
    if (envelope.testRunFinished) {
      envelopeOutputStream.end()
    }
  })
}
