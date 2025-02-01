import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Row, Col, Checkbox, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../api.js";

function SignUp() {
  const {
    control,
    handleSubmit,
    setError, // Используем для установки ошибок
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await createUser(data).unwrap();

      const { token, username, email, image } = result.user;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem(
          "user",
          JSON.stringify({
            username,
            email,
            image: image || null,
            token,
          })
      );

      message.success("Регистрация прошла успешно!");
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.status === 422) {
        const errorMessage = error.data?.errors;

        if (errorMessage?.username) {
          setError("username", {
            type: "server",
            message: errorMessage.username,
          });
        }

        if (errorMessage?.email) {
          setError("email", {
            type: "server",
            message: errorMessage.email,
          });
        }
      } else {
        message.error("Неизвестная ошибка. Пожалуйста, попробуйте снова.");
      }
    }
  };

  return (
      <div className="height">
        <div className="article-item">
          <h2>Create new account</h2>
          <Row justify="center" style={{ marginTop: 50 }}>
            <Col span={8}>
              <Form name="signup" onFinish={handleSubmit(onSubmit)}>
                <Form.Item
                    validateStatus={errors.username ? "error" : ""}
                    help={errors.username?.message}
                >
                  <Controller
                      name="username"
                      control={control}
                      rules={{
                        required: "Имя пользователя обязательно",
                        minLength: { value: 3, message: "Минимум 3 символа" },
                        maxLength: { value: 20, message: "Максимум 20 символов" },
                      }}
                      render={({ field }) => (
                          <Input
                              {...field}
                              prefix={<UserOutlined />}
                              placeholder="Username"
                          />
                      )}
                  />
                </Form.Item>

                <Form.Item
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email?.message}
                >
                  <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email обязателен",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Неверный формат email",
                        },
                      }}
                      render={({ field }) => (
                          <Input
                              {...field}
                              prefix={<UserOutlined />}
                              placeholder="Email address"
                          />
                      )}
                  />
                </Form.Item>

                <Form.Item
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                >
                  <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: "Пароль обязателен",
                        minLength: { value: 6, message: "Минимум 6 символов" },
                        maxLength: { value: 40, message: "Максимум 40 символов" },
                      }}
                      render={({ field }) => (
                          <Input.Password
                              {...field}
                              prefix={<LockOutlined />}
                              placeholder="Password"
                          />
                      )}
                  />
                </Form.Item>

                <Form.Item
                    validateStatus={errors.confirmPassword ? "error" : ""}
                    help={errors.confirmPassword?.message}
                >
                  <Controller
                      name="confirmPassword"
                      control={control}
                      rules={{
                        required: "Повторите пароль",
                        validate: (value) =>
                            value === password || "Пароли не совпадают",
                      }}
                      render={({ field }) => (
                          <Input.Password
                              {...field}
                              prefix={<LockOutlined />}
                              placeholder="Repeat Password"
                          />
                      )}
                  />
                </Form.Item>

                <Form.Item>
                  <Controller
                      name="agreement"
                      control={control}
                      rules={{ required: "Вы должны согласиться с условиями" }}
                      render={({ field }) => (
                          <Checkbox
                              {...field}
                              checked={field.value} // Устанавливает состояние чекбокса
                          >
                            I agree to the processing of my personal information
                          </Checkbox>
                      )}
                  />
                  {errors.agreement && (
                      <p style={{ color: "red" }}>{errors.agreement.message}</p>
                  )}
                </Form.Item>

                <Form.Item>
                  <Button
                      type="primary"
                      htmlType="submit"
                      block
                      loading={isLoading}
                  >
                    Create Account
                  </Button>
                  <div style={{ textAlign: "center", marginTop: 10 }}>
                    Already have an account?{" "}
                    <Link to="/sign-in" style={{ color: "#1677ff" }}>
                      Sign In
                    </Link>
                    .
                  </div>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
  );
}

export default SignUp;
