import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PetunjukDialogProps {
    open: boolean,
    fnHandle: (e: React.MouseEvent) => void
};

const PetunjukDialog: React.FC<PetunjukDialogProps> = ({open, fnHandle}) => {
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={fnHandle}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Binggung Cara Menggunakannya?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <ol>
                <li>Jangan lupa untuk pengunaan koma silahkan untuk menggunakan titik!</li>
                <li>Bagian kosong silahkan di-isi dengan nol.</li>
                <li>FIFO : Menggunakan aturan FIFO (Wajib ada % dari Beginning Material).</li>
                <li>Department II : (Menerima Quantity dari Department Sebelumnya) untuk Previous Transferred Cost di-isi Transferred Cost dari Department sebelumnya.</li>
                <li>Scrap Goods : Terdapat barang yang rusak / gagal saat diproduksi (Wajib ada % dari Scrap Material).</li>
                <li>Finish Department : Sebuah Opsi apabila menggunakan Scrap Goods dimana barang rusak ada yang dijual dan disimpan di gudang.</li>
            </ol>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fnHandle}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PetunjukDialog;