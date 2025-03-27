import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarContainer, MenuContent, Hamburger, Overlay } from "./styles";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../assets/Logo-Ponto-Digital.svg";
import Button from "../Button";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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
          <Link to="criar-funcionario" onClick={toggleMenu}>
            Criar Funcionário
          </Link>
          <Link to="listar-funcionarios" onClick={toggleMenu}>
            Listar Funcionários
          </Link>
          <Link to="gerenciar-escalas" onClick={toggleMenu}>
            Gerenciar Escalas
          </Link>
          <Link to="relatorio-de-horas" onClick={toggleMenu}>
            Relatório de Horas
          </Link>
        </MenuContent>
        <Button onClick={handleLogout}>Sair</Button>
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
