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

  /* === Estilos para impressão === */
  @media print {
    body {
      margin: 0;
      padding: 0;
      font-size: 7pt;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    html, body {
      width: 100%;
      height: auto;
      overflow: visible;
    }

    #print-area {
      padding: 0;
      margin: 0;
      width: 100%;
    }

    h1 {
      font-size: 14pt;
      text-align: center;
      margin-bottom: 4pt;
    }
    .card-resumo {
      border: 1pt solid #000;
      padding: 1mm;
      font-size: 9pt;
     
      h2, h3, h4,span {
        font-size: 10pt;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 4pt;
      
    }

    th, td {
      border: 1pt solid #000;
      text-align: center;
    }

    .saldo-negativo {
      color: red !important;
    }

    .saldo-positivo {
      color: green !important;
    }

    .assinatura {
      margin-top: 8mm;
      font-size: 9pt;
      text-align: center;
    }

    .col-status {
      display: none !important;
    }

    /* Oculta elementos da interface na impressão */
    button,
    .no-print,
    nav,
    aside,
    select,
    input,
    .input-mes,
    header,
    footer,
    .logo,
    .card-resumo
    .page-title,
    .react-datepicker-wrapper,
    .react-datepicker__input-container,
    .Toastify__toast-container,
    .Toastify__toast,
    .Toastify__toast-body,
    .Toastify__close-button {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
      overflow: hidden !important;
    }

    /* Remove URLs automáticas nos links ao imprimir */
    a[href]:after {
      content: none !important;
    }
  }
`;

export default GlobalStyle;
