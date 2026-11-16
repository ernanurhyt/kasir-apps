import React from 'react'
import { Col, Card } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils'
import "../styles.css";

const Menus = ({ menu, masukKeranjang }) => {
  const handleClick = () => {
    masukKeranjang(menu);
  };

  return (
    <Col md={3} xs={6} className="mb-4">
      <Card 
        className='shadow h-100 card-clickable'
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      >
        <div style={{ 
          width: '100%', 
          paddingTop: '75%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa'
        }}>
          <Card.Img 
            variant="top" 
            src={"assets/images/"+menu.Kategori.toLowerCase()+"/"+menu.Path_gambar}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            // Ukuran gambar untuk mobile (akan di-override dengan CSS)
            className="menu-image"
          />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="mb-2" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)' }}>
            <b>{menu.Nama}</b>
          </Card.Title>
          <Card.Text className="mt-auto mb-0" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>
            <b>Rp.{numberWithCommas(menu.Harga)}</b>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Menus