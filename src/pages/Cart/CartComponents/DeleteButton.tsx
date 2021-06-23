import { useDispatch } from "react-redux";
// import {deletecart} from "../../actions"
// import { Button, TableCell } from "@material-ui/core";
// import DeleteIcon from "@material-ui/icons/Delete";


// interface Props {
//     item:ItemdataObj
// }

// export const DeleteButton = (props) => {
//   const dispatch = useDispatch()
//   const deleteItem = (index) => {
//     if (props.cartInfo) {
//       props.cartInfo.itemInfo.splice(index, 1);
//       let newCartInfo = JSON.parse(JSON.stringify(props.cartInfo));
//       if (props.user) {
//         dispatch(deletecart(newCartInfo, props.user.uid));
//       } else {
//         dispatch(deletecart(newCartInfo, null));
//       }
//     }
//   };
//   return (
//     <TableCell>
//       <Button
//         variant="contained"
//         color="secondary"
//         onClick={() => deleteItem(props.index)}
//       >
//         削除
//         <DeleteIcon />
//       </Button>
//     </TableCell>
//   );
// };