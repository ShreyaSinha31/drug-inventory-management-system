import React, { useEffect } from 'react';
import "./order.css"
import { useState } from 'react';
import orders from "../orders.json";//this is the sample database replace "orders" with your respective db everywhere

let notify = 1//set notify 0 for no notifications

export default function Order() {
    const received = orders.filter((order) => order.Status === "Received")
    const pending = orders.filter((order) => order.Status === "Pending")
    const paid = orders.filter((order) => order.Payment === "Paid")
    const unpaid = orders.filter((order) => order.Payment === "Unpaid")
    const len = orders.length
    //active 1 for all orders
    //2 for status received
    //3 for status pending
    //4 for payment done
    //5 for payment unpaid
    //0 for displaying searched or filter orders(if any)
    const [active, setActive] = useState(1)
    const [errorsearch, setErrorsearch] = useState(0);//error while search
    const [errorfilter,setErrorfilter]= useState(0);//error while filter
    const [show, setShow] = useState(0);//for showing add,update and delete box
    const [index, setIndex] = useState(-1);
    const [id, setId] = useState(0);//order ID
    const [name, setName] = useState("");//Order name
    const [email, setEmail] = useState("");//E-mail
    const [date, setDate] = useState(new Date());//date of order
    const [num, setNum] = useState(0);//number
    const [amt, setAmt] = useState(0);//amount of order
    const [pay, setPay] = useState(-1);//payement paid or unpaid
    const [sts, setSts] = useState(-1);// status received or pending
    const [search, setSearch] = useState("");//store searched input
    const [out, setOut] = useState([]);//use to store searched order
    const [check, setCheck] = useState(0);
    const [range1, setRange1] = useState("");//starting date of filter
    const [range2, setRange2] = useState("");//ending date of filter
    const [filter, setFilter] = useState([]);//use to store filtered product
    //frontend
    useEffect(() => {
        const div = document.querySelector(".order")
        if (show > 0)
            div.classList.add("blur")
        else
            div.classList.remove("blur")
        if (show === 1) {
        }
    }, [show])

    //used to store data of clicked order
    function handleClick(or) {
        setShow(2)
        setId(or.OrderID)
        setName(or.Name)
        setEmail(or.Email)
        setDate(or.Date)
        setNum(or.Number)
        setAmt(or.Amount)
        setPay(or.Payment === "Paid" ? 1 : 0)
        setSts(or.Status === "Received" ? 1 : 0)
    }

    const handleadd = () => {
        setShow(1)
        setId(0)
        setName("")
        setEmail("")
        setDate(new Date())
        setNum(0)
        setAmt(0)
        setPay(-1)
        setSts(-1)
    }
    //for search change "orders" to your db
    function handlesearch(event) {
        if (event.key === "Enter") {
            setFilter([])
            setRange1("")
            setRange2("")
            if (out.length === 0)
                setOut([])
            if (search !== "") {
                setOut(orders.filter((order) => order.OrderID.toLowerCase() === search.toLowerCase()))
                setCheck(1)
            }
            setSearch("")
        }
    }
    //frontend
    useEffect(() => {
        
        if (out.length === 0 && check === 1) {
            setActive(0)
            setErrorsearch(1)
        }
        if(out.length>0){
            setActive(0)
            setErrorsearch(0)
        }
        setCheck(0)
        
    }, [out, check])
    //for filter change "orders" to your db
    useEffect(() => {
        if (range1 !== "" && range2 !== "") {
            const date1 = new Date(range1)
            const date2 = new Date(range2)
            setOut([])
            if (filter.length == 0)
                setFilter([])
            if (date2 >= date1) {
                setFilter(orders.filter((order) => new Date(order.Date) <= date2 && new Date(order.Date) >= date1))
                setIndex(1)
            }
        }
    }, [range1, range2])
    //frontend
    useEffect(() => {
        
        if (filter.length === 0 && index === 1) {
            setActive(0)
            setErrorfilter(1)
        }
        if(filter.length>0){
            setActive(0)
            setErrorfilter(0)
        }
        setIndex(-1)
    }, [filter])
    //frontend
    useEffect(() => {
        if (active > 0) {
            setFilter([])
            setRange1("")
            setRange2("")
            setErrorsearch(0)
            setErrorfilter(0)
            setSearch("")
            setOut([])
        }
    }, [active])

    
    return (<>
        <div className="order" >
            <div className="orhead">
                <div className="orheading">
                    <div className="tittle">
                        <h1>Order</h1>
                        {/*len is the length of orders*/}
                        <p>{len} orders found</p>
                    </div>
                    <div className="oropt">
                        <div className="search1">
                            <input type="text" placeholder='Enter Order Id' value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => handlesearch(e)} />
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <div className="opt1">
                            <i class="fa-solid fa-bell"></i>
                            {notify === 1 && (<i className="fa-solid fa-circle" id='icon13'></i>)}
                        </div>
                        <div className="opt1"><i class="fa-solid fa-user"></i></div>
                    </div>
                </div>
                <div className="oroptions">
                    <div className="orshow">
                        <p onClick={() => { setActive(1) }} className={active === 1 ? "active1" : ""}>All orders</p>
                        <p onClick={() => { setActive(2) }} className={active === 2 ? "active1" : ""}>Recived</p>
                        <p onClick={() => { setActive(3) }} className={active === 3 ? "active1" : ""}>Pending</p>
                        <p onClick={() => { setActive(4) }} className={active === 4 ? "active1" : ""}>Paid</p>
                        <p onClick={() => { setActive(5) }} className={active === 5 ? "active1" : ""}>Unpaid</p>
                    </div>
                    <div className="date">
                        <input type="date" value={range1} onChange={(e) => setRange1(e.target.value)} />
                        <p>to</p>
                        <input type="date" value={range2} onChange={(e) => setRange2(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className="ortable">
                {errorsearch === 0 && errorfilter===0 &&(<div className='tablehead t1'>
                    <h3>Order ID</h3>
                    <h3>Name</h3>
                    <h3>Email</h3>
                    <h3>Date</h3>
                    <h3>Amount</h3>
                    <h3>Payment</h3>
                    <h3>Status</h3>
                </div>)}
                {/*This is the searched data*/}
                {out.length > 0 && filter.length===0 && (<div className='ortable1'>
                    <div className="orcontent" onClick={() => handleClick(out[0])}>
                        <h5>{out[0].OrderID}</h5>
                        <h5>{out[0].Name.slice(0, 15)}{out[0].Name.length > 15 ? ".." : ""}</h5>
                        <h5>{out[0].Email.slice(0, 8)}..</h5>
                        <h5>{new Date(out[0].Date).toLocaleDateString("en-Gb")}</h5>
                        <h5>{out[0].Amount}</h5>
                        <h5 className={out[0].Payment === "Paid" ? "green" : "red"}>{out[0].Payment}{out[0].Payment === "Paid" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                        <h5 className={out[0].Status === "Received" ? "green" : "red"}>{out[0].Status}{out[0].Status === "Received" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                    </div>
                    <button className='backsearch' onClick={() => { setActive(1); setOut([]); setError(0) }}>Back</button>
                </div>)}
                {/*All orders*/}
                {active === 1 && (<div className='ortable1' >
                    {orders.map((order) => (<div className='orcontent' key={orders.indexOf(order)} onClick={() => handleClick(order)}>
                        <h5>{order.OrderID}</h5>
                        <h5>{order.Name.slice(0, 15)}{order.Name.length > 15 ? ".." : ""}</h5>
                        <h5>{order.Email.slice(0, 8)}..</h5>
                        <h5>{new Date(order.Date).toLocaleDateString("en-GB")}</h5>
                        <h5>{order.Amount}</h5>
                        <h5 className={order.Payment === "Paid" ? "green" : "red"}>{order.Payment}{order.Payment === "Paid" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                        <h5 className={order.Status === "Received" ? "green" : "red"}>{order.Status}{order.Status === "Received" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                    </div>))}
                </div>)}
                {/*orders status received*/}
                {active === 2 && (<div className='ortable1' >
                    {received.map((rec) => (<div className='orcontent' key={received.indexOf(rec)} onClick={() => handleClick(rec)}>
                        <h5>{rec.OrderID}</h5>
                        <h5>{rec.Name.slice(0, 15)}{rec.Name.length > 15 ? ".." : ""}</h5>
                        <h5>{rec.Email.slice(0, 8)}..</h5>
                        <h5>{new Date(rec.Date).toLocaleDateString("en-GB")}</h5>
                        <h5>{rec.Amount}</h5>
                        <h5 className={rec.Payment === "Paid" ? "green" : "red"}>{rec.Payment}{rec.Payment === "Paid" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                        <h5 style={{ color: "green" }}>{rec.Status}{<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>}</h5>
                    </div>))}
                </div>)}
                {/*order status pending*/}
                {active === 3 && (<div className='ortable1' >
                    {pending.map((pen) => (<div className='orcontent' key={pending.indexOf(pen)} onClick={() => handleClick(pen)}>
                        <h5>{pen.OrderID}</h5>
                        <h5>{pen.Name.slice(0, 15)}{pen.Name.length > 15 ? ".." : ""}</h5>
                        <h5>{pen.Email.slice(0, 8)}..</h5>
                        <h5>{new Date(pen.Date).toLocaleDateString("en-GB")}</h5>
                        <h5>{pen.Amount}</h5>
                        <h5 className={pen.Payment === "Paid" ? "green" : "red"}>{pen.Payment}{pen.Payment === "Paid" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                        <h5 style={{ color: "red" }}>{pen.Status}{<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>}</h5>
                    </div>))}
                </div>)}
                {/*order payement paid*/}
                {active === 4 && (<div className='ortable1' >
                    {paid.map((pd) => (<div className='orcontent' key={paid.indexOf(pd)} onClick={() => handleClick(pd)}>

                        <h5>{pd.OrderID}</h5>
                        <h5>{pd.Name.slice(0, 15)}{pd.Name.length > 15 ? ".." : ""}</h5>
                        <h5>{pd.Email.slice(0, 8)}..</h5>
                        <h5>{new Date(pd.Date).toLocaleDateString("en-GB")}</h5>
                        <h5>{pd.Amount}</h5>
                        <h5 style={{ color: "green" }}>{pd.Payment}{<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>}</h5>
                        <h5 className={pd.Status === "Received" ? "green" : "red"}>{pd.Status}{pd.Status === "Received" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                    </div>))}
                </div>)}
                {/*order payement unpaid*/}
                {active === 5 && (<div className='ortable1' >
                    {unpaid.map((upd) => (<div className='orcontent' key={unpaid.indexOf(upd)} onClick={() => handleClick(upd)}>

                        <h5>{upd.OrderID}</h5>
                        <h5>{upd.Name.slice(0, 15)}{upd.Name.length > 15 ? ".." : ""}</h5>
                        <h5>{upd.Email.slice(0, 8)}..</h5>
                        <h5>{new Date(upd.Date).toLocaleDateString("en-GB")}</h5>
                        <h5>{upd.Amount}</h5>
                        <h5 style={{ color: "red" }}>{upd.Payment}{<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>}</h5>
                        <h5 className={upd.Status === "Received" ? "green" : "red"}>{upd.Status}{upd.Status === "Received" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                    </div>))}
                </div>)}
                {/*Filtered orders*/}
                {filter.length > 0 && out.length===0 && (<div className='ortable1' style={{ marginTop: "2%" }}>
                    {filter.map((fil) => (<div className='orcontent' key={filter.indexOf(fil)} onClick={() => handleClick(fil)}>
                        <h5>{fil.OrderID}</h5>
                        <h5>{fil.Name.slice(0, 15)}{fil.Name.length > 15 ? ".." : ""}</h5>
                        <h5>{fil.Email.slice(0, 8)}..</h5>
                        <h5>{new Date(fil.Date).toLocaleDateString("en-GB")}</h5>
                        <h5>{fil.Amount}</h5>
                        <h5 className={fil.Payment === "Paid" ? "green" : "red"}>{fil.Payment}{fil.Payment === "Paid" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                        <h5 className={fil.Status === "Received" ? "green" : "red"}>{fil.Status}{fil.Status === "Received" ? (<i class="fa-solid fa-circle-check" style={{ color: "green" }}></i>) : (<i class="fa-solid fa-circle-xmark" style={{ color: "red" }}></i>)}</h5>
                    </div>))}
                </div>)}
               {/*if no order found while filter*/}
                {errorfilter===1 && filter.length===0 &&(
                    <div className='ortable1'>
                    <div className="error">
                        <p>No Order Found!</p>
                        <button
                            className='backsearch'
                            style={{ marginBottom: "0%", height: "75%" }}
                            onClick={() => {
                                setActive(1);
                                setErrorfilter(0);
                                setFilter([]);
                            }}
                        >
                            Back
                        </button>
                    </div>
                </div>
                )}
                {/*if no order found while search*/}
                {errorsearch===1 && out.length===0 &&(
                    <div className='ortable1'>
                    <div className="error">
                        <p>No Order Found!</p>
                        <button
                            className='backsearch'
                            style={{ marginBottom: "0%", height: "75%" }}
                            onClick={() => {
                                setActive(1);
                                setOut([]);
                                setErrorsearch(0);
                            }}
                        >
                            Back
                        </button>
                    </div>
                </div>
                )}
                {/*for adding database*/}
                <div className="orbutton">
                    <div className="oraddbutton" onClick={() => handleadd()}>
                        <div className="addcir">
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/*for updating and deleting database*/}
        {show > 0 && (<div className='addproduct'>
            <div className="border"></div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Order ID:</p>
                </div>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Name:</p>
                </div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>E-mail:</p>
                </div>
                <input type="mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Order Date:</p>
                </div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Number:</p>
                </div>
                <input type="number" value={num} onChange={(e) => setNum(e.target.value)} min={0} />
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Amount:</p>
                </div>
                <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} min="0" />
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Payement:</p>
                </div>
                <div className="radio">
                    <div className="part" style={{ color: "green" }}>
                        <input type="radio" id='pd' value="Paid" name='pay' checked={pay === 1 ? 1 : 0} onChange={(e) => setPay(1)} />
                        <label htmlFor="pd">Paid</label>
                    </div>
                    <div className="part" style={{ color: "red" }}>
                        <input type="radio" id='upd' value="Unpaid" name='pay' checked={pay === 0 ? 1 : 0} onChange={(e) => setPay(0)} />
                        <label htmlFor="upd">UnPaid</label>
                    </div>
                </div>
            </div>
            <div className="medcontent">
                <div className="medhead">
                    <p>Status:</p>
                </div>
                <div className="radio" style={{ paddingLeft: "13px" }}>
                    <div className="part" style={{ color: "green" }}>
                        <input type="radio" id='rec' value="Received" name='sts' checked={sts === 1 ? 1 : 0} onChange={(e) => setSts(1)} />
                        <label htmlFor="rec">Received</label>

                    </div>
                    <div className="part" style={{ color: "red" }}>
                        <input type="radio" id='pen' value="Pending" name='sts' checked={sts === 0 ? 1 : 0} onChange={(e) => setSts(0)} />
                        <label htmlFor="pen">Pending</label>
                    </div>
                </div>
            </div>
            <div className="medcontent">
                <div className="medbuttons" style={{ marginRight: "60px" }}>
                    {show === 1 && (<button style={{ backgroundColor: "#1DBFC6" }}>
                        Add
                    </button>)}
                    {show === 2 && (<button style={{ backgroundColor: "#F9D50A" }}>
                        Update
                    </button>)}
                    {show === 2 && (<button style={{ backgroundColor: "#329DFF" }}>
                        Delete
                    </button>)}
                    <button onClick={() => setShow(0)} style={{ backgroundColor: "#EC6869" }}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>)}
    </>);
}