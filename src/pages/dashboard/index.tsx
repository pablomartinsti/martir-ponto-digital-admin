import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Menu";
import { Container, ContainerItems } from "./styles";

function Dashboard() {
  return (
    <Container>
      <Sidebar />
      <ContainerItems>
        <Outlet />
      </ContainerItems>
    </Container>
  );
}

export default Dashboard;
