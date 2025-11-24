export default function PrizesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-gradient mb-4 text-center">
        Prize Breakdown
      </h1>
      <p className="text-center text-gray-400 text-xl mb-12">
        Total Prize Pool: <span className="text-neon-green font-bold text-3xl">$10,000</span>
      </p>
      <p className="text-center text-gray-500 text-sm mb-12">
        Top 32 participants receive cash prizes
      </p>

      {/* Top 4 Prizes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* 1st Place */}
        <div className="card neon-border text-center transform hover:scale-105 transition-all">
          <div className="text-7xl mb-4">🥇</div>
          <div className="text-4xl font-bold text-neon-green mb-2">$3,350</div>
          <div className="text-xl font-bold mb-2">1st Place</div>
          <div className="text-gray-400">Champion</div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-neon-green">+ Exclusive Trophy</div>
          </div>
        </div>

        {/* 2nd Place */}
        <div className="card text-center transform hover:scale-105 transition-all">
          <div className="text-7xl mb-4">🥈</div>
          <div className="text-4xl font-bold text-neon-green mb-2">$1,500</div>
          <div className="text-xl font-bold mb-2">2nd Place</div>
          <div className="text-gray-400">Runner-up</div>
        </div>

        {/* 3rd Place */}
        <div className="card text-center transform hover:scale-105 transition-all">
          <div className="text-7xl mb-4">🥉</div>
          <div className="text-4xl font-bold text-neon-green mb-2">$1,000</div>
          <div className="text-xl font-bold mb-2">3rd Place</div>
          <div className="text-gray-400">Third Place</div>
        </div>

        {/* 4th Place */}
        <div className="card text-center transform hover:scale-105 transition-all">
          <div className="text-7xl mb-4">4️⃣</div>
          <div className="text-4xl font-bold text-neon-green mb-2">$750</div>
          <div className="text-xl font-bold mb-2">4th Place</div>
          <div className="text-gray-400">Fourth Place</div>
        </div>
      </div>

      {/* Group Prizes */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="text-6xl mb-4">🏅</div>
          <div className="text-3xl font-bold text-neon-green mb-2">$350</div>
          <div className="text-xl font-bold mb-2">5th-8th Place</div>
          <div className="text-gray-400 mb-2">Each Player</div>
          <div className="text-sm text-gray-500">4 players × $350 = $1,400</div>
        </div>

        <div className="card text-center">
          <div className="text-6xl mb-4">⭐</div>
          <div className="text-3xl font-bold text-neon-green mb-2">$150</div>
          <div className="text-xl font-bold mb-2">9th-16th Place</div>
          <div className="text-gray-400 mb-2">Each Player</div>
          <div className="text-sm text-gray-500">8 players × $150 = $1,200</div>
        </div>

        <div className="card text-center">
          <div className="text-6xl mb-4">🎯</div>
          <div className="text-3xl font-bold text-neon-green mb-2">$50</div>
          <div className="text-xl font-bold mb-2">17th-32nd Place</div>
          <div className="text-gray-400 mb-2">Each Player</div>
          <div className="text-sm text-gray-500">16 players × $50 = $800</div>
        </div>
      </div>

      {/* Detailed Prize Table */}
      <div className="card bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <h2 className="text-2xl font-bold text-neon-green mb-6">Complete Prize Distribution</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 text-neon-green font-bold">Position</th>
                <th className="pb-3 text-neon-green font-bold text-right">Prize Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="py-3 font-bold">1st Place</td>
                <td className="py-3 text-right text-neon-green font-bold text-xl">$3,350 + Trophy</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 font-bold">2nd Place</td>
                <td className="py-3 text-right text-neon-green font-bold text-xl">$1,500</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 font-bold">3rd Place</td>
                <td className="py-3 text-right text-neon-green font-bold text-xl">$1,000</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3 font-bold">4th Place</td>
                <td className="py-3 text-right text-neon-green font-bold text-xl">$750</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3">5th-8th Place</td>
                <td className="py-3 text-right text-neon-green font-bold">$350 each</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="py-3">9th-16th Place</td>
                <td className="py-3 text-right text-neon-green font-bold">$150 each</td>
              </tr>
              <tr>
                <td className="py-3">17th-32nd Place</td>
                <td className="py-3 text-right text-neon-green font-bold">$50 each</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neon-green mt-4">
                <td className="pt-4 font-bold text-lg">Total Prize Pool</td>
                <td className="pt-4 text-right text-neon-green font-bold text-2xl">$10,000</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
          <h3 className="font-bold text-blue-400 mb-2">📋 Payment Information</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Prizes will be distributed within 30 days of tournament completion</li>
            <li>• Winners must provide valid payment information (PayPal, bank transfer, or M-Pesa)</li>
            <li>• All prizes are subject to applicable taxes</li>
            <li>• Payment method will be confirmed with winners after the tournament</li>
            <li>• Top 32 participants receive cash prizes</li>
          </ul>
        </div>
      </div>

      {/* Prize Summary Cards */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-4xl mb-3">💰</div>
          <div className="text-2xl font-bold text-neon-green mb-2">$10,000</div>
          <div className="text-gray-400">Total Prize Pool</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-2xl font-bold text-neon-green mb-2">32</div>
          <div className="text-gray-400">Prize Winners</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-2xl font-bold text-neon-green mb-2">Top 3.2%</div>
          <div className="text-gray-400">Win Cash Prizes</div>
        </div>
      </div>
    </div>
  );
}
