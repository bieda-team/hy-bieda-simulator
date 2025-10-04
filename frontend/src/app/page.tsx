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

  // 🧩 Form data
  const [formData, setFormData] = useState({
    age: 35,
    workclass: 'Private',
    education: 'Bachelors',
    marital_status: 'Married-civ-spouse',
    occupation: 'Exec-managerial',
    relationship: 'Husband',
    race: 'White',
    sex: 'Male',
    native_country: 'Poland',
    current_income: 8000,
    savings: 20000,
  })

  function handleChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

async function fetchPrediction() {
  setLoading(true)
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

    // Derive gender from "sex" field
    const gender = formData.sex === 'Male' ? 'Mężczyzna' : 'Kobieta'

    // Create mock ZUS-style payload
    const payload = {
      last_zus_year: 2024,
      gender,
      birth_month: 1,
      birth_year: 1990, // you can make this user-input later
      total_contributions: formData.savings * 0.6,
      capital: formData.savings * 0.3,
      subaccount: formData.savings * 0.1,
      yearly_contributions: formData.current_income * 12 * 0.2,
      retirement_age_years: 65,
      retirement_age_months: 0,
      start_work_year: 2020 - (formData.age - 25), // simple estimation
      current_income: formData.current_income,
      ofe_member: true,
      future_income_percent: 100,
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


  // 🧮 Example chart data (mock)
  const chartData = prediction
    ? Array.from({ length: 5 }, (_, i) => ({
        year: 2025 + i,
        pension:
          (prediction.estimated_monthly_pension || 1000) *
          (1 + 0.03 * i),
      }))
    : Array.from({ length: 5 }, (_, i) => ({
        year: 2025 + i,
        pension: 1000 * (1 + 0.05 * i),
      }))

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10 px-4">
      {/* Header */}
      <header className="max-w-5xl w-full flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-blue-800">💸 Hy-Bieda Simulator</h1>
      </header>

      {/* Hero */}
      <section className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Emerytura na nowych zasadach</h2>
        <p className="text-gray-600">
          Wprowadź swoje dane, by sprawdzić prognozowaną emeryturę.
        </p>
      </section>

      {/* Form */}
      <Card className="max-w-5xl w-full mb-10">
        <CardHeader>
          <CardTitle>Dane wejściowe</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Wiek</label>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Płeć</label>
            <Select
              value={formData.sex}
              onValueChange={(v) => handleChange('sex', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Mężczyzna</SelectItem>
                <SelectItem value="Female">Kobieta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Wykształcenie</label>
            <Select
              value={formData.education}
              onValueChange={(v) => handleChange('education', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HS-grad">Średnie</SelectItem>
                <SelectItem value="Bachelors">Licencjat</SelectItem>
                <SelectItem value="Masters">Magister</SelectItem>
                <SelectItem value="Doctorate">Doktorat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Rodzaj pracy</label>
            <Select
              value={formData.workclass}
              onValueChange={(v) => handleChange('workclass', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Private">Prywatny sektor</SelectItem>
                <SelectItem value="Self-emp-not-inc">Samozatrudniony</SelectItem>
                <SelectItem value="State-gov">Sektor publiczny</SelectItem>
                <SelectItem value="Without-pay">Bez wynagrodzenia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Zawód</label>
            <Select
              value={formData.occupation}
              onValueChange={(v) => handleChange('occupation', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Exec-managerial">Kadra kierownicza</SelectItem>
                <SelectItem value="Prof-specialty">Specjalista</SelectItem>
                <SelectItem value="Craft-repair">Rzemieślnik</SelectItem>
                <SelectItem value="Sales">Sprzedaż</SelectItem>
                <SelectItem value="Other-service">Usługi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Stan cywilny</label>
            <Select
              value={formData.marital_status}
              onValueChange={(v) => handleChange('marital_status', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Never-married">Singiel</SelectItem>
                <SelectItem value="Married-civ-spouse">Żonaty / mężatka</SelectItem>
                <SelectItem value="Divorced">Rozwiedziony/a</SelectItem>
                <SelectItem value="Widowed">Wdowiec / wdowa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Dochód miesięczny (PLN)</label>
            <Input
              type="number"
              value={formData.current_income}
              onChange={(e) => handleChange('current_income', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Oszczędności (PLN)</label>
            <Input
              type="number"
              value={formData.savings}
              onChange={(e) => handleChange('savings', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Kraj pochodzenia</label>
            <Select
              value={formData.native_country}
              onValueChange={(v) => handleChange('native_country', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Poland">Polska</SelectItem>
                <SelectItem value="United-States">Stany Zjednoczone</SelectItem>
                <SelectItem value="Germany">Niemcy</SelectItem>
                <SelectItem value="India">Indie</SelectItem>
                <SelectItem value="Other">Inny</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button onClick={fetchPrediction} disabled={loading}>
        {loading ? 'Obliczam...' : 'Oblicz prognozę'}
      </Button>

      {/* Results */}
      {prediction && (
        <div className="mt-10 w-full max-w-5xl grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Prognozowany kapitał</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-green-600">
                {prediction.projected_capital
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
                {prediction.estimated_monthly_pension
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
                {prediction.replacement_rate_percent
                  ? `${prediction.replacement_rate_percent.toFixed(1)}%`
                  : '—'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card className="mt-12 w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Symulacja emerytury</CardTitle>
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

      {/* Raw JSON */}
      <pre className="mt-8 text-xs bg-gray-100 rounded-lg p-4 w-full max-w-4xl overflow-auto">
        {prediction ? JSON.stringify(prediction, null, 2) : 'Wyniki pojawią się tutaj...'}
      </pre>

      <footer className="mt-12 text-sm text-gray-500">
        © 2025 Hy-Bieda Simulator · Built with Next.js + shadcn/ui + FastAPI
      </footer>
    </main>
  )
}
