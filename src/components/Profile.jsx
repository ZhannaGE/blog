import { useEffect, useState } from "react";
import { Input, Button, Card, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "../api.js";

function Profile() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.user) {
      form.setFieldsValue({
        username: user.user.username || "",
        email: user.user.email || "",
        image: user.user.image || "",
      });
    }
  }, [user, isLoading, form]);

  const onSubmit = async (values) => {
    try {
      // Формируем объект для отправки (удаляем пароль, если он не указан)
      const payload = {
        username: values.username,
        email: values.email,
        image: values.image,
        ...(values.password ? { password: values.password } : {}),
      };

      const response = await updateUser(payload).unwrap();

      localStorage.setItem("user", JSON.stringify(response));

      navigate("/");

      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);

      message.error("Failed to update profile!");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400, padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Edit Profile
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            username: "",
            email: "",
            image: "",
            password: "",
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="New password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              { max: 40, message: "Password cannot exceed 40 characters!" },
            ]}
          >
            <Input.Password
              placeholder="New password"
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Avatar image (url)"
            name="image"
            rules={[{ type: "url", message: "Please enter a valid URL!" }]}
          >
            <Input placeholder="Avatar image" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isUpdating}>
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Profile;
