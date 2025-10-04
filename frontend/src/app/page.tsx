'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
          last_zus_year: 2024,
          gender: 'Kobieta',
          birth_month: 1,
          birth_year: 1980,
          total_contributions: 250000,
          capital: 150000,
          subaccount: 50000,
          yearly_contributions: 30000,
          retirement_age_years: 65,
          retirement_age_months: 0,
          start_work_year: 2000,
          current_income: 8000,
          ofe_member: true,
          future_income_percent: 100,
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

  // Simulated prosperity chart using prediction or placeholder data
  const chartData = prediction
    ? Array.from({ length: prediction.years_until_retirement + 1 }, (_, i) => ({
        year: new Date().getFullYear() + i,
        pension: prediction.estimated_monthly_pension * (i / (prediction.years_until_retirement || 1)),
      }))
    : Array.from({ length: 5 }, (_, i) => ({
        year: 2025 + i,
        pension: 1000 * (1 + 0.05 * i),
      }))

  // Static investing suggestions
  const investingOptions = [
    {
      name: 'ETF Index Funds',
      return: '5–7% yearly',
      risk: 'Low',
      description: 'Diversified, long-term growth with low fees.',
    },
    {
      name: 'Real Estate',
      return: '4–6% yearly',
      risk: 'Medium',
      description: 'Stable, inflation-protected investment over time.',
    },
    {
      name: 'Crypto Assets',
      return: '10–30% yearly',
      risk: 'High',
      description: 'Speculative and volatile, suitable for small portfolio share.',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="max-w-5xl w-full flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-blue-800">💸 Hy-Bieda Simulator</h1>
        <Button variant="outline">Login</Button>
      </header>

      {/* Hero Section */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">Emerytura na nowych zasadach</h2>
        <p className="text-gray-600">
          Sprawdź swoją przewidywaną emeryturę na podstawie danych ZUS.
        </p>
      </section>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Prognozowany kapitał</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600">
              {prediction?.projected_capital
                ? `${prediction.projected_capital.toLocaleString()} PLN`
                : '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Miesięczna emerytura</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600">
              {prediction?.estimated_monthly_pension
                ? `${prediction.estimated_monthly_pension.toLocaleString()} PLN`
                : '—'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stopa zastąpienia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-orange-600">
              {prediction?.replacement_rate_percent
                ? `${prediction.replacement_rate_percent.toFixed(1)}%`
                : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <Button onClick={fetchPrediction} disabled={loading}>
        {loading ? 'Obliczam...' : 'Oblicz prognozę'}
      </Button>

      {/* Prosperity Chart */}
      <Card className="mt-12 w-full max-w-5xl shadow-md">
        <CardHeader>
          <CardTitle>Symulacja kapitału emerytalnego</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="pension" stroke="#2563eb" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Investing Options */}
      <Card className="mt-12 w-full max-w-5xl shadow-md">
        <CardHeader>
          <CardTitle>Propozycje inwestycyjne</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          {investingOptions.map((opt) => (
            <div
              key={opt.name}
              className="rounded-xl border border-gray-200 p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-1">{opt.name}</h3>
              <p className="text-sm text-gray-600 mb-1">📈 Zwrot: {opt.return}</p>
              <p className="text-sm text-gray-600 mb-1">⚖️ Ryzyko: {opt.risk}</p>
              <p className="text-sm text-gray-500">{opt.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* JSON Output */}
      <pre className="mt-8 text-sm bg-gray-100 rounded-lg p-4 w-full max-w-4xl overflow-auto">
        {prediction
          ? JSON.stringify(prediction, null, 2)
          : 'Dane prognozy pojawią się tutaj...'}
      </pre>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500">
        © 2025 Hy-Bieda Simulator · Built with Next.js + shadcn/ui + FastAPI
      </footer>
    </main>
  )
}
