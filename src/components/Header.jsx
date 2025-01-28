import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarPlaceholder from "/src/assets/avatar.png";
import { useGetCurrentUserQuery } from "../api.js";
import { Button, Spin } from "antd";

function Header() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    return savedUser || null;
  });

  const token = localStorage.getItem("jwt_token");
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    if (!isLoading && user) {
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user, isLoading]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser !== currentUser) {
        setCurrentUser(storedUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError || !currentUser) {
    return (
      <header className="header">
        <Link to="/">
          <h1>Real World Blog</h1>
        </Link>
        <div>
          <Link className="gap" to="/sign-in">
            Sign In
          </Link>
          <Link to="/sign-up">
            <Button color="cyan" variant="outlined" size="large">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <Link to="/">
        <h1>RealWorld Blog</h1>
      </Link>
      <div>
        {currentUser && (
          <div className="user-info">
            <Button
              color="cyan"
              variant="outlined"
              size="middle"
              onClick={() => navigate("/articles/new")}
              className="gap"
            >
              Create Article
            </Button>

            <Link to="/profile">
              <strong>
                {currentUser.user.username.charAt(0).toUpperCase() +
                  currentUser.user.username.slice(1) || "No Name"}
              </strong>
              <img
                src={currentUser.user.image || avatarPlaceholder}
                alt={currentUser.user.username}
                className="article-avatar"
              />
            </Link>
            <Button
              onClick={handleLogout}
              color="default"
              variant="outlined"
              size="large"
            >
              Log Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
