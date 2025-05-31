"use client"

import { useState } from "react"
import { useFinance } from "@/lib/store/articles"
import { ArticleCard } from "@/components/articles/ArticleCard"
import { ArticleSearch } from "@/components/articles/ArticleSearch"
import { CategoryFilter } from "@/components/articles/CategoryFilter"
import { DailyTipCard } from "@/components/articles/DailyTipCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Bookmark } from "lucide-react"

export default function ArticlesPage() {
  const { articles } = useFinance()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const categories = [
    ...new Set(articles.map((article) => article.category)),
  ].map((category) => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
  }))

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const favoriteArticles = filteredArticles.filter((article) => article.isFavorite)

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">Financial Articles</h3>
          <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
        </div>

        <DailyTipCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ArticleSearch onSearch={setSearchQuery} />
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-black/60 border border-white/10">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              All Articles
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Saved Articles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery
                    ? "No articles match your search criteria. Try a different search term or category."
                    : "There are no articles in this category yet."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            {favoriteArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No saved articles</h3>
                <p className="text-muted-foreground max-w-md">
                  You havent saved any articles yet. Click the Save button on articles you want to read later.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
