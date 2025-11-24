export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4">EFOOTBALL SHOWDOWN 2025</h3>
            <p className="text-gray-400 text-sm">
              The premier eFootball tournament platform. Compete, win, and claim your glory.
            </p>
          </div>
          <div>
            <h4 className="text-neon-green font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-neon-green transition">About</a></li>
              <li><a href="/rules" className="hover:text-neon-green transition">Rules & Terms</a></li>
              <li><a href="/prizes" className="hover:text-neon-green transition">Prizes</a></li>
              <li><a href="/bracket" className="hover:text-neon-green transition">Bracket</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-neon-green font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@efootballshowdown.com</li>
              <li>Tournament Dates: Dec 10-13, 2025</li>
              <li>Registration Deadline: Dec 5, 2025</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; 2025 Efootball Showdown. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

