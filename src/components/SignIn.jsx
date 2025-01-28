import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Col, Spin, Alert } from "antd";
import { useLoginMutation, useGetCurrentUserQuery } from "../api.js";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function SignIn() {
  const [login] = useLoginMutation();
  const { refetch } = useGetCurrentUserQuery(undefined, {
    skip: true,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      refetch();
    }
  }, [isLoggedIn, refetch]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(values).unwrap();
      localStorage.setItem("jwt_token", response.user.token);

      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="height">
      <div className="article-item">
        <h2>Sign In</h2>
        <Row justify="center" style={{ marginTop: 50 }}>
          <Col span={8}>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email обязателен" },
                  { type: "email", message: "Введите корректный email" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email address" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Пароль обязателен" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : "Login"}
                </Button>
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  Don’t have an account?{" "}
                  <Link to="/sign-up" style={{ color: "#1677ff" }}>
                    Sign Up.
                  </Link>
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default SignIn;
