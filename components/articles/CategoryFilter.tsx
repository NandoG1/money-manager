"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: { id: string; name: string }[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory("all")}
        className={cn(
          selectedCategory === "all" 
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white" 
            : "border-white/10 hover:bg-background/80", 
          "rounded-full"
        )}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            selectedCategory === category.id 
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white" 
              : "border-white/10 hover:bg-background/80", 
            "rounded-full"
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
