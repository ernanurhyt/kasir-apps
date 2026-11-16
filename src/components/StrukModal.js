import React from 'react';
import './StrukModal.css';

const StrukModal = ({ showModal, onClose, data }) => {
  if (!showModal) return null;

  // Fungsi untuk format tanggal
  const formatDateTime = (date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(date).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk format rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const strukData = data 
  // || {
  //   namaToko: 'INDOMARET',
  //   alamat: 'Jl. Raya No. 123, Jakarta',
  //   namaStand: 'Stand A',
  //   noAntrian: 1,
  //   formatNoAntrian: '150826_1',
  //   namaPemesan: 'Budi Santoso',
  //   tanggalPemesanan: new Date().toISOString(),
  //   pesanan: [
  //     { nama: 'Indomie Goreng', harga: 3500, jumlah: 2, subtotal: 7000 },
  //     { nama: 'Teh Botol Sosro', harga: 5000, jumlah: 1, subtotal: 5000 },
  //     { nama: 'Roti Tawar', harga: 12000, jumlah: 1, subtotal: 12000 }
  //   ],
  //   total: 24000,
  //   penutup: 'Terima Kasih'
  // }
  ;

  const {
    namaToko,
    alamat,
    namaStand,
    noAntrian,
    formatNoAntrian,
    namaPemesan,
    tanggalPemesanan,
    pesanan,
    total,
    penutup
  } = strukData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="struk-container">
          {/* Header - Nama Toko */}
          <div className="struk-header">
            <h2>{namaToko}</h2>
            <p>{alamat}</p>
            <p>Telp: 021-1234567</p>
           <p>No antri: <span style={{ fontSize: '3em', fontWeight: 'bold' }}>{noAntrian}</span></p>
            <div className="line-dashed"></div>
          </div>

          {/* Info Transaksi */}
          <div className="info-transaksi">
            <div className="info-row">
              <span>No. Antrian</span>
              <span><strong>{formatNoAntrian}</strong></span>
            </div>
            <div className="info-row">
              <span>Kasir</span>
              <span>{namaStand}</span>
            </div>
            <div className="info-row">
              <span>Pemesan</span>
              <span>{namaPemesan}</span>
            </div>
            <div className="info-row">
              <span>Tanggal</span>
              <span>{formatDateTime(tanggalPemesanan)}</span>
            </div>
          </div>

          <div className="line-dashed"></div>

          {/* Daftar Belanja */}
          <div className="belanja-section">
            <div className="belanja-header">
              <span className="col-item">Nama Barang</span>
              <span className="col-qty">Qty</span>
              <span className="col-price">Harga</span>
              <span className="col-subtotal">Total</span>
            </div>
            
            {pesanan.map((item, index) => (
              <div key={index} className="belanja-item">
                <span className="col-item">{item.product.Nama}</span>
                <span className="col-qty">{item.jumlah}</span>
                <span className="col-price">{formatRupiah(item.product.Harga)}</span>
                <span className="col-subtotal">{formatRupiah(item.total_harga)}</span>
              </div>
            ))}
          </div>

          <div className="line-dashed"></div>

          {/* Total */}
          <div className="total-section">
            <div className="total-row">
              <span><strong>TOTAL</strong></span>
              <span><strong>{formatRupiah(total)}</strong></span>
            </div>
            
            <div className="total-row">
              <span>Tunai</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="total-row">
              <span>Kembali</span>
              <span>Rp 0</span>
            </div>
          </div>

          <div className="line-dashed"></div>

          {/* Footer */}
          <div className="footer-struk">
            <p>{penutup}</p>
            <p>Harap cek kembali orderan sebelum meninggalkan stand</p>
            <p className="small">Selamat Menikmati😊 </p>
            {/* <p className="small">www.indomaret.co.id</p> */}
            
            <div className="button-group">
              <button onClick={() => window.print()} className="btn-print">
                🖨️ Cetak
              </button>
              <button onClick={onClose} className="btn-close">
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrukModal;