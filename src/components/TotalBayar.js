import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../authentication/AuthContext';

export default class TotalBayar extends Component {
    static contextType = AuthContext; 
    
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
            
            //SEND TO DB SUPABASE
            const url = "https://web-production-80a65.up.railway.app/saveorder"
            axios
            .post(url,pesanan)// .post(API_URL+"pesanans",pesanan)
            .then((res) =>{
                this.props.history.push('/sukses')
            })
            localStorage.removeItem('keranjang');
        }
    
       
    }

    render() {

        const totalBayar = this.props.keranjangs.reduce(function (result, item) {
            return result + item.total_harga;
        }, 0);

        return (
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
            </>
        )
    }
}
