"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFinance, type Article } from "@/lib/store/articles"
import { Bookmark, Clock, Calendar, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ArticleCardProps {
  article: Article
  compact?: boolean
}

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const { toggleArticleFavorite } = useFinance()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
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
    <Card className={cn("overflow-hidden transition-all border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm", compact ? "h-full" : "hover:shadow-md")}>
      {!compact && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div
            className={cn(
              "absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium",
              getCategoryColor(article.category),
            )}
          >
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </div>
        </div>
      )}
      <CardHeader className={compact ? "p-4" : undefined}>
        <CardTitle className={cn("line-clamp-2", compact ? "text-base" : "text-xl")}>{article.title}</CardTitle>
        {!compact && (
          <CardDescription className="flex items-center text-xs gap-4 mt-2">
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(article.publishDate)}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {article.readTime} min read
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={compact ? "p-4 pt-0" : undefined}>
        <p className={cn("text-muted-foreground", compact ? "text-sm line-clamp-2" : "line-clamp-3")}>
          {article.summary}
        </p>

        {!compact && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-xs">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className={cn("flex justify-between", compact ? "p-4 pt-0" : undefined)}>
        <Button
          variant="ghost"
          size="sm"
          className={cn("px-0 hover:bg-transparent", article.isFavorite ? "text-primary" : "text-muted-foreground")}
          onClick={() => toggleArticleFavorite(article.id)}
        >
          <Bookmark className={cn("h-4 w-4 mr-1", article.isFavorite ? "fill-primary" : "")} />
          {article.isFavorite ? "Saved" : "Save"}
        </Button>

        <Link href={`/articles/${article.id}`} passHref>
          <Button size="sm" variant={compact ? "ghost" : "default"} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            Read {compact ? "" : "Article"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
