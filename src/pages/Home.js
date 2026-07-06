import logo from '../logo.svg';
import '../App.css';
import React, { useState, useEffect, useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { ComLeftBar, ComRightBar, ComListOrderBar, Menus } from '../components/Index';
import axios from 'axios';
import { AuthContext } from '../authentication/AuthContext';
import { API_URL } from '../utils/constants';

function Home(props) {
  const auth = useContext(AuthContext);
  const [menus, setMenus] = useState([]);
  const [categoryYangDipilih, setCategoryYangDipilih] = useState('Makanan');
  const [keranjangs, setKeranjangs] = useState([]);
  const [showRightBar, setShowRightBar] = useState(false);
  const [summarystok, setSummarystok] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect untuk menangani perubahan user dari context
  useEffect(() => {
    const user = auth?.user || null;
    
    if (user) {
      const namastand = user.first_name || '';
      let defaultCategory = 'Camilan';
      
      if (namastand && namastand.includes('Btmentay')) {
        defaultCategory = 'Makanan';
      } else if (namastand && namastand.includes('Imtea')) {
        defaultCategory = 'Minuman';
      }
      
      setCategoryYangDipilih(defaultCategory);
      setIsLoading(false);
      
      // Load data setelah user ditemukan
      getProductsByCategory(defaultCategory);
      getListKeranjang();
      getDataStok();
    } else {
      // Jika user belum ada, tunggu
      setIsLoading(true);
    }
  }, [auth]); // Jalankan setiap kali auth berubah

  // Effect untuk load data awal
  useEffect(() => {
    // Cek apakah user sudah ada di context
    if (auth?.user) {
      const user = auth.user;
      const namastand = user.first_name || '';
      let defaultCategory = 'Camilan';
      
      if (namastand === 'ImteaSP') {
        defaultCategory = 'Makanan';
      } else if (namastand === 'BtmentaySP') {
        defaultCategory = 'Minuman';
      }
      
      setCategoryYangDipilih(defaultCategory);
      setIsLoading(false);
      
      getProductsByCategory(defaultCategory);
      getListKeranjang();
      getDataStok();
    }
  }, []); // Jalankan sekali saat mount

  // Fungsi-fungsi
  const getProductsByCategory = (category) => {
    axios
      .get(API_URL + "/menulist/" + category)
      .then(res => {
        setMenus(res.data);
      })
      .catch(error => {
        alert("Error get data menu dari API");
      });
  }

  const getListOrder = () => {
    setShowRightBar(prevState => !prevState);
  }

  const getNewOrder = () => {
    setShowRightBar(prevState => !prevState);
  }

  const getListKeranjang = () => {
    const keranjang = localStorage.getItem('keranjang');
    if (keranjang) {
      const dataKeranjang = JSON.parse(keranjang);
      setKeranjangs(dataKeranjang);
    }
  }

  const changeCategory = (value) => {
    setCategoryYangDipilih(value);
    setMenus([]); // Kosongkan dulu untuk loading effect
    getProductsByCategory(value);
  }

  const masukKeranjang = (value) => {
    const mykeranjang = JSON.parse(localStorage.getItem('keranjang') || '[]');
    
    // Find data true / false
    const items = mykeranjang.some(item => item.product.id === value.id);
    
    // JIKA MENU BELUM ADA DI KERANJANG
    if (items === false) {
      const keranjang = {
        jumlah: 1,
        total_harga: value.Harga,
        product: value
      };
      
      const existingCart = JSON.parse(localStorage.getItem('keranjang')) || [];
      existingCart.push(keranjang);
      localStorage.setItem('keranjang', JSON.stringify(existingCart));
      
      getListKeranjang();
      
    // JIKA ADA MENU YG SUDAH MASUK KERANJANG
    } else {
      const keranjangs = JSON.parse(localStorage.getItem('keranjang') || '[]');
      const filteredData = keranjangs.filter(item => item.product.MenuID === value.MenuID);
      
      const keranjang = {
        jumlah: filteredData.reduce((total, item) => total + item.jumlah, 0) + 1,
        total_harga: filteredData.reduce((total, item) => total + item.total_harga, 0) + value.Harga,
        product: value
      };
      
      const existingCart = JSON.parse(localStorage.getItem('keranjang') || '[]');
      const itemIndex = existingCart.findIndex(item => item.product.MenuID === value.MenuID);
      
      if (itemIndex !== -1) {
        existingCart[itemIndex] = { ...existingCart[itemIndex], ...keranjang };
      } else {
        existingCart.push(keranjang);
      }
      
      localStorage.setItem('keranjang', JSON.stringify(existingCart));
      getListKeranjang();
    }
  }

  const getDataStok = () => {
    const user = auth?.user || null;
    if (!user) {
      return;
    }
    
    const namastand = user.first_name;
    const url = "http://localhost:8000/jumlahhabis/" + namastand;
    
    axios
      .post(url)
      .then(res => {
        setSummarystok(res.data);
      })
      .catch(error => {
        alert("Error get data stok");
      });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-3 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Jika user tidak ada
  if (!auth?.user) {
    return (
      <div className="mt-3 text-center">
        <p>Silahkan login terlebih dahulu</p>
      </div>
    );
  }

  // Render utama
  return (
    <div className='mt-3'>
      <div style={{ padding: '10px', background: '#f0f0f0' }}>
        <div className="text-end">
          {auth.user.first_name} - {auth.user.last_name}
          <button onClick={auth.logout}> Logout </button>
        </div>
        <h4 className="fw-bold">FORM ORDER</h4>
        
        <Container fluid>
          <Row>
            <Col className='mt-3'>
              <strong className="me-3">KLIK ITEM</strong>
              
              <ComLeftBar 
                changeCategory={changeCategory} 
                categoryYangDipilih={categoryYangDipilih} 
              />
              
              {auth.user.is_staff === true && (
                <div className="d-flex gap-4">
                  <span>Total habis : <b>{summarystok.total_keseluruhan_pcs} pcs</b></span>
                  <span>/ Total porsi : <b>{summarystok.stok_summary} pcs </b></span>
                </div>
              )}
              
              <hr />
              <Row>
                {menus && menus.length > 0 ? (
                  menus.map((menu) => (
                    <Menus
                      key={menu.MenuID}
                      menu={menu}
                      masukKeranjang={masukKeranjang}
                    />
                  ))
                ) : (
                  <div className="text-center w-100">
                    <p>Tidak ada produk untuk kategori {categoryYangDipilih}</p>
                  </div>
                )}
              </Row>
            </Col>
            
            {showRightBar ? (
              <ComListOrderBar 
                {...props} 
                getNewOrder={getNewOrder}
              />
            ) : (
              <ComRightBar 
                keranjangs={keranjangs} 
                {...props} 
                getListKeranjang={getListKeranjang}
                getListOrder={getListOrder}
              /> 
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Home;