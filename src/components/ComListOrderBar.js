import axios from "axios";
import { Component, useContext } from "react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { numberWithCommas } from "../utils/utils";
import { API_URL } from '../utils/constants';
import withAuth from '../authentication/withAuth';
import ModalClose from './ModalClose';

class ComListOrderBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      orderTrans: false,
      antrian: [],
      ordermenu: [],
      ordertopping: [],
      ordertransaksi: [],
    };
  }

    componentDidMount() {
    this.getDataNoAntri();
  }

  getDataNoAntri = () => {
    // const auth = useContext(AuthContext);
    const { auth } = this.props; // Auth tersedia di props dari HOC
    const namastand = auth.user.first_name;
    const paramdata = {
        nama_stand: namastand
    };
    axios
      .post(API_URL + "/antrian", paramdata)
      .then((res) => {
        this.setState({
          antrian: res.data,
        });
        this.getDataorder();
      })
      .catch((error) => {
          console.error("Error:", error.response?.data || error.message);
          alert(error.message)
      });
   }

   
  getDataorder = () => {
    // {selectedToppings.some(item => item.topping.nama === topp.nama)} ERNA_REMEMBERING
    const { auth } = this.props; // Auth tersedia di props dari HOC
    const namastand = auth.user.first_name;
    axios
      .get(API_URL + "/ordermenu/" + namastand)
      .then(res => {
        // console.log("Response: ", res);
        // alert("ordermenu hihalo")
        // thedata.map(function(item){
        //     // alert(item.No_antri)
        // })
        this.setState({
          ordermenu: res.data
        });
      })
    axios
      .get(API_URL + "/ordertopping/" + namastand)
      .then(res => {
        // console.log("Response: ", res);
        // alert("ordertopping halo")
        // thedata.map(function(item){
        //     // alert(item.No_antri)
        // })
        this.setState({
          ordertopping: res.data
        });
      })
      axios
      .get(API_URL + "/ordertransaksi/" + namastand)
      .then(res => {
        // console.log("Response: ", res);
        // alert("ordertransaksi holaa")
        // thedata.map(function(item){
        //     // alert(item.No_antri)
        // })
        this.setState({
          ordertransaksi: res.data
        });        
      })
      .catch(error => {
        console.log("Error YA");
      });
  }

  joinData = (ordermenu, ordertopping, ordertransaksi) => {
    const result = [];
    
    // Group ordermenu by No_antri
    const menuByAntri = {};
    ordermenu.forEach(menu => {
      if (!menuByAntri[menu.No_antri]) {
        menuByAntri[menu.No_antri] = [];
      }
      menuByAntri[menu.No_antri].push(menu);
    });
    
    // Group ordertopping by No_antri and Pesanan
    const toppingByAntriPesanan = {};
    ordertopping.forEach(topping => {
      const key = `${topping.No_antri}_${topping.Pesanan}`;
      if (!toppingByAntriPesanan[key]) {
        toppingByAntriPesanan[key] = [];
      }
      toppingByAntriPesanan[key].push(topping);
    });
    
    // Create final joined data
    ordertransaksi.forEach(transaksi => {
      const detailPesanan = (menuByAntri[transaksi.No_antri] || []).map(menu => {
        const key = `${menu.No_antri}_${menu.Pesanan}`;
        return {
          id_menu: menu.id,
          Pesanan: menu.Pesanan,
          Jumlah_pesn: menu.Jumlah_pesn,
          Total_harga_top: menu.Total_harga_top,
          Total_harga: menu.Total_harga,
          Catatan: menu.Catatan,
          Topping: toppingByAntriPesanan[key] || []
        };
      });
      
      result.push({
        id_trans: transaksi.id,
        No_antri: transaksi.No_antri,
        Tglorder: transaksi.Tglorder,
        Tglclose: transaksi.Tglclose,
        Pemesan: transaksi.Pemesan,
        Pembayaranqris: transaksi.Pembayaranqris,
        Pembayarancash: transaksi.Pembayarancash,
        Total_bayar: transaksi.Total_bayar,
        Status_paid: transaksi.Status_paid,
        Status_serve: transaksi.Status_serve,
        Detail_Pesanan: detailPesanan
      });
    });
    // alert(JSON.stringify({result}))
    
    return result;
  }

  handleShow = (itemtrans) => {
    // alert(JSON.stringify(item))
    this.setState({
      showModal: true,
      orderTrans: itemtrans,
      // jumlah: menuKeranjang.jumlah,
      // keterangan: menuKeranjang.keterangan,
      // totalHarga: menuKeranjang.total_harga,
      // selectedToppings: menuKeranjang.toppings ? menuKeranjang.toppings : [] //erna_
    });
  };

  handleClose = () => {
    this.setState({
      showModal: false
    });
  };

  handleSubmit = (event) => {
    // event.preventDefault(); //biar gk ke reload //jika gunakan <Form onSubmit={handleSubmit}> ,<BUtton type="submit".. 
    this.getDataNoAntri();
  };
  


  render() {
    const { antrian, ordermenu, ordertopping, ordertransaksi } = this.state;
    const orderdataJoin = this.joinData(ordermenu, ordertopping, ordertransaksi);
    const { auth } = this.props; // Auth tersedia di props dari HOC

    return (
      <Col md={5} className='mt-3'>
        <div style={{backgroundColor: 'orange', padding: '10px'}}>
        <h5>
              <h4 onClick={() => { this.props.getNewOrder()  }}   
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
                (Klik Disini) Buat Pesanan Baru
            </h4> 

            {/* <strong>----LIST ORDER----- </strong> <p></p> */}
            <strong>
            </strong>
        </h5>
        </div>
        <hr />

        {/* HERES CHANGING */}
        {ordertransaksi.length !== 0 && (
          // <Card className="overflow-auto hasil" style={{ maxHeight: '1500px' }}>
            <ListGroup variant="flush">
              {ordertransaksi && ordertransaksi.map((itemtrans) => (
                <ListGroup.Item
                  as="li"
                  key={itemtrans.id}
                  onClick={() => {this.handleShow(itemtrans)}}
                >
                  {/* {JSON.stringify(itemtrans)} */}
                  {/* {(itemtrans.Pesanan)} */}
                  
                  <Row style={{backgroundColor: 'lightgrey', padding: '1px'}}>
                    <Col xs="2">
                      <h5>
                        <Badge pill variant="success">
                          {itemtrans.No_antri.substring(itemtrans.No_antri.indexOf('_') + 1)}
                        </Badge>
                      </h5>
                    </Col>
                  {/* </Row>
                  
                  <Row style={{backgroundColor: 'lightgrey', padding: '1px'}}> */}
                    <Col xs="5">
                      <h5>
                        <Badge pill variant="success">
                          {itemtrans.Pemesan}
                        </Badge>
                      </h5>
                    </Col>

                    <Col xs="2">
                      <h5>
                        <Badge pill className={ itemtrans.Status_paid? "badge-success bg-success" : "badge-danger bg-danger" }>
                          {itemtrans.Status_paid ? "Paid" : "Unpaid"}
                        </Badge>
                      </h5>
                    </Col>

                    <Col xs="2">
                      <h5>
                        <Badge pill className={itemtrans.Status_serve ? "badge-success bg-success" : "badge-danger bg-danger" }>
                          {itemtrans.Status_serve ? "Served" : "Preparing"}
                        </Badge>
                      </h5>
                    </Col>

                    <h6><b></b>Total Pembayaran : Rp. {numberWithCommas(itemtrans.Total_bayar)} </h6>
                  </Row>

                  <Row style={{backgroundColor: 'lightgrey', padding: '1px'}}>
                    <Col>                 
                        {ordermenu && ordermenu
                          .filter(itemmenu => 
                            itemmenu.No_antri === itemtrans.No_antri
                          )
                          .map(itemmenu => (
                            <h6 key={itemmenu.id}>
                                <h6><b>{itemmenu.Pesanan}  ( {itemmenu.Jumlah_pesn} ) </b></h6>
                                { ordertopping && ordertopping
                                  .filter(itemtopp => 
                                    itemtopp.No_antri === itemmenu.No_antri && 
                                    itemtopp.Pesanan === itemmenu.Pesanan
                                  )
                                  .map(itemtopp => (
                                    <h6 key={itemtopp.id}> 
                                      ( {itemtopp.Jumlah_top} ) {itemtopp.Topping} 
                                    </h6>
                                  ))}

                                  <Row style={{backgroundColor: 'lightgrey', padding: '2px'}}>
                                  {/* <Col xs="1">
                                  </Col> */}
                                  <Col>
                                    {itemmenu.Catatan !== "" ? (
                                      <p>Catatan : {itemmenu.Catatan}</p>
                                    ) : null}
                                  </Col>
                                </Row>
                            </h6>

                          ))
                        }
                    </Col>
                  </Row>

                </ListGroup.Item>
              ))}

              {/* <AuthContext.Consumer> */}
                {/* {(auth) => ( */}
                  <div>
                  {auth.user && (
                    <div>
                    {auth.user.is_staff === true ? (
                        <ModalClose
                          handleClose={this.handleClose}
                          {...this.state}
                          handleSubmit={this.handleSubmit}
                          // tambah={this.tambah}
                          // kurang={this.kurang}
                          // changeHandler={this.changeHandler}
                          // hapusPesanan={this.hapusPesanan}
                          // handleToppingChange={this.handleToppingChange}
                          // updateToppingQuantity={this.updateToppingQuantity}
                        />
                      ) : <p></p> }
                    </div>
                  )}
                </div>
                {/* )} */}
              {/* </AuthContext.Consumer> */}

            </ListGroup>
          // </Card>
        )}
        {/* HERE CHANGING */}
        
      </Col>
    );
  }
}
export default withAuth(ComListOrderBar);