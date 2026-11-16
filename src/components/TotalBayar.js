import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../authentication/AuthContext';

import StrukModal from './StrukModal';

export default class TotalBayar extends Component {
    static contextType = AuthContext; // add
  constructor(props) {
    super(props);
    this.state = {
      showStruk: false,
      dataPesanan: null
    };
  }

    handleShowStruk = (idantri, idformat) => {
        // Data dari state atau props
        const data = {
        namaToko: 'Dimsum Premium BTMENTAY',
        alamat: 'Jl. SP Plaza Batu Aji',
        namaStand: this.context.user.username || '-', //OK
        noAntrian: idantri || '-',
        formatNoAntrian: idformat || '-',
        namaPemesan: this.props.namapemesan || '-', 
        tanggalPemesanan: new Date(),
        pesanan: this.props.keranjangs|| [], 
        total: this.props.keranjangs.reduce(function (result, item) {
            return result + item.total_harga;
            }, 0), //totalBayar
        penutup: 'Terima kasih telah memesan! Silakan tunggu antrian Anda.'   
        };

        this.setState({
        showStruk: true,
        dataPesanan: data
        });
    };

    handleCloseStruk = () => {
        this.setState({ showStruk: false });
    };


    submitTotalBayar = (totalBayar) => {
    var pesanan = {}
        if (this.props.namapemesan === "" || this.props.namapemesan === undefined){
        alert("Mohon Isi Nama")
    } else {
        const { user } = this.context;
        if (user) {
            // alert(`stand: ${user.first_name}`);
            pesanan = {
                pemesan: this.props.namapemesan,
                total_bayar: totalBayar,
                menus: this.props.keranjangs,
                nama_stand: user.first_name,
                modify_by: user.username
            }
        } else {
            alert("User tidak ditemukan");
        }
        // alert("save the order")
        // this.props.history.push('/sukses')
        //SEND TO DB SUPABASE
        const url = "http://localhost:8000/saveorder"
        // alert(JSON.stringify(pesanan))
        console.log(JSON.stringify(pesanan))
        axios
        .post(url,pesanan)// .post(API_URL+"pesanans",pesanan)
        .then((res) =>{            
            // alert(res.data.format_noantri)
            if (res.data.status === 'success') {
                // this.props.history.push('/sukses')
                this.handleShowStruk(res.data.noantri, res.data.format_noantri)
            } else {
                alert("Gagal membuat orderan");
            }
        })
        localStorage.removeItem('keranjang');
    }

    }

  render() {
    const { user } = this.context;
    const totalBayar = this.props.keranjangs.reduce(function (result, item) {
            return result + item.total_harga;
        }, 0);
    return (
    //   <div>
    //     <button onClick={this.handleShowStruk}>
    //      Lihat Struk         
    //     </button>
    //     {/* {JSON.stringify(this.props.keranjangs[0].product.Nama)} */}
    //     <StrukModal
    //       showModal={this.state.showStruk}
    //       onClose={this.handleCloseStruk}
    //       data={this.state.dataPesanan}
    //     />
    //   </div>
        <>
        {/* web */}
        <div className='fixed-bottom d-none d-md-block' >
            <Row>
                <Col md={{ span: 3, offset: 9 }} className='px-4 py-3 d-grid gap-2'>
                    <h4>Total Bayar : <strong className='float-right mr-2' >Rp.{numberWithCommas(totalBayar)}</strong></h4>
                    <Button
                    variant='primary'
                    onClick={() => this.submitTotalBayar(totalBayar)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} /><strong>Buat Pesanan</strong>
                    </Button>

                    
                </Col>
            </Row>

        </div>

        {/* mobile */}
        <div className='d-sm-block d-md-none'>
            <Row>
                <Col md={{ span: 3, offset: 9 }} className='px-4 py-3 d-grid gap-2'>
                    <h4>Total Harga : <strong className='float-right mr-2' >Rp.{numberWithCommas(totalBayar)}</strong></h4>
                    <Button
                    variant='primary'
                    onClick={() => this.submitTotalBayar(totalBayar)}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} /><strong>Buat Pesanan</strong>
                    </Button>
                </Col>
            </Row>
        </div>

        <StrukModal
            showModal={this.state.showStruk}
            onClose={this.handleCloseStruk}
            data={this.state.dataPesanan}
        />
        </>

    );
  }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React, { Component } from 'react'
