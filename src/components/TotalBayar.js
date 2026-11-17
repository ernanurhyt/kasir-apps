import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { numberWithCommas } from '../utils/utils';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../authentication/AuthContext';

import StrukModal from './StrukModal';

export default class TotalBayar extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      showStruk: false,
      dataPesanan: null,
    };
  }

  handleShowStruk = (idantri, idformat) => {
    const data = {
      namaToko: 'Dimsum Premium BTMENTAY',
      alamat: 'Jl. SP Plaza Batu Aji',
      namaStand: this.context.user.username || '-',
      noAntrian: idantri || '-',
      formatNoAntrian: idformat || '-',
      namaPemesan: this.props.namapemesan || '-',
      tanggalPemesanan: new Date(),
      pesanan: this.props.keranjangs || [],
      total: this.props.keranjangs.reduce(function (result, item) {
        return result + item.total_harga;
      }, 0),
      penutup: 'Terima kasih telah memesan! Silakan tunggu antrian Anda.',
    };

    this.setState({
      showStruk: true,
      dataPesanan: data,
    });
  };

  handleCloseStruk = () => {
    this.setState({ showStruk: false });
  };

  submitTotalBayar = (totalBayar) => {
    if (this.props.namapemesan === '' || this.props.namapemesan === undefined) {
      alert('Mohon Isi Nama');
      return;
    }

    const { user } = this.context;
    if (!user) {
      alert('User tidak ditemukan');
      return;
    }

    const pesanan = {
      pemesan: this.props.namapemesan,
      total_bayar: totalBayar,
      menus: this.props.keranjangs,
      nama_stand: user.first_name,
      modify_by: user.username,
    };

    const url = 'http://localhost:8000/saveorder';
    console.log(JSON.stringify(pesanan));

    axios
      .post(url, pesanan)
      .then((res) => {
        if (res.data.status === 'success') {
          this.handleShowStruk(res.data.noantri, res.data.format_noantri);
        } else {
          alert('Gagal membuat orderan');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Gagal menghubungi server');
      });

    localStorage.removeItem('keranjang');
  };

  render() {
    const totalBayar = this.props.keranjangs.reduce(function (result, item) {
      return result + item.total_harga;
    }, 0);

    return (
      <>
        {/* web */}
        <div className="fixed-bottom d-none d-md-block">
          <Row>
            <Col md={{ span: 3, offset: 9 }} className="px-4 py-3 d-grid gap-2">
              <h4>
                Total Bayar :{' '}
                <strong className="float-right mr-2">
                  Rp.{numberWithCommas(totalBayar)}
                </strong>
              </h4>
              <Button
                variant="primary"
                onClick={() => this.submitTotalBayar(totalBayar)}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <strong>Buat Pesanan</strong>
              </Button>
            </Col>
          </Row>
        </div>

        {/* mobile */}
        <div className="d-sm-block d-md-none">
          <Row>
            <Col md={{ span: 3, offset: 9 }} className="px-4 py-3 d-grid gap-2">
              <h4>
                Total Harga :{' '}
                <strong className="float-right mr-2">
                  Rp.{numberWithCommas(totalBayar)}
                </strong>
              </h4>
              <Button
                variant="primary"
                onClick={() => this.submitTotalBayar(totalBayar)}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <strong>Buat Pesanan</strong>
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