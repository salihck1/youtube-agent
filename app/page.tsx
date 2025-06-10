'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface FormData {
  topic: string
  tone: 'Professional' | 'Casual' | 'Funny'
  genre: 'Educational' | 'Entertainment' | 'Tutorial'
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    tone: 'Professional',
    genre: 'Educational',
  })
  const [script, setScript] = useState('')
  const [editedScript, setEditedScript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasScript, setHasScript] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoApproval, setVideoApproval] = useState<'approved' | 'rejected' | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [responseId, setResponseId] = useState<string | null>(null)
  const [responseTimestamp, setResponseTimestamp] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setHasScript(false)
    try {
      // Generate unique ID and timestamp for initial submission (if needed)
      const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
      const timestamp = new Date().toISOString()
      const payload = {
        ...formData,
        id,
        timestamp,
      }
      const response = await fetch('https://n8n.srv810314.hstgr.cloud/webhook/frontend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to generate script')
      const data = await response.json()
      setScript(data.content?.text || data.text || "")
      setEditedScript(data.content?.text || data.text || "")
      setVideoUrl(data.videoUrl)
      setHasScript(true)
      setResponseId(data.responseId || null)
      setResponseTimestamp(data.timestamp || null)
    } catch (error) {
      alert('Error generating script. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEdit = () => {
    setScript(editedScript)
    setIsEditing(false)
    setStatusMessage('Script updated successfully!')
    setTimeout(() => setStatusMessage(''), 2000)
  }

  const handleApproveOrRefineScript = async () => {
    try {
      const status = feedback.trim() ? 'refine' : 'approved';
      const payload = {
        responseId,
        content: { text: editedScript },
        topic: formData.topic,
        tone: formData.tone,
        genre: formData.genre,
        feedback,
        status,
        timestamp: responseTimestamp,
      };
      const response = await fetch('https://n8n.srv810314.hstgr.cloud/webhook/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(status === 'refine' ? 'Failed to refine script' : 'Failed to approve script');
      alert(status === 'refine' ? 'Refinement request sent with feedback!' : 'Script approved successfully!');
    } catch (error) {
      alert('Error processing script. Please try again.');
    }
  }

  const handleApproveVideo = async () => {
    setVideoApproval('approved')
    await fetch('https://your-n8n-endpoint.com/webhook/approve-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, status: 'approved' }),
    })
    alert('Video approved and sent for upload!')
  }

  const handleRejectVideo = async () => {
    setVideoApproval('rejected')
    await fetch('https://your-n8n-endpoint.com/webhook/reject-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, status: 'rejected' }),
    })
    alert('Video rejected and sent for revision!')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">YouTube Script Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              id="tone"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value as FormData['tone'] })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            >
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Funny">Funny</option>
            </select>
          </div>
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value as FormData['genre'] })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            >
              <option value="Educational">Educational</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-semibold text-lg"
          >
            {isLoading ? 'Generating...' : 'Generate Script'}
          </button>
        </form>

        {hasScript && (
          <div className="mt-10 space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">Script</label>
              {isEditing ? (
                <>
                  <textarea
                    value={editedScript}
                    onChange={(e) => setEditedScript(e.target.value)}
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  />
                  <div className="prose max-w-none bg-gray-50 p-4 rounded mt-4">
                    <ReactMarkdown>{editedScript}</ReactMarkdown>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold"
                      type="button"
                    >
                      Save Edit
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="prose max-w-none bg-gray-50 p-4 rounded">
                    <ReactMarkdown>{script}</ReactMarkdown>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (optional)</label>
                    <input
                      type="text"
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Enter feedback for refinement or leave empty to approve"
                      className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleApproveOrRefineScript}
                      className={`flex-1 ${feedback.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 font-semibold`}
                      type="button"
                    >
                      {feedback.trim() ? 'Refine Script' : 'Approve Script'}
                    </button>
                  </div>
                </>
              )}
              {statusMessage && (
                <div className="mt-2 text-green-600 font-semibold">{statusMessage}</div>
              )}
            </div>
          </div>
        )}

        {/* Video Preview & Approval UI */}
        {videoUrl && (
          <div className="mt-10 space-y-4 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Video Preview</h2>
            <video controls width="100%" src={videoUrl} className="rounded-lg shadow" />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleApproveVideo}
                className={`flex-1 py-2 px-4 rounded-full font-semibold text-lg ${videoApproval === 'approved' ? 'bg-green-600 text-white' : 'bg-white border border-green-600 text-green-600 hover:bg-green-50'}`}
                disabled={videoApproval === 'approved'}
              >
                Approve Video
              </button>
              <button
                onClick={handleRejectVideo}
                className={`flex-1 py-2 px-4 rounded-full font-semibold text-lg ${videoApproval === 'rejected' ? 'bg-red-600 text-white' : 'bg-white border border-red-600 text-red-600 hover:bg-red-50'}`}
                disabled={videoApproval === 'rejected'}
              >
                Reject Video
              </button>
            </div>
            {videoApproval === 'approved' && <p className="text-green-600 font-bold mt-2">Video approved! Uploading to YouTube...</p>}
            {videoApproval === 'rejected' && <p className="text-red-600 font-bold mt-2">Video rejected! Sent for revision.</p>}
          </div>
        )}
      </div>
    </main>
  )
} 