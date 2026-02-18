// import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Form, Modal, Col, Row  } from 'react-bootstrap'
// import { Button, Form, Modal,Badge, Card, Col, ListGroup, Row  } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils'
import { useState, useEffect, useContext  } from 'react'
import axios from 'axios';
import { AuthContext } from '../authentication/AuthContext';

const ModalClose = ({
    showModal,
    orderTrans,
    handleClose,
    handleSubmit
}) => {
    const auth = useContext(AuthContext);
    const [Verify, setVerify] = useState('');
    // const handleVerifyChange = (e) => {
    //     setVerify(e.target.value);
    // };
    
    // State untuk menyimpan nilai nominal dan status checkbox
    const [nominalcash, setNominalCash] = useState(0)
    const [nominalqris, setNominalQRIS] = useState(0)
    const [useCash, setUseCash] = useState(false)
    const [useQRIS, setUseQRIS] = useState(false)

    // Reset state ketika orderTrans berubah
    useEffect(() => {
        if (orderTrans) {
            setNominalCash(0)
            setNominalQRIS(0)
            setUseCash(false)
            setUseQRIS(false)
        }
    }, [orderTrans])

    //Perhitungan uang
    const uangDibayar = parseFloat(nominalcash || 0) + parseFloat(nominalqris || 0);
    const totalBayar = parseFloat(orderTrans.Total_bayar || 0);
    const selisihuang = totalBayar - uangDibayar;

    const handleCheckboxCash = (e) => {
        const isChecked = e.target.checked
        setUseCash(isChecked)
        if (isChecked) {
            // setUseQRIS(false)
            // setNominalQRIS('')
        }
        else{
            setNominalCash(0)
        }
    }

    const handleCheckboxQRIS = (e) => {
        const isChecked = e.target.checked
        setUseQRIS(isChecked)
        if (isChecked) {
            // setUseCash(false)
            // setNominalCash('')
        }
        else {
            setNominalQRIS(0)
        }
    }
    
     const handleNominal = (nominal) => {
        if (useCash) {
            setNominalCash(nominal)
        }
        if (useQRIS) {
            setNominalQRIS(nominal)
        }
    }

    const SubmitOrderServe = () => {
        const username = auth.user.username;
        const dataordertrans = {
            id: orderTrans.id,
            Tglclose: new Date().toISOString(),
            Status_serve: true,
            Modify_by: username
        };
        const url = "https://web-production-80a65.up.railway.app/ordertransaksi";
        axios
        .put(url, dataordertrans)
        .then((res) => {
            // alert("Update berhasil:", res.data);
            // this.props.history.push('/sukses'); erna12345
            // handleClose();
            handleSubmit();
        })
        .catch((error) => {
            console.error("Error:", error.response?.data || error.message);
        });
    };

    const SubmitTransaksi = () => {
        if (selisihuang > 0) {
            alert("Uang tidak boleh kurang!");
            return; // Berhenti di sini, tidak lanjut ke verifikasi
        }
            const url = "https://web-production-80a65.up.railway.app/getverify";
            axios.post(url, { password: Verify })
                .then(res => {
                    if (res.data.verify === true) {
                        SaveTransaksi();
                        // alert("lanjut savee")
                    } else {
                        alert(res.data.message || "Password salah!");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Terjadi kesalahan: " + (error.response?.data?.message || error.message));
                });
    }

    const SaveTransaksi = () => {
        if (selisihuang > 0) {
            alert("Pastikan Total Dibayarkan sesuai!");
            return; // Berhenti di sini, tidak lanjut ke verifikasi
        }
            const username = auth.user.username;
            const dataordertrans = {
                id: orderTrans.id,
                Tglclose: new Date().toISOString(),
                Pembayaranqris: nominalqris,
                Pembayarancash: parseFloat(uangDibayar) - parseFloat(nominalqris) + parseFloat(selisihuang),
                Total_bayar: totalBayar,
                Status_paid: true,
                Modify_by: username
            };
            // alert("Pembayaranqris:" + nominalqris);
            // alert("Pembayarancash:" + (parseFloat(uangDibayar) - parseFloat(nominalqris) + parseFloat(selisihuang)));
            // alert("Total_bayar:" + totalBayar)
            
            const url = "https://web-production-80a65.up.railway.app/ordertransaksi";
            axios
            .put(url, dataordertrans)
            .then((res) => {
                // alert("Update berhasil:", res.data);
                // this.props.history.push('/sukses');
                //  handleClose(orderTrans.id)
                handleSubmit();
            })
            .catch((error) => {
                console.error("Error:", error.response?.data || error.message);
            });

            // // Reset form setelah submit
            // setNominalCash(0)
            // setNominalQRIS(0)
            // setUseCash(false)
            // setUseQRIS(false)
            // handleClose()
    }

    if (orderTrans) {
         return (
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            Atas nama : <strong>{orderTrans.Pemesan}</strong>   Antrian : <strong>{orderTrans.No_antri.substring(orderTrans.No_antri.indexOf('_') + 1)}</strong>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                {/* <Form onSubmit={handleSubmit}> */}
                    <Modal.Body style={{ padding: '20px' }}>
                    {/* Tombol Pesanan Siap */}
                    <Row className="mb-4">
                        <Col>
                            <Button
                                onClick={() => {
                                    const isConfirmed = window.confirm("Apakah Anda yakin pesanan sudah disiapkan?");
                                    if (isConfirmed) {
                                        SubmitOrderServe();
                                    }
                                }} 
                                variant="outline-primary"
                                size="lg"
                                className="w-100 py-3"
                                disabled={orderTrans.Status_serve === true}
                            >
                                <h5 className="mb-0"><b>✓ Pesanan sudah disiapkan </b></h5>
                            </Button>
                        </Col>
                    </Row>

                   

                    {/* Section Pembayaran */}
                    <Row className="mb-3">
                        <Col xs={12}>
                            <h4 className="mb-3">
                                <strong>PEMBAYARAN</strong>
                            </h4>
                        </Col>

                    {/* Total Pembayaran */}
                        <Col xs={12}>
                            <h5 className="mb-3">
                                <strong>Total :</strong>
                            </h5>
                        </Col>
                        <Col xs={12}>
                            <Button 
                                variant="outline-success"
                                className="d-flex align-items-center justify-content-between p-3"
                                style={{ 
                                    width: '100%',
                                    border: '1px solid #333',
                                    borderRadius: '1px',
                                    fontSize: '26px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { handleNominal(orderTrans.Total_bayar) }}
                                disabled={useQRIS === false && useCash === false}
                            >
                                <span>Rp.</span>
                                <span>{numberWithCommas(orderTrans.Total_bayar)}</span>
                            </Button>
                        </Col>
                    </Row>
                    
                    {/* QRIS Payment */}
                    <Row className="align-items-center mb-4">
                        <Col xs={5} md={3}>
                            <div className="d-flex align-items-center">
                                <h5 className="mb-0 me-3">QRIS</h5>
                                <input
                                    type="checkbox"
                                    id="cbqris"
                                    checked={useQRIS}
                                    onChange={handleCheckboxQRIS}
                                    style={{ 
                                        transform: 'scale(3.5)',
                                        transformOrigin: 'center',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </Col>
                        <Col xs={6} md={8}>
                            <input
                                required
                                id="inputqris"
                                value={nominalqris}
                                placeholder='Input nominal qris'
                                onChange={(e) => setNominalQRIS(e.target.value)}
                                className="form-control form-control-lg"
                                style={{ 
                                    width: '100%',
                                    fontSize: '18px',
                                    textAlign: 'right'
                                }}
                                disabled={!useQRIS}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        </Col>
                    </Row>

                    {/* Cash Payment */}
                    <Row className="align-items-center mb-3">
                        <Col xs={5} md={3}>
                            <div className="d-flex align-items-center">
                                <h5 className="mb-0 me-3">Cash</h5>
                                <input
                                    type="checkbox"
                                    id="cbcash"
                                    checked={useCash}
                                    onChange={handleCheckboxCash}
                                    style={{ 
                                        transform: 'scale(3.5)',
                                        transformOrigin: 'center',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        </Col>
                        {/* <Col xs={2}></Col> */}
                        {/* <Col xs={2}></Col> */}
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 1000)) }}
                                disabled={!useCash}
                            >
                                1K
                            </Button>
                        </Col>
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 2000)) }}
                                disabled={!useCash}
                            >
                                2K
                            </Button>
                        </Col>
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 5000)) }}
                                disabled={!useCash}
                            >
                                5K
                            </Button>
                        </Col>
                        <Col xs={4}></Col>
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 10000)) }}
                                disabled={!useCash}
                            >
                                10K
                            </Button>
                        </Col>
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 20000)) }}
                                disabled={!useCash}
                            >
                                20k
                            </Button>
                        </Col>
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 50000)) }}
                                disabled={!useCash}
                            >
                                50K
                            </Button>
                        </Col>
                        <Col xs={2}>
                            <Button 
                                variant="outline-success"
                                className="py-2"
                                style={{ 
                                    width: '100%',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => { setNominalCash(parseFloat(nominalcash + 100000)) }}
                                disabled={!useCash}
                            >
                                100K
                            </Button>
                        </Col> 
                    </Row>

                    {/* Total Uang Dibayarkan */}
                    <Row className="mt-4 pt-3 border-top">
                        <Col xs={12}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Total Dibayarkan:</h5>
                                <h2 
                                    className="mb-0 text-primary"
                                    style={{ 
                                        fontSize: '30px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Rp. {numberWithCommas(uangDibayar)}
                                </h2>
                            </div>
                        </Col>
                        {/* Total Selisih */}
                        <Col xs={12}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0"></h5>
                                <h2 
                                    className="mb-0 text-primary"
                                    style={{ 
                                        fontSize: '21px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ({numberWithCommas(selisihuang)})
                                </h2>
                            </div>
                        </Col>

                        <p></p>                   
                        {useQRIS && (
                            <Col xs={7} >
                                <div className="d-flex justify-content-start">
                                    <h5 className="mb-0"></h5>
                                    <h2 
                                        className="mb-0 text-secondary"
                                        style={{ 
                                            fontSize: '15px',
                                        }}
                                    >
                                        Total Qris: {nominalqris}
                                    </h2>
                                </div>                            
                            </Col>
                        )}

                         {useCash && (
                            <Col xs={7} >
                                <div className="d-flex justify-content-start">
                                    <h5 className="mb-0"></h5>
                                    <h2 
                                        className="mb-0 text-secondary"
                                        style={{ 
                                            fontSize: '15px',
                                        }}
                                    >
                                        Total Cash: {parseFloat(uangDibayar) + parseFloat(selisihuang) - parseFloat(nominalqris)}
                                    </h2>
                                </div>                            
                            </Col>
                        )}

                            {/* <input
                                required
                                id="inputcash"
                                value={nominalcash}
                                readOnly="true"
                                // onChange={(e) => { setNominalCash(e.target.value); }}
                                className="form-control form-control-lg"
                                style={{ 
                                    width: '100%',
                                    fontSize: '18px',
                                    textAlign: 'right'
                                }}
                                disabled={!useCash}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            /> */}
                            
                            <p></p><p></p>
                            
                                {/* <input required value={Verify} onChange={(e) => setVerify(e.target.value)}  type="password" style={{ fontSize: '20px', }} placeholder="Isi password verifikasi"></input> */}
                            {/* <Button variant="outline-primary" onClick={() => {SubmitTransaksi()}} ><h5><b> Submit Transaksi </b></h5></Button> */}
                            <Button variant="outline-primary" 
                                onClick={() => {
                                    const isConfirmed = window.confirm("Apakah pelanggan akan melakukan pembayaran?");
                                    if (isConfirmed) {
                                        SaveTransaksi();
                                    }
                                }}
                                disabled={orderTrans.Status_paid === true}
                            ><h5><b> Submit Transaksi </b></h5></Button>
                                                        
                    </Row>
                </Modal.Body>
            {/* </Form> */}
            </Modal>
         )
    } else {
        return (
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Kosong</Modal.Title>
                </Modal.Header>
                <Modal.Body>Belum Ada Data</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ModalClose
