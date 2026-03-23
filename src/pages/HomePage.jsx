import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authService } from '@/features/auth/authService';
import { logout as logoutAction } from '@/features/auth/authSlice';
const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const onLogout = () => {
    authService.logout();
    dispatch(logoutAction());
    navigate("/login");
  };

  if (isLoading) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div>
      <header
        style={{
          padding: "20px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link
            to="/"
            style={{ textDecoration: "none", color: "black", fontSize: "1.5rem" }}
          >
            Finanzas
          </Link>
          {user && user.subscription && (
            <span
              style={{
                marginLeft: "15px",
                color: "#555",
                borderLeft: "1px solid #ccc",
                paddingLeft: "15px",
              }}
            >
              {user.subscription}
            </span>
          )}
        </div>
        <nav translate="no">
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {user ? (
              <>
                <li>
                  <span style={{ fontStyle: "italic" }}>
                    Hola, {user.full_name}
                  </span>
                </li>
                <li>
                  <Link to="/dashboard" translate="no">Tablero</Link>
                </li>
                <li>
                  <button onClick={onLogout}>Cerrar Sesión</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" translate="no">Iniciar sesión</Link>
                </li>
                <li>
                  <Link to="/register" translate="no">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>
        {/* ...contenido de la homepage... */}
      </main>
    </div>
  );
};

export default HomePage;