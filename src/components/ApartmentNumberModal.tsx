'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ApartmentNumberModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function ApartmentNumberModal({ isOpen, onClose, userId }: ApartmentNumberModalProps) {
  const [apartmentNumber, setApartmentNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('apartments')
        .insert([
          {
            id: userId,
            apt_number: apartmentNumber,
          },
        ])
        .select()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      onClose()
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Welcome! Please enter your apartment number
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="apartmentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Apartment Number
            </label>
            <input
              id="apartmentNumber"
              type="text"
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 