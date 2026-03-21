'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function SaveArticleBtn({ articleId }) {
  const [saved, setSaved] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  async function toggleSave() {
    if (!user) {
      toast.error('Please login to save articles')
      router.push('/auth/login')
      return
    }
    if (saved) {
      await supabase.from('saved_articles').delete()
        .eq('user_id', user.id).eq('article_id', articleId)
      setSaved(false)
      toast('Removed from saved')
    } else {
      await supabase.from('saved_articles').insert(
        { user_id: user.id, article_id: articleId }
      )
      setSaved(true)
      toast.success('Article saved! ✅')
    }
  }

  return (
    <button onClick={toggleSave}
      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
        saved
          ? 'bg-[#1B4D2E] text-white border-[#1B4D2E]'
          : 'border-[#1B4D2E] text-[#1B4D2E] hover:bg-[#1B4D2E] hover:text-white'
      }`}>
      {saved ? '✅ Saved' : '🔖 Save'}
    </button>
  )
}