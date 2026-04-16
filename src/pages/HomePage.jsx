import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authService } from '@/features/auth/authService';
import { logout as logoutAction } from '@/features/auth/authSlice';
import { HoverButton } from "@/components/ui/hover-button";
import { BlurFade } from "@/components/ui/blur-fade";
import { HyperText } from "@/components/ui/hyper-text";
const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const isPremium = user?.subscription === "Premium";
  const logoRoute = user? (isPremium ? "../public/LogoPremium.png" : "../public/Logo.png") : "../public/Logo.png";
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
            SmartGoal
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
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <HoverButton as={Link} to="/dashboard">
                    Tablero
                  </HoverButton>
                </li>
                <li>
                  <HoverButton as={Link} to="/login" onClick={onLogout}>
                    Cerrar Sesión
                  </HoverButton>
                </li>
              </>
            ) : (
              <>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <HoverButton as={Link} to="/login">
                    Iniciar sesión
                  </HoverButton>
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <HoverButton as={Link} to="/register">
                    Registrarse
                  </HoverButton>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>
        <div className="bg-white text-black w-full flex-1 space-y-28 relative max-w-screen overflow-x-hidden font-sans">
          <div className="flex flex-col items-center text-center px-10 z-10 pt-16 pb-10">
            <BlurFade delay={0.5} inView>
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "30px"}}>
                <img src={logoRoute} alt="" className="w-1/3 object-cover transition-transform duration-500 group-hover:scale-110"/>
              </div>
            </BlurFade>
            <HyperText
              className="text-1xl font-bold text-black"
              text="Controlando tus ingresos y gastos, un paso a la vez"
            />
          </div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-[400px] rounded-t-full opacity-80 blur-3xl"
            style={{
              background: isPremium 
                ? 'linear-gradient(to top, rgba(180, 83, 9, 0.5), rgba(217, 119, 6, 0.15), transparent)'
                : 'linear-gradient(to top, rgba(20, 83, 11, 0.5), rgba(34, 197, 94, 0.15), transparent)'
            }}
          ></div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;