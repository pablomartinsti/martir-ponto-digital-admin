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
  html, body {
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
    font-size: 12pt;
    color: black;
    background: white;
  }

  #print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1cm;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: white !important;
  }

  h1, .titulo-print {
    font-size: 50pt;
    font-weight: bold;
    text-align: center;
    margin-bottom: 0.5cm;
  }

  .card-resumo {
    font-size: 25pt;
    padding: 1rem;
    border: 1px solid #000;
    border-radius: 8px;
    background-color: #f8f8f8;
  }

  .card-resumo p {
    margin: 4pt 0;
  }

  .card-resumo strong {
    font-weight: bold;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    
  }

  th, td {
    border: 1px solid #000;
    padding: 6pt 4pt;
    text-align: center;
    font-size: 20pt;
  }
  p{
    text-align: center;
    font-size: 25pt;
  }

  td.saldo-negativo {
    color: red;
    font-weight: bold;
  }

  td.saldo-positivo {
    color: green;
    font-weight: bold;
  }
  
  button,
  nav,
  aside,
  header,
  footer {
    display: none !important;
  }

  a::after {
    content: "";
  }
}
@page {
  size: A4 portrait; /* retrato */
  margin: 1.5cm;
}


`;

export default GlobalStyle;
