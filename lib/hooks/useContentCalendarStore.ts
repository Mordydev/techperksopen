import { create } from 'zustand'

interface ContentCalendarStore {
  isOpen: boolean
  selectedPostId: string | null
  openModal: (postId: string) => void
  closeModal: () => void
}

export const useContentCalendarStore = create<ContentCalendarStore>((set) => ({
  isOpen: false,
  selectedPostId: null,
  openModal: (postId: string) => set({ isOpen: true, selectedPostId: postId }),
  closeModal: () => set({ isOpen: false, selectedPostId: null }),
})) 