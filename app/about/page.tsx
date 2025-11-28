export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-gradient mb-8 text-center">
        About Efootball Showdown 2025
      </h1>

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Welcome to the Ultimate Tournament</h2>
          <p className="text-gray-300 leading-relaxed">
            Efootball Showdown 2025 is the premier single-elimination tournament for eFootball 2025 players worldwide. 
            With a prize pool of $10,000 and space for 1,000 competitors, this is your chance to prove you&apos;re the best 
            on the virtual pitch. Top 32 participants receive cash prizes!
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Tournament Structure</h2>
          <p className="text-gray-300 mb-4">
            The tournament follows a single-elimination bracket format, meaning one loss and you&apos;re out. 
            The competition is fierce, and only the most skilled players will advance.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
            <li><strong>Round 1:</strong> 1,000 → 500 players</li>
            <li><strong>Round 2:</strong> 500 → 250 players</li>
            <li><strong>Round 3:</strong> 250 → 125 players</li>
            <li><strong>Round 4:</strong> 125 → 63 players (1 bye)</li>
            <li><strong>Round 5:</strong> 63 → 32 players</li>
            <li><strong>Round 6:</strong> 32 → 16 players</li>
            <li><strong>Round 7:</strong> 16 → 8 players</li>
            <li><strong>Round 8:</strong> 8 → 4 players</li>
            <li><strong>Semi-finals:</strong> 4 → 2 players</li>
            <li><strong>Final:</strong> Crown the Champion</li>
          </ul>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Platform Support</h2>
          <p className="text-gray-300 mb-4">
            Efootball Showdown 2025 is a cross-platform tournament. Players can compete from:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-bold text-neon-green">PlayStation</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-bold text-neon-green">Xbox</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">💻</div>
              <div className="font-bold text-neon-green">Steam/PC</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="font-bold text-neon-green">Mobile</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-bold text-neon-green">Epic Games</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-bold text-neon-green">Other Platforms</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-bold text-neon-green mb-2">1. Registration Phase (Now - Dec 5)</h3>
              <p>Create your account, fill in your tournament details, and wait for admin approval.</p>
            </div>
            <div>
              <h3 className="font-bold text-neon-green mb-2">2. Pre-Tournament Phase (Dec 6 - Dec 9)</h3>
              <p>Tournament brackets are generated and players are notified of their first match.</p>
            </div>
            <div>
              <h3 className="font-bold text-neon-green mb-2">3. Tournament Days (Dec 10 - 13)</h3>
              <p>Each day hosts specific rounds. Players upload match results, admins verify, and the bracket updates automatically.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-neon-green mb-4">Fair Play</h2>
          <p className="text-gray-300">
            We take fair play seriously. All match results must be verified with screenshots, and our admin team 
            reviews all submissions. Any attempts at cheating or unsportsmanlike conduct will result in immediate 
            disqualification.
          </p>
        </div>
      </div>
    </div>
  );
}

