import { useCreateArticleMutation } from "../api.js";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ArticleForm = ({ initialData = {}, onSubmit }) => {
  const [form] = Form.useForm();
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    const tags = values.tagList
      ? values.tagList
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const articleData = { ...values, tagList: tags };

    console.log("Submitting form data:", articleData);

    try {
      const response = await createArticle(articleData).unwrap();
      message.success("Article created successfully!");
      navigate(`/articles/${response.article.slug}`);
    } catch (error) {
      console.error("Error creating article:", error);
      message.error("Failed to create article. Please try again.");
    }
  };

  return (
    <div className="height">
      <div className="article-item">
        <h2>Create new article</h2>
        <Form
          form={form}
          initialValues={initialData}
          onFinish={onSubmit || handleFinish}
          onFinishFailed={(errorInfo) => {
            console.error("Validation errors:", errorInfo);
            message.error("Please correct the errors in the form.");
          }}
          layout="vertical"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Article title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input placeholder="Article description" />
          </Form.Item>

          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please enter the body" }]}
          >
            <Input.TextArea rows={4} placeholder="Article body" />
          </Form.Item>

          <Form.Item label="Tags" name="tagList">
            <Input placeholder="Comma-separated tags" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ArticleForm;
