import React from 'react';
import './StrukModal.css';
import { QumraWebUsbPrinter } from '@qumra/webusb';

// Instance printer dibuat sekali di luar komponen
const printer = new QumraWebUsbPrinter();

const StrukModal = ({ showModal, onClose, data }) => {
  if (!showModal) return null;

  // Fungsi format tanggal
  const formatDateTime = (date) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return new Date(date).toLocaleDateString('id-ID', options);
  };

  // Fungsi format rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const strukData = data;

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
    penutup,
  } = strukData;

  // ===== FUNGSI CETAK VIA WEBUSB =====
  const handleWebUSBPrint = async () => {
    try {
      // Hubungkan ke printer (harus dipicu klik pengguna)
      await printer.connect();

      // Lebar kertas 58mm ≈ 32 karakter
      const LINE_WIDTH = 32;
      const center = (text) => {
        const t = String(text || '');
        if (t.length >= LINE_WIDTH) return t.substring(0, LINE_WIDTH);
        const pad = Math.floor((LINE_WIDTH - t.length) / 2);
        return ' '.repeat(pad > 0 ? pad : 0) + t;
      };
      const leftRight = (left, right) => {
        const l = String(left || '');
        const r = String(right || '');
        const space = LINE_WIDTH - l.length - r.length;
        return l + ' '.repeat(space > 0 ? space : 1) + r;
      };
      const line = '-'.repeat(LINE_WIDTH) + '\n';

      let receipt = '';
      receipt += center(namaToko) + '\n';
      receipt += center(alamat) + '\n';
      receipt += center('Telp: 021-1234567') + '\n';
      receipt += '\n';
      receipt += center(`No Antrian: ${noAntrian}`) + '\n';
      receipt += line;
      receipt += `No. Antrian : ${formatNoAntrian}\n`;
      receipt += `Kasir       : ${namaStand}\n`;
      receipt += `Pemesan     : ${namaPemesan}\n`;
      receipt += `Tanggal     : ${formatDateTime(tanggalPemesanan)}\n`;
      receipt += line;

      pesanan.forEach((item) => {
        receipt += `${item.product.Nama}\n`;
        receipt += leftRight(
          `  ${item.jumlah} x ${Number(item.product.Harga).toLocaleString('id-ID')}`,
          Number(item.total_harga).toLocaleString('id-ID')
        ) + '\n';
      });

      receipt += line;
      receipt += leftRight('TOTAL', Number(total).toLocaleString('id-ID')) + '\n';
      receipt += leftRight('Tunai', Number(total).toLocaleString('id-ID')) + '\n';
      receipt += leftRight('Kembali', '0') + '\n';
      receipt += '\n';
      receipt += center(penutup) + '\n';
      receipt += center('Harap cek kembali orderan') + '\n';
      receipt += center('Selamat Menikmati :)') + '\n';
      receipt += '\n\n\n';
      receipt += '\x1D\x56\x00'; // Potong kertas

      const dataBytes = new TextEncoder().encode(receipt);
      await printer.print(dataBytes);

      alert('✅ Berhasil dicetak via USB!');
    } catch (err) {
      console.error(err);
      alert(`❌ Gagal mencetak via USB: ${err.message}`);
    }
  };

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
            <p>
              No antri:{' '}
              <span style={{ fontSize: '3em', fontWeight: 'bold' }}>{noAntrian}</span>
            </p>
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
            <p className="small">Selamat Menikmati😊</p>

            <div className="button-group">
              <button onClick={handleWebUSBPrint} className="btn-print">
                🖨️ Cetak (USB)
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
