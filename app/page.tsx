import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';

export default function HomePage() {
  const registrationDeadline = '2025-12-05T23:59:59';
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-blue via-dark-blue to-black opacity-80"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(57, 255, 20, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black text-gradient glow-text">
              EFOOTBALL
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-neon-green">
              SHOWDOWN 2025
            </h2>
            <p className="text-2xl md:text-3xl text-gray-300 mt-6">
              The Ultimate eFootball Tournament
            </p>
            <p className="text-xl md:text-2xl text-neon-green">
              Get a chance to win 3,350 dollars
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link href="/register" className="btn-primary text-lg px-8 py-4 animate-glow">
              REGISTER NOW
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4">
              LEARN MORE
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="mt-12">
            <CountdownTimer targetDate={registrationDeadline} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="card">
              <div className="text-4xl font-bold text-neon-green mb-2">1,000</div>
              <div className="text-gray-400">Players</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-neon-green mb-2">$10,000</div>
              <div className="text-gray-400">Prize Pool</div>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-neon-green mb-2">Dec 10-13</div>
              <div className="text-gray-400">Tournament Dates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Info */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient">
            Tournament Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-2xl font-bold text-neon-green mb-4">📅 Schedule</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex justify-between">
                  <span>Registration Deadline:</span>
                  <span className="text-neon-green font-bold">December 5, 2025</span>
                </li>
                <li className="flex justify-between">
                  <span>Tournament Start:</span>
                  <span className="text-neon-green font-bold">December 10, 2025</span>
                </li>
                <li className="flex justify-between">
                  <span>Tournament End:</span>
                  <span className="text-neon-green font-bold">December 13, 2025</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-2xl font-bold text-neon-green mb-4">🏆 Format</h3>
              <ul className="space-y-3 text-gray-300">
                <li>Single-Elimination Bracket</li>
                <li>Cross-Platform (PSN, Xbox, Steam, Mobile)</li>
                <li>eFootball 2025</li>
                <li>Maximum 1,000 Players</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gradient">
            Prize Breakdown
          </h2>
          <p className="text-center text-gray-400 text-xl mb-12">
            Total Prize Pool: <span className="text-neon-green font-bold text-2xl">$10,000</span>
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center neon-border">
              <div className="text-5xl mb-4">🥇</div>
              <div className="text-3xl font-bold text-neon-green mb-2">$3,350</div>
              <div className="text-gray-400">1st Place</div>
              <div className="text-sm text-gray-500 mt-2">+ Trophy</div>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🥈</div>
              <div className="text-3xl font-bold text-neon-green mb-2">$1,500</div>
              <div className="text-gray-400">2nd Place</div>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">🥉</div>
              <div className="text-3xl font-bold text-neon-green mb-2">$1,000</div>
              <div className="text-gray-400">3rd Place</div>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">4️⃣</div>
              <div className="text-2xl font-bold text-neon-green mb-2">$750</div>
              <div className="text-gray-400">4th Place</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-4xl mb-3">🏅</div>
              <div className="text-xl font-bold text-neon-green mb-2">$350</div>
              <div className="text-gray-400 mb-1">5th-8th Place</div>
              <div className="text-sm text-gray-500">Each Player</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-3">⭐</div>
              <div className="text-xl font-bold text-neon-green mb-2">$150</div>
              <div className="text-gray-400 mb-1">9th-16th Place</div>
              <div className="text-sm text-gray-500">Each Player</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-xl font-bold text-neon-green mb-2">$50</div>
              <div className="text-gray-400 mb-1">17th-32nd Place</div>
              <div className="text-sm text-gray-500">Each Player</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Ready to Compete?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 1,000 players in the ultimate eFootball showdown. Register now before December 5th!
          </p>
          <Link href="/register" className="btn-primary text-lg px-10 py-4 inline-block">
            REGISTER NOW
          </Link>
        </div>
      </section>
    </div>
  );
}

