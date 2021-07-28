import { useDispatch } from "react-redux";
import { Button, TableCell } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { cartInfo } from "../Type/cartType";
import { deleteCart } from "../Slice/cartSlice";


interface Props {
    cartInfo:cartInfo|null
    uid:string | null
    index:number
}

export const DeleteButton = (props:Props) => {
  const dispatch = useDispatch()
  const deleteItem = (index:number) => {
    if (props.cartInfo) {
        let newCartInfo = JSON.parse(JSON.stringify(props.cartInfo));
        if (newCartInfo.iteminfo !== undefined) {
            newCartInfo.iteminfo.splice(index, 1);
        }
      if (props.uid) {
        const sendObj = {
            newCartInfo:newCartInfo,
            uid:props.uid
        }
        dispatch(deleteCart(sendObj));
      } else {
        const sendObj = {
            newCartInfo:newCartInfo,
            uid:null
        }
        dispatch(deleteCart(sendObj));
      }
    }
  };
  return (
    <TableCell>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deleteItem(props.index)}
      >
        削除
        <DeleteIcon />
      </Button>
    </TableCell>
  );
};