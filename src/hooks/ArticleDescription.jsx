import { useState } from "react";

// eslint-disable-next-line react/prop-types
const ArticleDescription = ({ description }) => {
  const [isExpanded] = useState(false);

  // Максимальная длина, которую мы показываем по умолчанию
  const maxLength = 100;

  // Обрезаем описание, если оно длиннее максимальной длины
   
  const displayText =
      // eslint-disable-next-line react/prop-types
    isExpanded || description.length <= maxLength
      ? description
      : // eslint-disable-next-line react/prop-types
        description.slice(0, maxLength) + "...";

  return (
    <div>
      <p>{displayText}</p>
    </div>
  );
};

export default ArticleDescription;
