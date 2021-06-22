import React, { useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchItemData } from "../../appComponent/common/commonSlice";
import { Item } from "./HomeComponents/Item"; 
import  Box  from '@material-ui/core/Box';
import { RootState } from '../../app/store'

export const Home = () => {
  const items = useSelector((state:RootState) => state.commonSlice.itemData)
  const [itemsData,setItemsData] = useState([...items])
  
  const dispatch = useDispatch()

  useEffect(() => { 
    dispatch(fetchItemData())
  }, [])

  useEffect(() => { 
    setItemsData([...items])
  }, [items])

  return (
    <React.Fragment>
      {/* <Slider itemsData={itemsData}/>
      <Search itemsData={itemsData} setItemsData={setItemsData} /> */}
      <Box display="flex" flexWrap="wrap">
        {itemsData.map((item,index) => (
            <Item item={item} key={index}/>
        ))}
      </Box>
    </React.Fragment>     
)
};