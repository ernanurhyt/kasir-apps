import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils'

const ModalKeranjang = ({
    showModal,
    handleClose,
    keranjangDetail,
    jumlah,
    keterangan,
    tambah,
    kurang,
    changeHandler,
    handleSubmit,
    totalHarga,
    hapusPesanan,
    menutoppings,
    selectedToppings,
    handleToppingChange,    
    updateToppingQuantity
}) => {
    if (keranjangDetail) {
        return (
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {keranjangDetail.product.Nama} {' '}
                        <strong>
                            (Rp. {numberWithCommas(keranjangDetail.product.Harga)})
                        </strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Total Harga :</Form.Label>
                            <p>
                                <strong>
                                    (Rp. {numberWithCommas(totalHarga)})
                                </strong>
                            </p>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Jumlah :</Form.Label>
                            <p> <Button variant='primary' size='sm' className='ml-2' onClick={kurang}><FontAwesomeIcon icon={faMinus} /></Button>
                                <strong> {jumlah} </strong>
                                <Button variant='primary' size='sm' className='mr-2' onClick={tambah}><FontAwesomeIcon icon={faPlus} /></Button>
                            </p>
                        </Form.Group>
                      
                        <Form.Group className="mb-3" controlId="formToppings">
                            <Form.Label><strong>Pilih Topping:</strong></Form.Label>
                            {menutoppings && menutoppings.length > 0 ? (
                                menutoppings.map((topp, index) => (
                                    <div key={index} className="mb-2 p-2 border rounded">
                                        <Form.Check 
                                            type="checkbox"
                                            id={`topping-${index}`}
                                            label={
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <span>{topp.Nama}</span>
                                                    <span className="text-muted">Rp {topp.Harga.toLocaleString()}</span>
                                                </div>
                                            }
                                            onChange={(e) => handleToppingChange(topp, e.target.checked)}
                                            checked={selectedToppings.some(item => item.topping.Nama === topp.Nama)}
                                        />
                                        
                                        {/* Tampilkan quantity input jika topping dipilih */}
                                        {selectedToppings.some(item => item.topping.Nama === topp.Nama) && (
                                            <div className="mt-2 ms-4">
                                                <Form.Label>Jumlah:</Form.Label>
                                                <div className="d-flex align-items-center">
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentItem = selectedToppings.find(item => item.topping.Nama === topp.Nama);
                                                            updateToppingQuantity(topp.Nama, currentItem.jumlah_top - 1, '-');
                                                        }}
                                                        disabled={selectedToppings.find(item => item.topping.Nama === topp.Nama)?.jumlah_top <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        value={selectedToppings.find(item => item.topping.Nama === topp.Nama)?.jumlah_top || 1}
                                                        onChange={(e) => updateToppingQuantity(topp.Nama, parseInt(e.target.value), '+')}
                                                        className="mx-2"
                                                        style={{width: '80px'}}
                                                    />
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentItem = selectedToppings.find(item => item.topping.Nama === topp.Nama);
                                                            updateToppingQuantity(topp.Nama, currentItem.jumlah_top + 1, '+');
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                        
                                    </div>
                                ))
                            ) : (
                                <div className="text-center w-100">
                                    <p>Tidak ada data topping</p>
                                </div>
                            )}
                        </Form.Group>                        

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Keterangan :</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows='3'
                                name='keterangan'
                                placeholder="tulis catatan disini"
                                value={keterangan}
                                onChange={(event) => changeHandler(event)}
                            />
                            <Form.Text className="text-muted">
                                Sesuaikan seleramu :)
                            </Form.Text>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            OKE
                        </Button>
                    </Form>

                </Modal.Body>
                 {/* 
                <Modal.Footer>
                    <Button variant="danger" onClick={() => hapusPesanan(keranjangDetail.product.MenuID)} >
                        <FontAwesomeIcon icon={faTrash} /> Hapus Pesanan
                    </Button>
                </Modal.Footer>
                */}
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

export default ModalKeranjang


