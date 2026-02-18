import React from 'react'
import { Col,Card } from 'react-bootstrap'
import {numberWithCommas} from '../utils/utils'
// import { useState } from "react";

const Menus = ({ menu, masukKeranjang }) => {

  // const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    masukKeranjang(menu);
    // setIsClicked(!isClicked); // Toggle state
  };

  return (

    <Col md={4} xs={6} className="mb-4"  style={{cursor: 'pointer'}}>
      <Card 
        className='shadow card-clickable' // className='shadow' 
        onClick={handleClick} // onClick={() => masukKeranjang(menu)} 
      >
        <Card.Img variant="top" src={"assets/images/"+menu.Category.toLowerCase()+"/"+menu.Path_gambar} width="300" height="200"/>
        <Card.Body>
          <Card.Title><b>{menu.Nama}</b></Card.Title>
          <Card.Text>
            Rp.{numberWithCommas(menu.Harga)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Menus