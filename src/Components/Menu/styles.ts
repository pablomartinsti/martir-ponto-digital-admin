import styled from "styled-components";
import { motion } from "framer-motion";

interface SidebarProps {
  $isOpen: boolean;
}

export const Hamburger = styled.button`
  display: none;
  width: 100%;
  background: #011d4c;
  border: none;
  color: #e8b931;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  cursor: pointer;

  @media (max-width: 480px) {
    display: flex;
    justify-content: space-between;

    img {
      width: 80px;
    }
  }
`;

export const Overlay = styled.div`
  @media (max-width: 480px) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }
`;

export const SidebarContainer = styled(motion.aside)<SidebarProps>`
  width: 250px;
  background-color: #011d4c;
  height: 100vh;
  padding: 2rem 1rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1002;
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.3s ease-in-out;

  img {
    width: 250px;
  }

  @media (min-width: 480px) {
    position: relative;
    transform: translateX(0);
  }
`;

export const MenuContent = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: #f0c040;
    }
  }
`;
