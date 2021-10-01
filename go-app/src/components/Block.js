import React, { useState, useEffect } from "react";
import '../App.css';
import moment from 'moment'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";


function Block() {
  
  const [blocknum, setBlocknum] = useState('latest');
  const [BlockInfo, setBlockInfo] = useState([]);

  useEffect(() => {
    getBlock('latest');
  }, []);
  const getBlock = () => {
    fetch(
      `http://127.0.0.1:8000/api/block/`+blocknum,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        let jsondata = JSON.parse(response);
        if(jsondata.result === null){
          alert("The block you are looking for does not exist!");
          setBlocknum('latest');
        }
        else{
          setBlockInfo(jsondata.result);
          console.log(jsondata.result);
        }
      })
      .catch(error => console.log(error));
  }
  const converthextodecimal = (hex) => {
    let decimal = parseInt(hex, 16);
    return decimal;
  }
  const converttimestamptodate = (timestamp) => {
    var timestampstring = converthextodecimal(timestamp);
    var formatted = moment.unix(timestampstring).format("YYYY-MM-DD hh:mm:ss");
    console.log(timestamp, timestampstring, formatted);
    return formatted;
  }

  return (
    <Container>
      <Form.Control type="number" onChange={(event) => setBlocknum(event.target.value)} value={blocknum} />
      <Button onClick={getBlock}>Select</Button>
      <Card>
        <Card.Header>Block Info</Card.Header>
        <Card.Body>
          <Row>
            <Col md="4">Block Number:</Col>
            <Col md="8">{converthextodecimal(BlockInfo.number)}</Col>
          </Row>
          <Row>
            <Col md="4">Timestamp:</Col>
            <Col md="8">{converttimestamptodate(BlockInfo.timestamp)}</Col>
          </Row>
          <Row>
            <Col md="4">Transactions:</Col>
            <Col md="8">{BlockInfo.transactions !== undefined ? BlockInfo.transactions.length : 0}</Col>
          </Row>
          <Row>
            <Col md="4">Mined by:</Col>
            <Col md="8">{BlockInfo.miner}</Col>
          </Row>
          <Row>
            <Col md="4">Difficulty:</Col>
            <Col md="8">{converthextodecimal(BlockInfo.difficulty)}</Col>
          </Row>
          <Row>
            <Col md="4">Total Difficulty:</Col>
            <Col md="8">{converthextodecimal(BlockInfo.totalDifficulty)}</Col>
          </Row>
          <Row>
            <Col md="4">Gas Used:</Col>
            <Col md="8">{converthextodecimal(BlockInfo.gasUsed)}</Col>
          </Row>
          <Row>
            <Col md="4">Gas Limit:</Col>
            <Col md="8">{converthextodecimal(BlockInfo.gasLimit)}</Col>
          </Row>
          <Row>
            <Col md="4">Size:</Col>
            <Col md="8">{converthextodecimal(BlockInfo.size)} bytes</Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Block;
