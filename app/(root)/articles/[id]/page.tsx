"use client"

import { useEffect, useState } from "react"
import { useFinance, type Article } from "@/lib/store/articles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArticleCard } from "@/components/articles/ArticleCard"
import { ArrowLeft, Bookmark, Calendar, Clock, Tag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import "../article.css"

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { articles, toggleArticleFavorite } = useFinance()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  useEffect(() => {
    const currentArticle = articles.find((a) => a.id === params.id) || null
    setArticle(currentArticle)

    if (currentArticle) {
      const related = articles
        .filter((a) => 
          a.id !== currentArticle.id && 
          (a.category === currentArticle.category || 
           a.tags.some(tag => currentArticle.tags.includes(tag)))
        )
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 3)
      
      setRelatedArticles(related)
    }
  }, [articles, params.id])

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <p className="text-muted-foreground mb-6">The article youre looking for doesnt exist or has been removed.</p>
        <Link href="/articles">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "saving":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "budgeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "investing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "debt":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
    }
  }

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/articles">
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-background/80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm overflow-hidden">
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div
                  className={cn(
                    "absolute top-4 left-4 px-3 py-1 rounded-md text-sm font-medium",
                    getCategoryColor(article.category),
                  )}
                >
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(article.publishDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {article.readTime} min read
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("px-0 hover:bg-transparent", article.isFavorite ? "text-primary" : "text-muted-foreground")}
                      onClick={() => toggleArticleFavorite(article.id)}
                    >
                      <Bookmark className={cn("h-4 w-4 mr-1", article.isFavorite ? "fill-primary" : "")} />
                      {article.isFavorite ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>

                <div 
                  className="article-content max-w-none p-4 mt-4 mb-6 rounded-lg bg-black/20 border border-white/5"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
                    {article.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="space-y-4">
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map((relatedArticle) => (
                      <ArticleCard key={relatedArticle.id} article={relatedArticle} compact />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No related articles found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
