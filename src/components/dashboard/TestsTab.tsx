import { useMemo, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { ASSESSMENT_TESTS } from '../../data/tests'

export function TestsTab() {
  const { state, addTestResult } = useAppContext()
  const [selectedTestId, setSelectedTestId] = useState(ASSESSMENT_TESTS[0].id)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const selectedTest = useMemo(
    () => ASSESSMENT_TESTS.find((test) => test.id === selectedTestId) ?? ASSESSMENT_TESTS[0],
    [selectedTestId],
  )

  const submitTest = (): void => {
    const allAnswered = selectedTest.questions.every((q) => answers[q.id] !== undefined)
    if (!allAnswered) return

    const score = selectedTest.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
    const maxScore = selectedTest.questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score)), 0)
    const interpretation = selectedTest.interpret(score, maxScore)

    addTestResult({
      id: `t-${Date.now()}`,
      testId: selectedTest.id,
      testTitle: selectedTest.title,
      takenAt: new Date().toISOString(),
      score,
      maxScore,
      interpretation,
    })

    setAnswers({})
  }

  return (
    <section className="grid">
      <article className="card">
        <h2>Self-assessment tests</h2>
        <select
          value={selectedTestId}
          onChange={(event) => {
            setSelectedTestId(event.target.value)
            setAnswers({})
          }}
        >
          {ASSESSMENT_TESTS.map((test) => (
            <option key={test.id} value={test.id}>
              {test.title}
            </option>
          ))}
        </select>
        <p className="muted">{selectedTest.description}</p>

        <div className="test-list">
          {selectedTest.questions.map((question) => (
            <div key={question.id} className="question">
              <p>{question.prompt}</p>
              <div className="chips">
                {question.options.map((option) => (
                  <button
                    key={option.label}
                    className={answers[question.id] === option.score ? 'chip active' : 'chip'}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option.score }))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="primary"
          onClick={submitTest}
          disabled={!selectedTest.questions.every((q) => answers[q.id] !== undefined)}
        >
          Score test
        </button>
      </article>

      <article className="card full">
        <h2>Test history</h2>
        <div className="list">
          {state.testHistory.map((result) => (
            <div key={result.id} className="history-row">
              <div>
                <strong>{result.testTitle}</strong>
                <p className="muted">{new Date(result.takenAt).toLocaleString()}</p>
              </div>
              <div>
                <p>
                  {result.score}/{result.maxScore}
                </p>
                <p className="muted">{result.interpretation}</p>
              </div>
            </div>
          ))}
          {!state.testHistory.length && <p className="muted">No tests taken yet.</p>}
        </div>
      </article>
    </section>
  )
}
