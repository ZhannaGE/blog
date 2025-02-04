import { Navigate, useParams } from "react-router-dom";
import { useGetCurrentUserQuery, useGetArticleQuery } from "../api";
import EditArticle from "../components/EditArticle";

const ProtectedEditArticle = () => {
    const { slug } = useParams();

    // Получаем текущего пользователя
    const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();

    // Получаем статью
    const { data: article, isLoading: isArticleLoading } = useGetArticleQuery(slug);

    if (isUserLoading || isArticleLoading) return <p>Загрузка...</p>;

    // Проверяем авторизацию и принадлежность статьи пользователю
    if (!user || article.article.author.username !== user.user.username) {
        return <Navigate to={`/articles/${slug}`} replace />;
    }

    return <EditArticle />;
};

export default ProtectedEditArticle;
