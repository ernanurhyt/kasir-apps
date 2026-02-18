import axios from "axios";
import { Component } from "react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import ModalKeranjang from "./ModalKeranjang";
import TotalBayar from "./TotalBayar";


export default class ComRightBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      keranjangDetail: false,
      jumlah: 0,
      keterangan: "",
      totalHarga: 0,
      menutoppings: [],
      selectedToppings: []
    };
  }

  componentDidMount() {
    this.getTopping();
  }

  getTopping = () => {
    const url = "https://web-production-80a65.up.railway.app/toppinglist";
    axios
      .get(url)// .get('/data/db.json')
      .then(res => {
        // alert("toppinglist")
        // alert( JSON.stringify(res.data))
        const menu = res.data;
        // // alert( JSON.stringify(res.data.topping))
        // const menu = res.data.topping;
        //       // alert("menutopping")
        //       // alert(JSON.stringify(menu))
        this.setState({ menutoppings: menu });
      })
      .catch(error => {
        alert("Error get data topping dari API")
      });
  }

  handleToppingChange = (topping, isChecked) => {
      // alert(JSON.stringify(topping.nama))
    const newTopping = {
      jumlah_top: 1,
      total_harga_top: topping.Harga,
      topping: topping
    };
    if (isChecked) {
      // alert("halo im here please check newTopping")
      // alert(JSON.stringify(newTopping))
      this.setState(prevState => ({
        selectedToppings: [...prevState.selectedToppings, newTopping],
        totalHarga:
          this.state.totalHarga + topping.Harga
      }));
    } else {
      const Topp = this.state.selectedToppings.find(item => item.topping.Nama === topping.Nama);
      this.setState(prevState => ({
        selectedToppings: prevState.selectedToppings.filter(item => item.topping.Nama !== topping.Nama),
        totalHarga:
          this.state.totalHarga - Topp.total_harga_top
      }))
      ;
    }

  }

  updateToppingQuantity = (toppingName, newQuantity, operasi) => {
    try {
      if (newQuantity < 1) return;

      this.setState(prevState => {
        const updatedToppings = prevState.selectedToppings.map(item =>
          item.topping.Nama === toppingName
            ? {
                ...item,
                jumlah_top: newQuantity,
                total_harga_top: newQuantity * item.topping.Harga
              }
            : item
        );

        // // Hitung total harga dari semua topping
        // const totalToppingPrice = updatedToppings.reduce((total, item) => {
        //   return this.state.totalHarga + item.total_harga_top;
        // }, 0);

        // return {
        //   selectedToppings: updatedToppings,
        //   totalHarga:  totalToppingPrice // atau tambahkan harga dasar jika ada
        // };
        const updatedTopping = updatedToppings.find(item => item.topping.Nama === toppingName);
        // if (updatedTopping) {
        //   alert(`Harga topping: ${updatedTopping.topping.harga}`);
        //   // atau
        //   alert(JSON.stringify(updatedTopping.topping.harga));
        // }
        let updatedtotal;
        switch(operasi) {
            case '+':
              updatedtotal = this.state.totalHarga + updatedTopping.topping.Harga;
              break;
            case '-':
              updatedtotal = this.state.totalHarga - updatedTopping.topping.Harga
              break;
            default:
              updatedtotal = this.state.totalHarga;
          }

        // alert(JSON.stringify(updatedToppings))
        return {
        selectedToppings: updatedToppings,
        totalHarga: updatedtotal
        };

      });
    } catch (error) {
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  }

  handleShow = (menuKeranjang) => {
    // alert(JSON.stringify(menuKeranjang))
    this.setState({
      showModal: true,
      keranjangDetail: menuKeranjang,
      jumlah: menuKeranjang.jumlah,
      keterangan: menuKeranjang.keterangan,
      totalHarga: menuKeranjang.total_harga,
      selectedToppings: menuKeranjang.toppings ? menuKeranjang.toppings : [] //erna_
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false
    });
  };

  tambah = () => {
    const totaltopping = this.state.selectedToppings.reduce(function (result, item) {
          return result + item.total_harga_top;
      }, 0);
      // alert(totaltopping)
    this.setState({
      jumlah: this.state.jumlah + 1,
      totalHarga:
        // this.state.keranjangDetail.product.harga * (this.state.jumlah + 1),
        this.state.keranjangDetail.product.Harga * (this.state.jumlah + 1) + totaltopping
    });
  };
  kurang = () => {
    const totaltopping = this.state.selectedToppings.reduce(function (result, item) {
          return result + item.total_harga_top;
      }, 0);
      // alert(totaltopping)
    if (this.state.jumlah !== 1) {
      this.setState({
        jumlah: this.state.jumlah - 1,
        totalHarga:
          // this.state.keranjangDetail.product.harga * (this.state.jumlah - 1),
          this.state.keranjangDetail.product.Harga * (this.state.jumlah - 1) + totaltopping
        });
    }
  };

  changeHandler = (event) => {
    this.setState({
      keterangan: event.target.value,
    });
  };

  handleSubmit = (event) => {
    // event.preventDefault(); //biar gk ke reload
    // Hentikan event bubbling
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.handleClose();

    const data = {
      jumlah: this.state.jumlah,
      total_harga: this.state.totalHarga,
      product: this.state.keranjangDetail.product,
      keterangan: this.state.keterangan,
      toppings : this.state.selectedToppings //diganti ke selectedToppings
    };

    // alert("data di state")
    // alert(JSON.stringify(this.state))

    // alert("to update and save to localstorage")
    // alert(JSON.stringify(data))

    //DELETE EXISTING DATA
    const mykeranjang = JSON.parse(localStorage.getItem('keranjang') || '[]');
    const indexToDelete = mykeranjang.findIndex(item => item.product.MenuID === data.product.MenuID);
    mykeranjang.splice(indexToDelete, 1);
    localStorage.setItem('keranjang', JSON.stringify(mykeranjang));

    //ADD
    // Ambil data existing dari localStorage
    const existingCart = JSON.parse(localStorage.getItem('keranjang')) || [];
    // Tambah data baru
    existingCart.push(data);
    // Simpan kembali ke localStorage
    localStorage.setItem('keranjang', JSON.stringify(existingCart));

    this.props.getListKeranjang(); // Panggil fungsi untuk update data    
    
  };

  hapusPesanan = (productId,event) => {
    // Hentikan event bubbling
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    // 
    const keranjang = JSON.parse(localStorage.getItem('keranjang') || '[]');

    // Cari index item berdasarkan product ID
    const index = keranjang.findIndex(item => item.product.MenuID === productId);

    if (index !== -1) {
      keranjang.splice(index, 1);
      localStorage.setItem('keranjang', JSON.stringify(keranjang));
      // alert(`Item dengan ID ${productId} berhasil dihapus`);      
      if (this.props.getListKeranjang) {
        this.props.getListKeranjang(); // Panggil fungsi untuk update data      
      }

    } else {
      alert('Item tidak ditemukan');
    }
  };

  handleNamaPemesanChange = (e) => {
    this.setState({
      namapemesan: e.target.value
      // namapemesan : JSON.stringify({
      //           pemesan: "test1",
      //           total_bayar: 25000,
      //           menus: this.props.keranjangs
      //       })
    })
  };

  render() {
    const { keranjangs } = this.props;
    const { namapemesan } = this.state;

    return (
      <Col md={5} className='mt-3'>
        <div style={{backgroundColor: 'orange', padding: '10px'}}>
        <h5>
            <h4 onClick={() => { this.props.getListOrder()  }} 
                size="lg"
                style={{
                    backgroundColor: '#FFD700',
                    border: 'none',
                    color: '#523a3a',
                    fontWeight: '800',
                    fontSize: '1rem',
                    padding: '12px 28px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                    transition: 'all 0.3s ease',
                    // textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    cursor: 'pointer'
                }}
            >
                (KLik Disini) Cek Antrian Pesanan 
            </h4> 
          {/* <strong>----FORM ORDER----- </strong> */}  
          <p></p>
          <strong>Atas nama :
            <input required value={namapemesan} onChange={this.handleNamaPemesanChange} placeholder="Masukkan nama panggilan"  style={{ width: '8.5cm' }}></input>
            </strong> </h5>
        </div>
        <hr />
        {/* {alert(JSON.stringify(keranjangs))}  */}
        {keranjangs.length !== 0 && (
          // <Card className="overflow-auto hasil">
            <ListGroup variant="flush">
              {keranjangs.map((menuKeranjang) => (
                <ListGroup.Item
                  as="li"
                  key={menuKeranjang.product.MenuID}
                  onClick={() => {this.handleShow(menuKeranjang)}}
                >
                  <Row style={{backgroundColor: 'lightgrey', padding: '10px'}}>
                    <Col xs="1">
                      <h5>
                        <Badge pill variant="success">
                          {menuKeranjang.jumlah}
                        </Badge>
                      </h5>
                    </Col>
                    <Col>
                      <h5>{menuKeranjang.product.Nama}</h5>
                      <p>Rp. {numberWithCommas(menuKeranjang.product.Harga)}</p>
      
                      {/* {menuKeranjang.toppings.map((item, index) => (
                        <p key={index}> 
                           ( {item.jumlah_top} ) {item.topping.nama} 
                        </p>erna_
                      ))} */}
                      {menuKeranjang.toppings && menuKeranjang.toppings.map((item, index) => (
                        <p key={index}> 
                          ( {item.jumlah_top} ) {item.topping.Nama} 
                        </p>
                      ))}
                    </Col>

                    <Col xs="2">
                      <p>Rp. {numberWithCommas(menuKeranjang.total_harga)}</p>
                    </Col>
                    <Col xs="2">
                      <h5>
                        <button onClick={(e) => {this.hapusPesanan(menuKeranjang.product.MenuID, e);}}>
                          Hapus
                        </button>
                      </h5>
                    </Col>
                  </Row>

                  <Row style={{backgroundColor: 'lightgrey'}}>
                    <Col xs="1">
                    </Col>
                    <Col>
                      {menuKeranjang.keterangan !== undefined ? (
                        <p>Catatan : {menuKeranjang.keterangan}</p>
                      ) : null}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}

              <ModalKeranjang
                handleClose={this.handleClose}
                {...this.state}
                tambah={this.tambah}
                kurang={this.kurang}
                changeHandler={this.changeHandler}
                handleSubmit={this.handleSubmit}
                hapusPesanan={this.hapusPesanan}
                handleToppingChange={this.handleToppingChange}
                updateToppingQuantity={this.updateToppingQuantity}
              />
            </ListGroup>
          // </Card>
        )}
        {/* <TotalBayar keranjangs={keranjangs} {...this.props} /> */}
        <TotalBayar
          keranjangs={keranjangs} {...this.props}
          namapemesan={this.state.namapemesan}
        />
        {/* <TotalBayar keranjangs={keranjangs} pemesan={namapemesan} {...this.props} {...this.state} /> */}
        {/* <TotalBayar
          keranjangs={this.props.keranjangs}
          pemesan={this.state.namapemesan}
        /> */}
      </Col>
      
    );
  }
}
