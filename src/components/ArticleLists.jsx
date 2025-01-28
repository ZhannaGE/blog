import { useState, useEffect } from "react";
import {
  useGetArticlesQuery,
  useFavoriteArticleMutation,
  useUnFavoriteArticleMutation,
} from "../api.js";
import { Link } from "react-router-dom";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Pagination, message, Spin, Alert } from "antd";
import avatar from "/src/assets/avatar.png";
import ArticleDescription from "../hooks/ArticleDescription.jsx";

export default function ArticleLists() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const { data, error, isLoading, refetch } = useGetArticlesQuery(
    { page: currentPage },
    { pollingInterval: isActive ? 1000 : 0 },
  );
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnFavoriteArticleMutation();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden); // Активен, если вкладка открыта
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Обновляем локальные статьи только при изменении `data`
  useEffect(() => {
    if (data?.articles) {
      setArticles(data.articles);
    }
  }, [data]);

  const handleLike = async (article) => {
    try {
      if (article.favorited) {
        await unfavoriteArticle(article.slug).unwrap();
        message.success("Article unfavorited");
      } else {
        await favoriteArticle(article.slug).unwrap();
        message.success("Article favorited");
      }

      await refetch();
    } catch (err) {
      console.error("Error updating favorite status:", err);
      message.error("Failed to update favorite status");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="height">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="height">
        <Alert message="Error loading articles." type="error" showIcon />
      </div>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <div className="article-item" key={article.slug}>
          <div className="flex">
            <div className="flex">
              <div>
                <Link className="title" to={`/articles/${article.slug}`}>
                  {article.title.charAt(0).toUpperCase() +
                    article.title.slice(1)}
                </Link>{" "}
                {article.favorited ? (
                  <HeartFilled
                    onClick={() => handleLike(article)}
                    style={{ color: "red", cursor: "pointer" }}
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => handleLike(article)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <span> {article.favoritesCount}</span>
                <br />
                <p>
                  {article.tagList && article.tagList.length > 0 ? (
                    article.tagList.map((tag, index) => {
                      const trimmedTag = tag.trim();
                      return trimmedTag.length > 0 ? (
                        <span key={index} className="tag-border">
                          {trimmedTag}
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span className="tag-border">No tags</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="gap">
                <strong>
                  {article.author.username.charAt(0).toUpperCase() +
                    article.author.username.slice(1)}{" "}
                </strong>
                <br />
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <img
                className="article-avatar"
                src={
                  article.author.image?.startsWith("https")
                    ? article.author.image
                    : avatar
                }
                alt={article.author.username || "Default Avatar"}
              />
            </div>
          </div>
          <div className="start">
            <ArticleDescription description={article.description} />
          </div>
        </div>
      ))}
      <Pagination
        align="center"
        current={currentPage}
        total={data.articlesCount}
        pageSize={5}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
}
