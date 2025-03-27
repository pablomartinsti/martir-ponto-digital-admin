import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SidebarContainer, MenuContent, Hamburger, Overlay } from "./styles";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../assets/Logo-Ponto-Digital.svg";
import Button from "../Button";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // ✅ usa o contexto para limpar tudo
    navigate("/"); // 🔁 redireciona para a tela de login
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botão hambúrguer visível apenas em telas pequenas */}
      <Hamburger onClick={toggleMenu}>
        <img src={Logo} alt="Logo Ponto Digital" />
        {isOpen ? <FiX size={50} /> : <FiMenu size={50} />}
      </Hamburger>

      {/* Overlay para escurecer fundo no mobile */}
      {isOpen && <Overlay onClick={toggleMenu} />}

      <SidebarContainer $isOpen={isOpen}>
        <MenuContent>
          <img src={Logo} alt="Logo Ponto Digital" />
          <Link
            to="criar-funcionario"
            onClick={toggleMenu}
            className={
              location.pathname.includes("criar-funcionario") ? "ativo" : ""
            }
          >
            Criar Funcionário
          </Link>

          <Link
            to="listar-funcionarios"
            onClick={toggleMenu}
            className={
              location.pathname.includes("listar-funcionarios") ? "ativo" : ""
            }
          >
            Listar Funcionários
          </Link>

          <Link
            to="gerenciar-escalas"
            onClick={toggleMenu}
            className={
              location.pathname.includes("gerenciar-escalas") ? "ativo" : ""
            }
          >
            Gerenciar Escalas
          </Link>

          <Link
            to="relatorio-de-horas"
            onClick={toggleMenu}
            className={
              location.pathname.includes("relatorio-de-horas") ? "ativo" : ""
            }
          >
            Relatório de Horas
          </Link>
        </MenuContent>
        <Button onClick={handleLogout}>Sair</Button>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
