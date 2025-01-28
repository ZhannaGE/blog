import { useNavigate, useParams } from "react-router-dom";
import { useGetArticleQuery, useUpdateArticleMutation } from "../api.js";
import ArticleForm from "./ArticleForm";
import { message } from "antd";

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetArticleQuery(slug);
  const [updateArticle] = useUpdateArticleMutation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading article: {error.message}</p>;
  }

  const { article } = data;

  if (!article) {
    return <p>No article data available.</p>;
  }

  const handleSubmit = async (updatedArticleData) => {
    const articleData = {
      ...updatedArticleData,
      tagList: updatedArticleData.tagList.split(",").map((tag) => tag.trim()), // Преобразуем строку в массив
    };

    try {
      const response = await updateArticle({ slug, articleData }).unwrap();
      console.log("Update response:", response);
      message.success("Article updated successfully!");
      navigate(`/articles/${slug}`);
    } catch (err) {
      console.error("Error updating article:", err);
      message.error("Failed to update article");
    }
  };

  return (
    <ArticleForm
      initialData={{
        ...article,
        tagList: article.tagList.join(", "), // Преобразуем массив в строку для input
      }}
      onSubmit={handleSubmit}
    />
  );
}
