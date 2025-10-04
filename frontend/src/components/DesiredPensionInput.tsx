'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tooltip } from '@/components/ui/tooltip'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

interface PensionGroup {
  label: string
  amount: number
  description: string
}

const pensionGroups: PensionGroup[] = [
  {
    label: 'Poniżej minimalnej',
    amount: 1500,
    description:
      'Świadczeniobiorcy otrzymujący emeryturę w wysokości poniżej minimalnej wykazywali się niską aktywnością zawodową, nie przepracowali minimum 25 lat dla mężczyzn i 20 lat dla kobiet.',
  },
  {
    label: 'Średnia',
    amount: 2800,
    description: 'Średnia emerytura w Polsce dla osób pracujących standardowo.',
  },
  {
    label: 'Powyżej średniej',
    amount: 5000,
    description: 'Wyższe świadczenia, zwykle osoby z długim stażem zawodowym i wysokimi zarobkami.',
  },
]

const randomFacts = [
  'Czy wiesz, że najwyższą emeryturę w Polsce otrzymuje mieszkaniec województwa śląskiego, wysokość jego emerytury to 25 000 zł, pracował przez 45 lat, nie był nigdy na zwolnieniu lekarskim.',
  'Najczęstsza wysokość emerytury w Polsce wynosi około 2 800 zł.',
  'Emeryci, którzy przepracowali ponad 40 lat, otrzymują średnio o 30% wyższe świadczenia.',
]

export default function DesiredPensionInput() {
  const [desiredAmount, setDesiredAmount] = useState(3000)
  const [fact, setFact] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomFacts.length)
    setFact(randomFacts[randomIndex])
  }, [])

  const data = pensionGroups.map((g) => ({
    label: g.label,
    amount: g.amount,
    type: g.label,
  }))

  return (
    <Card className="max-w-5xl w-full mt-8 border border-zus-gray">
      <CardHeader>
        <CardTitle className="text-zus-dark-blue">Jaką emeryturę chciałbyś otrzymać?</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-zus-dark-blue font-medium">Twoja wymarzona emerytura (PLN / mies.)</label>
          <Input
            type="number"
            min={0}
            value={desiredAmount}
            onChange={(e) => setDesiredAmount(Number(e.target.value))}
            className="border border-zus-gray focus:border-zus-blue focus:ring-zus-blue"
          />
          <p className="text-zus-dark-blue text-sm">
            Średnia emerytura w Polsce: <span className="font-semibold">{pensionGroups[1].amount} PLN</span>
          </p>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[...data, { label: 'Twój cel', amount: desiredAmount }]}>
            <XAxis dataKey="label" />
            <YAxis />
            <RechartsTooltip
              formatter={(value: number, name: string, props: any) => {
                const group = pensionGroups.find((g) => g.label === props.payload.label)
                return group ? [value, group.description] : [value, 'Twój cel']
              }}
            />
            <Bar dataKey="amount" fill="#3F84D2" />
          </BarChart>
        </ResponsiveContainer>

        {/* Random Fact */}
        <p className="text-zus-dark-blue italic text-sm mt-2">{fact}</p>
      </CardContent>
    </Card>
  )
}
