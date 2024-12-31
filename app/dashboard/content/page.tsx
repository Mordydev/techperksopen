import { Metadata } from 'next'
import { ContentHubClient } from './components/ContentHubClient'

export const metadata: Metadata = {
  title: 'Content Hub - TechPerks',
  description: 'Manage and schedule your content with our intuitive content hub.',
}

export default function ContentHubPage() {
  return <ContentHubClient />
} 