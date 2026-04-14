import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-8 border border-white/20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-slow">
              React + Tailwind
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Modern Vite + React 19 + Tailwind CSS 3 app. Fully responsive and beautiful.
            </p>
          </div>
          <div className="pt-2">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                onClick={() => setCount((count) => count - 1)}
              >
                Dec
              </button>
              <span className="px-8 py-3 bg-white/50 rounded-2xl font-mono text-2xl font-bold text-gray-800 self-center select-none">
                {count}
              </span>
              <button
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                onClick={() => setCount((count) => count + 1)}
              >
                Inc
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Edit App.tsx
              </button>
                <a
                href="https://vitejs.dev/guide/"
                target="_blank"
                rel="noreferrer noopener"
                className="px-6 py-2 bg-black/80 hover:bg-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >

                Learn Vite →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