// import { Button, Col, Row } from 'react-bootstrap'
// import { numberWithCommas } from '../utils/utils';
// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
// import { AuthContext } from '../authentication/AuthContext';
// import ModalStruk from './StrukModal';


// export default class TotalBayar extends Component {
//     static contextType = AuthContext;

//     submitTotalBayar = (totalBayar) => {
//         var pesanan = {}
//          if (this.props.namapemesan === "" || this.props.namapemesan === undefined){
//             alert("Mohon Isi Nama")
//         } else {
//             const { user } = this.context;
//             if (user) {
//                 // alert(`stand: ${user.first_name}`);
//                 pesanan = {
//                     pemesan: this.props.namapemesan,
//                     total_bayar: totalBayar,
//                     menus: this.props.keranjangs,
//                     nama_stand: user.first_name,
//                     modify_by: user.username
//                 }
//             } else {
//                 alert("User tidak ditemukan");
//             }
//             alert("save the order")
//             // //SEND TO DB SUPABASE
//             // const url = "http://localhost:8000/saveorder"
//             // // alert(JSON.stringify(pesanan))
//             // console.log(JSON.stringify(pesanan))
//             // axios
//             // .post(url,pesanan)// .post(API_URL+"pesanans",pesanan)
//             // .then((res) =>{
//             //     // this.props.history.push('/sukses')
//             //     //  this.props.history.push('/uistruk')
//             // })
//             // localStorage.removeItem('keranjang');
//         }

//     }

//     render() {
//         const totalBayar = this.props.keranjangs.reduce(function (result, item) {
//             return result + item.total_harga;
//         }, 0);

//         return (
//             <>
//             {/* web */}
//             <div className='fixed-bottom d-none d-md-block' >
//                 <Row>
//                     <Col md={{ span: 3, offset: 9 }} className='px-4 py-3 d-grid gap-2'>
//                         <h4>Total Bayar : <strong className='float-right mr-2' >Rp.{numberWithCommas(totalBayar)}</strong></h4>
//                         <Button
//                         variant='primary'
//                         onClick={() => this.submitTotalBayar(totalBayar)}
//                         >
//                             <FontAwesomeIcon icon={faShoppingCart} /><strong>Buat Pesanan</strong>
//                         </Button>

//                          <ModalStruk
//                             showModal={true}
//                             // onClose={this.}
//                             // data={this.pesanan}

//                             // handleClose={this.handleClose}
//                             // {...this.state}
//                             // tambah={this.tambah}
//                             // kurang={this.kurang}
//                             // changeHandler={this.changeHandler}
//                             // handleSubmit={this.handleSubmit}
//                             // hapusPesanan={this.hapusPesanan}
//                             // handleToppingChange={this.handleToppingChange}
//                             // updateToppingQuantity={this.updateToppingQuantity}
//                          />
//                     </Col>
//                 </Row>

//             </div>

//             {/* mobile */}
//             <div className='d-sm-block d-md-none'>
//                 <Row>
//                     <Col md={{ span: 3, offset: 9 }} className='px-4 py-3 d-grid gap-2'>
//                         <h4>Total Harga : <strong className='float-right mr-2' >Rp.{numberWithCommas(totalBayar)}</strong></h4>
//                         <Button
//                         variant='primary'
//                         onClick={() => this.submitTotalBayar(totalBayar)}
//                         >
//                             <FontAwesomeIcon icon={faShoppingCart} /><strong>Buat Pesanan</strong>
//                         </Button>
//                     </Col>
//                 </Row>
//             </div>
//             </>
//         )
//     }
// }
