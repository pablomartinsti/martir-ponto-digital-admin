import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
    text-transform: capitalize;
    transition: all 0.3s;
  }

  @media print {
    /* Ocultar sidebar e logo */
    aside,
    nav,
    .sidebar,
    .menu-lateral,
    .logo,
    img {
      display: none !important;
    }
    .col-status {
    display: none !important;
  }

    /* Ocultar filtros e botões */
    select,
    .input-mes,
    .react-datepicker-wrapper,
    button,
    .botao-imprimir,
    .filtros,
    .dropdown-funcionario {
      display: none !important;
    }

    /* Ocultar toast do react-toastify */
    .Toastify__toast-container {
      display: none !important;
    }

    /* Expandir o conteúdo principal */
    main,
    .conteudo-principal,
    .relatorio-container {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }

`;

export default GlobalStyle;
