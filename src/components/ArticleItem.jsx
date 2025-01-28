import {
  useGetArticleQuery,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnFavoriteArticleMutation,
  useGetCurrentUserQuery,
} from "../api.js";
import { useParams, useNavigate } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import avatar from "/src/assets/avatar.png";
import { useEffect, useState } from "react";

export default function ArticleItem() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetArticleQuery(slug, {
    refetchOnMountOrArgChange: true,
  }); // Автоматическое обновление при изменении slug
  const { data: currentUser } = useGetCurrentUserQuery();
  const [deleteArticle] = useDeleteArticleMutation();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnFavoriteArticleMutation();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const article = data?.article;

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("jwt_token");
    setIsUserLoggedIn(!!user && !!token);
  }, [currentUser]);

  const handleLike = async () => {
    try {
      if (article.favorited) {
        await unfavoriteArticle(slug).unwrap();
        message.success("Article unfavorited");
      } else {
        await favoriteArticle(slug).unwrap();
        message.success("Article favorited");
      }
      refetch(); // Перезапрашиваем данные статьи
    } catch (err) {
      console.error("Error updating favorite status:", err);
      message.error("Failed to update favorite status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      message.success("Article successfully deleted");
      navigate("/");
    } catch (err) {
      console.error("Error deleting article:", err);
      message.error("Failed to delete the article");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading article: {error.message}</p>;

  if (!article) return null;

  return (
    <div className="height">
      <div className="article-item">
        <div className="flex">
          <div className="flex">
            <div>
              <span className="title">
                {article.title.charAt(0).toUpperCase() + article.title.slice(1)}
              </span>
              {article.favorited ? (
                <HeartFilled
                  onClick={handleLike}
                  style={{ color: "red", cursor: "pointer" }}
                />
              ) : (
                <HeartOutlined
                  onClick={handleLike}
                  style={{ cursor: "pointer" }}
                />
              )}
              <span> {article.favoritesCount}</span>
              <br />

              <div className="border">
                {article.tagList?.length && article.tagList.join(", ").trim()
                  ? article.tagList.join(", ")
                  : "No tags"}
              </div>
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
        {/* Проверка, авторизован ли пользователь и совпадает ли его имя с автором статьи */}
        {isUserLoggedIn &&
          currentUser?.user?.username === article.author.username && (
            <div className="edit-actions">
              <Button
                onClick={() => navigate(`/articles/${slug}/edit`)}
                type="primary"
                color="cyan"
                variant="outlined"
              >
                Edit Article
              </Button>
              <Popconfirm
                title="Delete the article"
                description="Are you sure you want to delete this article?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete Article</Button>
              </Popconfirm>
            </div>
          )}
        <div>
          <Markdown>{article.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
