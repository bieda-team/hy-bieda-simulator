'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)

  async function fetchPrediction() {
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
      const res = await fetch(`${apiBase}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: 6000,   // PLN example input
          age: 35,
          savings: 20000,
        }),
      })
      const json = await res.json()
      setPrediction(json)
    } catch (err) {
      setPrediction({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="max-w-5xl w-full flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-blue-800">💸 Hy-Bieda Simulator</h1>
        <Button variant="outline">Login</Button>
      </header>

      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">Welcome, Jan Kowalski</h2>
        <p className="text-gray-600">
          Let’s see how your current income shapes your future.
        </p>
      </section>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Current Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">6,000 PLN</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predicted Income in 3 Years</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              {prediction?.future_income ? `${prediction.future_income} PLN` : '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated Retirement Sum</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-orange-600">
              {prediction?.retirement_sum ? `${prediction.retirement_sum} PLN` : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <Button onClick={fetchPrediction} disabled={loading}>
        {loading ? 'Calculating...' : 'Generate My Prediction'}
      </Button>

      {/* Prediction JSON Output */}
      <pre className="mt-8 text-sm bg-gray-100 rounded-lg p-4 w-full max-w-4xl overflow-auto">
        {prediction ? JSON.stringify(prediction, null, 2) : 'Prediction data will appear here'}
      </pre>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        © 2025 Hy-Bieda Simulator · Built with Next.js + shadcn/ui
      </footer>
    </main>
  )
}
