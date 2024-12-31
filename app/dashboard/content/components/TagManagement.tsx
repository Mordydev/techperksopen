'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tag as TagIcon, Plus, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Tag {
  id: string
  name: string
  category?: string
  color?: string
  usageCount?: number
}

interface TagCategory {
  id: string
  name: string
  color?: string
}

interface TagManagementProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  suggestedTags?: Tag[]
  categories?: TagCategory[]
  className?: string
}

export function TagManagement({
  selectedTags,
  onTagsChange,
  suggestedTags = [],
  categories = [],
  className,
}: TagManagementProps) {
  const [newTag, setNewTag] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [filteredTags, setFilteredTags] = useState<Tag[]>(suggestedTags)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    let filtered = suggestedTags

    if (searchQuery) {
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((tag) => tag.category === selectedCategory)
    }

    setFilteredTags(filtered)
  }, [searchQuery, selectedCategory, suggestedTags])

  const handleAddTag = (tagName: string) => {
    if (!tagName.trim()) return

    if (selectedTags.includes(tagName)) {
      toast.error('Tag already exists')
      return
    }

    onTagsChange([...selectedTags, tagName])
    setNewTag('')
    setShowTagPicker(false)
  }

  const handleRemoveTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tagName))
  }

  const handleClearTags = () => {
    onTagsChange([])
  }

  const getTagColor = (tagName: string) => {
    const tag = suggestedTags.find((t) => t.name === tagName)
    return tag?.color || 'bg-primary'
  }

  const getTagCategory = (tagName: string) => {
    const tag = suggestedTags.find((t) => t.name === tagName)
    return tag?.category
  }

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Tags</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearTags}
            className="h-8 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn('pr-1.5', getTagColor(tag))}
          >
            <TagIcon className="h-3 w-3 mr-1" />
            {tag}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTag(tag)}
              className="h-4 w-4 ml-1 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        <Popover open={showTagPicker} onOpenChange={setShowTagPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search tags..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandEmpty>
                {searchQuery && (
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleAddTag(searchQuery)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create "{searchQuery}"
                    </Button>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {categories.length > 0 && (
                  <div className="border-b">
                    <ScrollArea className="max-h-20">
                      <div className="flex gap-1 p-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(
                              selectedCategory === category.id ? null : category.id
                            )}
                            className={cn('h-7', category.color)}
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                <ScrollArea className="h-72">
                  {filteredTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name)
                    return (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => {
                          if (isSelected) {
                            handleRemoveTag(tag.name)
                          } else {
                            handleAddTag(tag.name)
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            tag.color || 'bg-primary'
                          )} />
                          <span>{tag.name}</span>
                          {tag.category && (
                            <Badge variant="secondary" className="ml-auto">
                              {tag.category}
                            </Badge>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </CommandItem>
                    )
                  })}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {suggestedTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm text-muted-foreground">Suggested Tags</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter((tag) => !selectedTags.includes(tag.name))
              .slice(0, 5)
              .map((tag) => (
                <Button
                  key={tag.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTag(tag.name)}
                  className={cn('h-7', tag.color)}
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag.name}
                  {tag.usageCount && (
                    <Badge variant="secondary" className="ml-1">
                      {tag.usageCount}
                    </Badge>
                  )}
                </Button>
              ))}
          </div>
        </div>
      )}
    </Card>
  )
} 