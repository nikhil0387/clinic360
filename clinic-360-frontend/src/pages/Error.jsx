import {  ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-red-400">
          <h1 className="text-9xl font-bold">404</h1>
        </div>

        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-gray-400 text-lg">
          The page you're looking for doesn't exist or has been moved
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="px-6 py-3 bg-blue-400 text-gray-900 rounded-lg font-medium hover:bg-blue-500 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error