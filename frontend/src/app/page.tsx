'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
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
  const [selectedProfileId, setSelectedProfileId] = useState<string>('user_001')

  // 👤 Mock ZUS profiles (source of truth)
  const mockProfiles = [
    {
      id: 'user_001',
      name: 'Jan Kowalski',
      birth_year: 1985,
      birth_month: 6,
      sex: 'Male',
      workclass: 'Private',
      education: 'Bachelors',
      marital_status: 'Married-civ-spouse',
      occupation: 'Exec-managerial',
      relationship: 'Husband',
      race: 'White',
      native_country: 'Poland',
    },
    {
      id: 'user_002',
      name: 'Anna Nowak',
      birth_year: 1990,
      birth_month: 3,
      sex: 'Female',
      workclass: 'State-gov',
      education: 'Masters',
      marital_status: 'Never-married',
      occupation: 'Prof-specialty',
      relationship: 'Unmarried',
      race: 'White',
      native_country: 'Poland',
    },
  ]

  const selectedProfile = mockProfiles.find((p) => p.id === selectedProfileId)!

  // 🧩 User-entered fields
  const [formData, setFormData] = useState({
    current_income: 8000,
    savings: 20000,
    retirement_age_years: 65,
    retirement_age_months: 0,
  })

  function handleChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function fetchPrediction() {
    setLoading(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

      const payload = {
        user_id: selectedProfile.id,
        current_income: formData.current_income,
        savings: formData.savings,
        retirement_age_years: formData.retirement_age_years,
        retirement_age_months: formData.retirement_age_months,
        gender: selectedProfile.sex === 'Male' ? 'Mężczyzna' : 'Kobieta',
        birth_year: selectedProfile.birth_year,
        birth_month: selectedProfile.birth_month,
        total_contributions: formData.savings * 0.6,
        capital: formData.savings * 0.3,
        subaccount: formData.savings * 0.1,
        yearly_contributions: formData.current_income * 12 * 0.2,
      }

      const res = await fetch(`${apiBase}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      setPrediction(json)
    } catch (err) {
      setPrediction({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  // 📈 Chart data
  const chartData = prediction
    ? Array.from({ length: 5 }, (_, i) => ({
        year: new Date().getFullYear() + i,
        pension: (prediction.estimated_monthly_pension || 1000) * (1 + 0.03 * i),
      }))
    : Array.from({ length: 5 }, (_, i) => ({
        year: new Date().getFullYear() + i,
        pension: 1000 * (1 + 0.05 * i),
      }))

  // 💰 Investing options
  const investingOptions = [
    { name: 'ETF Index Funds', return: '5–7% yearly', risk: 'Low', description: 'Diversified, long-term growth with low fees.' },
    { name: 'Real Estate', return: '4–6% yearly', risk: 'Medium', description: 'Stable, inflation-protected investment over time.' },
    { name: 'Crypto Assets', return: '10–30% yearly', risk: 'High', description: 'Speculative and volatile, suitable for small portfolio share.' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="max-w-5xl w-full flex justify-between items-center mb-12">
        <h1 className="text-2xl font-bold text-blue-800">💸 Hy-Bieda Simulator</h1>
        <Button variant="outline">Login</Button>
      </header>

      {/* Hero */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">Emerytura na nowych zasadach</h2>
        <p className="text-gray-600">Wybierz profil demo i wprowadź brakujące dane, aby zobaczyć prognozę emerytury.</p>
      </section>

      {/* Select Mock Profile */}
      <Card className="max-w-5xl w-full mb-6">
        <CardHeader>
          <CardTitle>Profil demo (mock ZUS)</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProfileId} onValueChange={(id) => setSelectedProfileId(id)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {mockProfiles.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Mock Profile Accordion */}
      <Accordion type="single" collapsible className="max-w-5xl w-full mb-6">
        <AccordionItem value="mockProfile">
          <AccordionTrigger>🔍 Pokaż dane profilowe (mock ZUS)</AccordionTrigger>
          <AccordionContent>
            <pre className="text-xs bg-gray-100 rounded-lg p-4 overflow-auto">
              {JSON.stringify(selectedProfile, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* User Inputs */}
      <Card className="max-w-5xl w-full mb-6">
        <CardHeader><CardTitle>Dane użytkownika</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Dochód miesięczny (PLN)</label>
            <Input type="number" value={formData.current_income} onChange={(e) => handleChange('current_income', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Oszczędności (PLN)</label>
            <Input type="number" value={formData.savings} onChange={(e) => handleChange('savings', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Wiek przejścia na emeryturę (lata)</label>
            <Input type="number" value={formData.retirement_age_years} onChange={(e) => handleChange('retirement_age_years', Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium">Miesiące przejścia na emeryturę</label>
            <Input type="number" value={formData.retirement_age_months} onChange={(e) => handleChange('retirement_age_months', Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={fetchPrediction} disabled={loading}>{loading ? 'Obliczam...' : 'Oblicz prognozę'}</Button>

      {/* Results */}
      {prediction && (
        <div className="mt-10 w-full max-w-5xl grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Prognozowany kapitał</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-green-600">{prediction.projected_capital?.toLocaleString() ?? '—'} PLN</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Miesięczna emerytura</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-blue-600">{prediction.estimated_monthly_pension?.toLocaleString() ?? '—'} PLN</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Stopa zastąpienia</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-semibold text-orange-600">{prediction.replacement_rate_percent?.toFixed(1) ?? '—'}%</p></CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card className="mt-12 w-full max-w-5xl">
        <CardHeader><CardTitle>Symulacja kapitału emerytalnego</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>Propozycje inwestycyjne</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          {investingOptions.map((opt) => (
            <div key={opt.name} className="rounded-xl border border-gray-200 p-4 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-1">{opt.name}</h3>
              <p className="text-sm text-gray-600 mb-1">📈 Zwrot: {opt.return}</p>
              <p className="text-sm text-gray-600 mb-1">⚖️ Ryzyko: {opt.risk}</p>
              <p className="text-sm text-gray-500">{opt.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Raw JSON */}
      <pre className="mt-8 text-sm bg-gray-100 rounded-lg p-4 w-full max-w-4xl overflow-auto">
        {prediction ? JSON.stringify(prediction, null, 2) : 'Dane prognozy pojawią się tutaj...'}
      </pre>

      <footer className="mt-16 text-sm text-gray-500">
        © 2025 Hy-Bieda Simulator · Built with Next.js + shadcn/ui + FastAPI
      </footer>
    </main>
  )
}
