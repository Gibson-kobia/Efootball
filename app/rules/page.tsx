export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-gradient mb-8 text-center">
        Rules & Terms
      </h1>

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Tournament Rules</h2>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h3 className="font-bold text-neon-green mb-2">1. Eligibility</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Must be 13 years or older</li>
                <li>Must have a valid eFootball 2025 account</li>
                <li>Must provide accurate registration information</li>
                <li>One account per player (no duplicate registrations)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">2. Match Rules</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>All matches are single-elimination</li>
                <li>Matches must be played on eFootball 2025</li>
                <li>Default match settings as specified by tournament organizers</li>
                <li>Players must complete matches within the scheduled time window</li>
                <li>If a player doesn&apos;t show up within 15 minutes, they forfeit</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">3. Result Submission</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Winners must upload a screenshot of the match result</li>
                <li>Screenshots must clearly show final score and both players</li>
                <li>Results must be submitted within 1 hour of match completion</li>
                <li>Admin verification is required before bracket advancement</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">4. Disputes</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Players can dispute results through the support system</li>
                <li>Admin decisions are final</li>
                <li>False disputes may result in disqualification</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">5. Code of Conduct</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Respect all players and tournament staff</li>
                <li>No cheating, hacking, or exploiting game mechanics</li>
                <li>No unsportsmanlike conduct or harassment</li>
                <li>Violations result in immediate disqualification</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Terms & Conditions</h2>
          
          <div className="space-y-4 text-gray-300">
            <section>
              <h3 className="font-bold text-neon-green mb-2">Registration</h3>
              <p>
                By registering, you agree to provide accurate information and abide by all tournament rules. 
                Registration is subject to admin approval. We reserve the right to reject any registration 
                without explanation.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">Prize Distribution</h3>
              <p>
                Prizes will be distributed within 30 days of tournament completion. Winners must provide 
                valid payment information. Taxes on prizes are the responsibility of the winner.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">Liability</h3>
              <p>
                Tournament organizers are not responsible for technical issues, network problems, or 
                game-related bugs that may affect match outcomes. We will make reasonable efforts to 
                ensure fair play but cannot guarantee perfect conditions.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">Data Privacy</h3>
              <p>
                Your personal information will be used solely for tournament management purposes. 
                We will not share your data with third parties without consent, except as required by law.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-neon-green mb-2">Cancellation</h3>
              <p>
                We reserve the right to cancel, modify, or postpone the tournament for any reason. 
                In case of cancellation, registration fees (if any) will be refunded.
              </p>
            </section>
          </div>
        </div>

        <div className="card bg-red-900/20 border-red-500/50">
          <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Important Reminders</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li>Registration deadline: <strong className="text-neon-green">December 5, 2025</strong></li>
            <li>Check your dashboard regularly for match assignments</li>
            <li>Be available during your scheduled match times</li>
            <li>Keep screenshots of all match results</li>
            <li>Contact support immediately if you encounter issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

