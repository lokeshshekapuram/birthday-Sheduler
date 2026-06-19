import { Link } from 'react-router-dom';

const features = [
  { icon: '🎂', title: 'Never Miss a Birthday', desc: 'Automatic wishes sent on the exact birthday date every year.' },
  { icon: '📧', title: 'Beautiful Email Cards', desc: 'Stunning HTML birthday emails sent directly to your contacts.' },
  { icon: '⏰', title: 'Smart Scheduler', desc: 'Runs every hour, checks timezones, sends wishes at the right time.' },
  { icon: '👥', title: 'Manage Contacts', desc: 'Add family, friends, colleagues with custom messages for each.' },
  { icon: '📊', title: 'Dashboard & History', desc: 'See today\'s birthdays, upcoming ones, and full notification history.' },
  { icon: '📁', title: 'CSV Import', desc: 'Import hundreds of contacts at once using a simple CSV file.' },
];

const steps = [
  { step: '1', title: 'Register & Login', desc: 'Create your free account in seconds.' },
  { step: '2', title: 'Add Birthdays', desc: 'Add contacts with their birthday and a custom message.' },
  { step: '3', title: 'Relax!', desc: 'We automatically send wishes on their birthday. Every year.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎂</span>
          <span className="font-bold text-xl text-gray-900 dark:text-white">BirthdayWish</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🎉 100% Free • No Credit Card Required
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          Never Miss a
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Birthday </span>
          Again
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Automatically send beautiful birthday wishes to your friends and family. Set it once, and we handle the rest — every single year.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity shadow-lg">
            Start for Free 🚀
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Login to Dashboard
          </Link>
        </div>
        {/* Hero visual */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl mx-auto border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-gray-400 ml-2">Dashboard Preview</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Contacts</p>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-pink-600">3</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Upcoming Birthdays</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wishes Sent This Year</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-orange-600">🎂 Today</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rahul's Birthday!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold flex items-center justify-center mb-4 shadow-lg">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to get started?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Join thousands who never miss a birthday. Free forever.</p>
          <Link to="/register" className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity shadow-lg inline-block">
            Create Free Account 🎉
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>🎂 BirthdayWish Scheduler • Free Forever • Made with ❤️</p>
      </footer>
    </div>
  );
}
