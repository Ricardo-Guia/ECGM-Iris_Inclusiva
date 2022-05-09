import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";

import EditAssociado from "./components/associado/edit.component";
import AssociadoList from "./components/associado/list.component";
import CreateAssociado from "./components/associado/create.component";

function App() {
  return (<Router>
    <Navbar bg="primary">
      <Container>
        <Link to={"/"} className="navbar-brand text-white">
          Projeto Íris Inclusiva
        </Link>
      </Container>
    </Navbar>

    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Routes>
            <Route path="/associado/create" element={<CreateAssociado />} />
            <Route path="/associado/edit/:id" element={<EditAssociado />} />
            <Route exact path='/' element={<AssociadoList />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  </Router>);
}

export default App;