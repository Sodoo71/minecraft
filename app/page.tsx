export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Hero section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl font-bold mb-4">Server Management System</h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Manage your server, players, and settings from one simple dashboard.
        </p>

        <div className="space-x-4">
          <a href="/dashboard" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
            Go to Dashboard
          </a>
          <a className="border border-black px-6 py-3 rounded-lg hover:bg-gray-200">
            Learn More
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        © 2026 My System. All rights reserved.
      </footer>
    </main>
  );
}
