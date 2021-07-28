import { DeleteButton } from "../CartComponents/DeleteButton";
import renderer from 'react-test-renderer';
import { iteminfoArrayType , cartInfo } from "../Type/cartType";
import { render, cleanup, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector:jest.fn(),
    useDispatch:() => mockDispatch
}));



let toppingDummy = [
    {
        toppingId:1,
        toppingSize:0,
    }
]
let iteminfoArrayDummy:iteminfoArrayType[] = [
{
    id:'1',
    itemId:1,
    itemNum:2,
    itemSize:1,
    toppings:toppingDummy
}
]

let cartInfoDummy :cartInfo ={
    address:'群馬県高崎市寺尾町',
    email:'blackbaby.8-cp@ezweb.ne.jp',
    iteminfo:iteminfoArrayDummy,
    orderDate:1624610024855,
    password:"blackbaby8_cp",
    payment:1,
    status:0,
    tel:'090-6175-0675',
    totalPrice:1490,
    userId:"UYThWgYXAvTWdDSLDqO2NHETiBw1",
    zip:"376-0034",
    id:"1"
}

// test('DleteButtonDefault', () => {
//     const component = renderer.create(
//         <DeleteButton cartInfo={cartInfoDummy} uid={'sadfjsdfklsdlf'} index={3}></DeleteButton>
//     )
//     let tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
// })

afterEach(() => cleanup())

describe("DleteButtonDefault", () => {
    it("Should render only with Anything", () => {
        render(<DeleteButton cartInfo={cartInfoDummy} uid={'sadfjsdfklsdlf'} index={3} />)
        expect(screen.getByRole("button")).toBeTruthy();
    });
});

describe("DleteButtonOnClickUidTrue", () => {
    it("deleteIteminfo", () => {
        render(<DeleteButton cartInfo={cartInfoDummy} uid={'sadfjsdfklsdlf'} index={1} />)
        const button = screen.getByRole("button");
        userEvent.click(button)
        if(cartInfoDummy && cartInfoDummy.iteminfo){
            expect(cartInfoDummy.iteminfo.length).toBe(1)
        }
    });
});

describe("DleteButtonOnClickUidTrue", () => {
    it("deleteIteminfoNoUid", () => {
        render(<DeleteButton cartInfo={cartInfoDummy} uid={null} index={0} />)
        const button =screen.getByRole("button");
        userEvent.click(button)
        if(cartInfoDummy && cartInfoDummy.iteminfo){
            expect(cartInfoDummy.iteminfo.length).toBe(1)
        }
    })
})

describe("DleteButtonOnClickUidTrue", () => {
    it("deleteIteminfoNoCartinfo", () => {
        render(<DeleteButton cartInfo={null} uid={null} index={0} />)
        const button =screen.getByRole("button");
        let newCartInfo = JSON.parse(JSON.stringify(cartInfoDummy));
        userEvent.click(button)
        if(cartInfoDummy && cartInfoDummy.iteminfo){
            expect(cartInfoDummy.iteminfo).toEqual(newCartInfo.iteminfo)
        }
    })
})

describe("DleteButtonOnClickIteminfoNull", () => {
    it("deleteIteminfoNoIteminfo", () => {
        cartInfoDummy.iteminfo = undefined;
        render(<DeleteButton cartInfo={cartInfoDummy} uid={null} index={0} />)
        const button =screen.getByRole("button");
        let newCartInfo = JSON.parse(JSON.stringify(cartInfoDummy));
        userEvent.click(button)
        if(cartInfoDummy && cartInfoDummy.iteminfo){
            expect(cartInfoDummy.iteminfo).toEqual(newCartInfo.iteminfo)
        }
    })
})

