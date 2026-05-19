import React, { useEffect, useState } from 'react';
import "./inventory.css";
//all work have been done through the name of the database being products just change every instance of "products" to your respective database
import iname from "../assets/name.jpg";
import idesc from "../assets/desc.jpg";
import iprice from "../assets/price.jpg";
import iqty from "../assets/qty.jpg";
import ictg from "../assets/category.jpg";
import imdate from "../assets/mdate.jpg";
import iedate from "../assets/edate.jpg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ProductForm from './ProductForm.jsx';

//sorting and filter have been done 

export default function Inventory() {
    const [show, setShow] = useState(0); // for closing the update or add div setShow(0)
    const [index, setIndex] = useState(-1); // for clearing input fields setIndex(-1)
    const [name, setName] = useState("");//name parameter of database for update,add and delete
    const [price, setPrice] = useState(0);//price parameter of database for update,add and delete
    const [quantity, setQuantity] = useState(0);//quantity parameter of database for update,add and delete
    const [desc, setDesc] = useState("");//description parameter of databasev for update,add and delete
    const [category, setCategory] = useState("");//category parameter of database for update,add and delete
    const [mdate, setMdate] = useState(new Date());//createdAt parameter of database for update,add and delete
    const [edate, setEdate] = useState(new Date());//expdate parameter of database for update,add and delete
    const [sort, setSort] = useState(0);//for sorting
    const [order, setOrder] = useState(0);//for order of sorting
    const [search, setSearch] = useState("");//for getting search text
    const [table, setTable] = useState(0);//for showing all the table (no filter or search applied) 
    const [error, setError] = useState(0);//for handling any errors on search and filter
    const [indextab, setIndextab] = useState(-1);//for getting the index of the selected medcine
    const [filter, setFilter] = useState(0);//for showing the filter option
    const [stock, setStock] = useState("");// for getting the type of stock from filter
    const [ctg, setCtg] = useState("");//for getting the type of category from filter
    const [display, setDisplay] = useState([]);//getting the name of clicked medicine
    const [disname, setDisname] = useState("");//getting the name of clicked medicine
    const [disprice, setDisprice] = useState(0);//getting the price of clicked medicine
    const [disquantity, setDisquantity] = useState(0);//getting the qty. of clicked medicine
    const [disdesc, setDisdesc] = useState("");//getting the description of clicked medicine
    const [discategory, setDiscategory] = useState("");//getting the category of clicked medicine
    const [dismdate, setDismdate] = useState(new Date());//getting the createdAt of clicked medicine
    const [disedate, setDisedate] = useState(new Date());//getting the expdate of clicked medicine
    const [apply, setApply] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formMode, setFormMode] = useState("create"); // or "update", "delete"
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    //const [error, setError] = useState('');
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(0);
    const [outOfStockCount, setOutOfStockCount] = useState(0);

  const naviagate = useNavigate();//frontend

  useEffect(() => {
    // Fetch products on component mount
    const fetchProducts = async () => {
      try {
        // Sending GET request to fetch products from the backend
        const response = await axios.get('https://med-track.onrender.com/api/products', {
          withCredentials: true, // Ensure cookies (including token) are sent with request
        });
          console.log("API Response:", response.data); // Debugging
          // console.log(response.data.totalPrice);
          // console.log(response.data.totalQuantity);
          
            setProducts(response.data.products || []);
            setTotalQuantity(response.data.totalQuantity || 0);
            setTotalPrice(response.data.totalPrice || 0);
            setLowStockCount(response.data.lowStockCount || 0); // Set low stock count state
            setOutOfStockCount(response.data.outOfStockCount || 0);
            
      } catch (error) {
        // Handle error, if any
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, []);

  const totalmed = products.length; // total no. of medicine in stock
    let instock = products.filter(p=>p.quantity >75).length;//to check medicines in the stock
    let lowstock = products.filter(p=>p.quantity<=75 && p.quantity>0).length;//to check medicines low in stock
    let outstock = products.filter(p=>p.quantity===0).length;//to check medicines out of stock
  
    //set width accoringly
    let inwidth = (instock / totalmed) * 100;
    let lowidth = (lowstock / totalmed) * 100;
    let outwidth = (outstock / totalmed) * 100;

//frontend
    

//frontend
    useEffect(() => {
        const sorting = document.querySelector(".sort");
        if (sort === 1) {
            sorting.classList.add("sort1");
            sorting.classList.remove("sort2")
            sorting.classList.remove("sort3")
            sorting.classList.remove("sort4")
        }
        if (sort === 2) {
            sorting.classList.add("sort2");
            sorting.classList.remove("sort1")
            sorting.classList.remove("sort3")
            sorting.classList.remove("sort4")
        }
        if (sort === 3) {
            sorting.classList.add("sort3");
            sorting.classList.remove("sort2")
            sorting.classList.remove("sort1")
            sorting.classList.remove("sort4")
        }
        if (sort === 4) {
            sorting.classList.add("sort4");
            sorting.classList.remove("sort2")
            sorting.classList.remove("sort3")
            sorting.classList.remove("sort1")
        }
    }, [sort]);

//sorting
    useEffect(() => {
        let criteria;
        //determining the category of sorting
        switch (sort) {
            case 1:
                criteria = "name";
                break;
            case 2:
                criteria = "price";
                break;
            case 3:
                criteria = "quantity";
                break;
            case 4:
                criteria = "createdAt";
                break;
            default:
                criteria = "name";
        }

        // Determine sort order: 1 for ascending, 2 for descending
        const orders = order === 2 ? "desc" : "asc"; // Default to ascending if not 2
        //change the name products to your respective database
        products.sort((a, b) => {
            let comparison = 0;
            // If the criteria is createdAt, treat it as a date
            if (criteria === "createdAt") {
                const dateA = new Date(a[criteria]);
                const dateB = new Date(b[criteria]);
                comparison = dateA - dateB;
            }
            // For numeric criteria: price and quantity
            else if (criteria === "price" || criteria === "quantity") {
                comparison = a[criteria] - b[criteria];
            }
            // For strings (e.g., name)
            else {
                comparison = a[criteria].localeCompare(b[criteria]);
            }
            return orders === "desc" ? -comparison : comparison;
        });
        setSort(0);
        if (display !== "") {
            display.sort((a, b) => {
                let comparison = 0;
                // If the criteria is createdAt, treat it as a date
                if (criteria === "createdAt") {
                    const dateA = a[criteria];
                    const dateB = b[criteria];
                    comparison = dateA - dateB;
                }
                // For numeric criteria: price and quantity
                else if (criteria === "price" || criteria === "quantity") {
                    comparison = a[criteria] - b[criteria];
                }
                // For strings (e.g., name)
                else {
                    comparison = a[criteria].localeCompare(b[criteria]);
                }
                return orders === "desc" ? -comparison : comparison;
            });
        }
    }, [order]);
    

        // Handler when a table row is clicked
        const handleRowClick = (product) => {
            setSelectedProduct(product);
            // Set mode if you need to distinguish between update and delete.
            setFormMode("update");
            setShowForm(true);
        };
        // handler to refresh products list after any operation
        const refreshProducts = async () => {
            try {
              const response = await axios.get('https://med-track.onrender.com/api/products', {
                withCredentials: true, // ensure cookies (like JWT tokens) are sent
              });
              // Assuming your API returns an object with a "products" field:
              setProducts(response.data.products);
            } catch (error) {
              console.error("Error refreshing products:", error);
            }
          };
        
          // Fetch products on component mount.
          useEffect(() => {
            refreshProducts();
          }, []);
      
//code getting the searched medicine
    const find = () => {
        if (search !== "") {
            setTable(1);//table=1 means it doesn't shows all the products
            //change the name products to your respective database
            const index2 = products.findIndex(
                (product) => product.name.toLowerCase() === search.toLowerCase()
            );//finds the index of the searched medicine
            if (index2 === -1) {//if medicine not found
                setError(1);
                setIndextab(-1);
                setDisplay([]);
            } else {
                setIndextab(index2);
                setError(0);
            }
            setSearch("");//again set the search to null
        }
    };

//handle the back button ensuring all the products display
    const back = () => {
        setTable(0);
        setError(0);
        setIndextab(-1);
        setDisplay([]);
        setApply(0);
        //change the name products to your respective database
        filteredProducts = products;
    };
    //change the name products to your respective database
    let filteredProducts = products//declaring for storing the filtered products
//filter function
    const handleapply = () => {
        //change the name products to your respective database
        filteredProducts = products;

        if (stock === "in") {
            filteredProducts = filteredProducts.filter(
                (product) => product.quantity > 75
            );

        } else if (stock === "low") {
            filteredProducts = filteredProducts.filter(
                (product) => product.quantity <= 75 && product.quantity>0
            );
        } else if (stock === "out") {
            filteredProducts = filteredProducts.filter(
                (product) => product.quantity === 0
            );
        }

        if (ctg) {
            filteredProducts = filteredProducts.filter(
                (product) => product.category === ctg
            );
        }

        setDisplay(filteredProducts);//storing the products
        setFilter(0);
        setApply(1);
        setCtg("")
        setStock("")
    };
//frontend
    useEffect(() => {
        //change the name products to your respective database
        filteredProducts = products;
        if (display.length > 0) {
            setError(0);
            setTable(1);
            setIndextab(-1);
        }
        if (display.length === 0 && apply === 1) {
            setError(1);
            setTable(1);
        }
    }, [display, apply]);

    return (
        <>
            <div className="inventory">
                <div className="invheading">
                    <div className="head1">
                        <div className="rupee" onClick={() => { naviagate('/dashboard/sales') }}>
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                        </div>
                        <div className="value">
                            <h4 style={{ color: "#313133" }}>Total Inventory Value</h4>
                            <h2 style={{ color: "#313133" }}>
                                {'\u20B9'}{totalPrice}
                            </h2>
                        </div>
                    </div>
                    <div className="head2">
                        <div className="above">
                            <h3>{totalmed}</h3>
                            <p>products</p>
                        </div>
                        <div className="middle">
                            <div className="line">
                                {instock!==0 &&(<div className="in stock" style={{ width: `${inwidth}%` }}></div>)}
                                {lowstock!==0 &&(<div className="low stock" id='round' style={{ width: `${lowidth}%` }}></div>)}
                                {outstock!==0 &&(<div className="out stock" style={{ width: `${outwidth}%` }}></div>)}
                            </div>
                        </div>
                        <div className="down">
                            <div className="aboutinstock">
                                <p>
                                    <i className="fa-solid fa-circle"></i>In stock:{' '}
                                    <span>{instock}</span>
                                </p>
                            </div>
                            <div className="aboutlowstock">
                                <p>
                                    <i className="fa-solid fa-circle"></i>Low in stock:{' '}
                                    <span>{lowstock}</span>
                                </p>
                            </div>
                            <div className="aboutoutstock">
                                <p>
                                    <i className="fa-solid fa-circle"></i>Out of stock:{' '}
                                    <span>{outstock}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="invsearch">
                    <h1>Inventory</h1>
                {/*Add item button*/}
                    <button className="additem" onClick={() => { setFormMode("create"); setShowForm(true); }}>Add Product</button>
                            {showForm && (
                                <ProductForm
                                mode={formMode}
                                initialProduct={selectedProduct}
                                onClose={() => setShowForm(false)}
                                refreshProducts={refreshProducts}
                                />
                            )}

                    <div className="search" style={{ marginLeft: "45%" }}>
                        <input
                            type="text"
                            placeholder="Search here..."
                            style={{ width: "90%", height: "80%" }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <i
                            className="fa-solid fa-magnifying-glass"
                            style={{ left: "88%" }}
                            onClick={find}
                        ></i>
                    </div>
                    <div className="filter" onClick={() => {setFilter(1);setSort(0)}}>
                        <i className="fa-solid fa-filter" style={{ marginRight: "5%" }}></i>
                        <p>filter</p>
                    </div>
                </div>
                        {/*If no medecine found in filter or search the table heading doesn't shows*/ }
                {error === 0 && (
                    <div className="tablehead">
                        <h2>Sl No.</h2>
                        <h2 style={{ marginLeft: "9%" }}>
                            Name{' '}
                            <span>
                                <i
                                    className="fa-solid fa-sort"
                                    style={{ color: "white", cursor: "pointer" }}
                                    onClick={() => setSort(1)}
                                ></i>
                            </span>
                        </h2>
                        <h2 style={{ marginRight: "1%" }}>
                            Price{' '}
                            <span>
                                <i
                                    className="fa-solid fa-sort"
                                    style={{ color: "white", cursor: "pointer" }}
                                    onClick={() => setSort(2)}
                                ></i>
                            </span>
                        </h2>
                        <h2>
                            Qty.{' '}
                            <span>
                                <i
                                    className="fa-solid fa-sort"
                                    style={{ color: "white", cursor: "pointer" }}
                                    onClick={() => setSort(3)}
                                ></i>
                            </span>
                        </h2>
                        <h2>
                            Expiry{' '}
                            <span>
                                <i
                                    className="fa-solid fa-sort"
                                    style={{ color: "white", cursor: "pointer" }}
                                    onClick={() => setSort(4)}
                                ></i>
                            </span>
                        </h2>
                    </div>
                )}
                {/*This div displays all the medecine no filter or search applied just change the "products" to your database*/ }
                  {indextab===-1 && display.length===0 && error===0 &&(<div className="invtable">
                    {products.map((product, index) => (
                      <div
                        className="tablecont"
                        key={product._id}  // Use a unique id as the key
                        onClick={() => handleRowClick(product)}
                        style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
                      >
                        <h5>{index + 1}</h5>
                        <h5>{product.name}</h5>
                        <h5>{'\u20B9'}{product.price}</h5>
                        <h5>{product.quantity}</h5>
                        <h5>{moment(product.expDate).format("DD-MM-YYYY")}</h5>
                      </div>
                    ))}
                  </div>)}
            
                {/* Show the ProductForm if a product is selected */}
                  {showForm && (
                    <ProductForm
                      initialProduct={selectedProduct}
                      mode={formMode}
                      onClose={() => {
                        setShowForm(false);
                        setSelectedProduct(null);
                      }}
                      refreshProducts={refreshProducts}
                    />
                  )}
                {/*Shows the searched medicine If any*/ }
                {indextab >= 0 && (
                    <div className="invtable">
                        <div
                            className="tablecont"
                            key={products[indextab]}
                            onClick={() => {
                                setShow(2);
                                setSort(0)
                                setFilter(0)
                                setIndex(indextab);
                                handleRowClick(products[indextab])
                            }}
                        >
                            <h5>{indextab + 1}</h5>
                            <h5>{products[indextab].name}</h5>
                            <h5>{'\u20B9'}{products[indextab].price}</h5>
                            <h5>{products[indextab].quantity}</h5>
                            <h5>{moment(products[indextab].mfgDate).format("DD-MM-YYYY")}</h5>
                        </div>
                        <div className="backbut">
                            <button onClick={back}>Back</button>
                        </div>
                    </div>
                )}
                {/*If the searched medecine doesn't matches to database*/ }
                {error === 1 && <h2>No medicine found</h2>}
                {error === 1 && (
                    <div className="backbut">
                        <button onClick={back}>Back</button>
                    </div>
                )}
                {/*Shows the filtered medecine if any*/ }
                {display.length > 0 && (
                    <div className="invtable">
                        {display.map((disp) => (
                            <div
                                className="tablecont"
                                key={display.indexOf(disp)}
                                onClick={() => {
                                    setShow(2);
                                    setSort(0)
                                    setFilter(0)
                                    setIndex(display.indexOf(disp));
                                    setDisname(disp.name);
                                    setDiscategory(disp.category);
                                    setDisquantity(disp.quantity);
                                    setDisprice(disp.price);
                                    setDismdate(moment(disp.mfgDate).format("DD-MM-YYYY"));
                                    setDisedate(moment(disp.expDate).format("DD-MM-YYYY"));
                                    setDisdesc(disp.description);
                                    handleRowClick(disp)
                                }}
                            >
                                <h5>{display.indexOf(disp) + 1}</h5>
                                <h5>{disp.name}</h5>
                                <h5>{'\u20B9'}{disp.price}</h5>
                                <h5>{disp.quantity}</h5>
                                <h5>{moment(disp.expDate).format("DD-MM-YYYY")}</h5>
                            </div>
                        ))}
                        <div className="backbut">
                            <button onClick={back}>Back</button>
                        </div>
                    </div>
                )}
            </div>
                   
                {/*For displaying the sort box*/ }
            {sort > 0 && (
                <div className="sort">
                    <div className="asending" onClick={() => setOrder(1)}>
                        <i
                            className="fa-solid fa-arrow-down-short-wide"
                            style={{
                                marginRight: "10%",
                                marginLeft: "10%",
                                fontSize: "1rem",
                            }}
                        ></i>
                        <p>ascending order</p>
                    </div>
                    <div className="descending" onClick={() => setOrder(2)}>
                        <i
                            className="fa-solid fa-arrow-up-wide-short"
                            style={{
                                marginRight: "10%",
                                marginLeft: "10%",
                                fontSize: "1rem",
                            }}
                        ></i>
                        <p>descinding order</p>
                    </div>
                    <div className="cross">
                        <i
                            className="fa-solid fa-xmark"
                            onClick={() => setSort(0)}
                        ></i>
                    </div>
                </div>
            )}
                {/*for displaying the filter box*/ }
            {filter === 1 && (
                <div className="showfilter">
                    <div className="stockfilter">
                        <div className="shead">
                            <h5>Stocks</h5>
                        </div>
                        <div className="sopt">
                            <div className="stype">
                                <input
                                    type="radio"
                                    id="instock"
                                    name="stock"
                                    value="in"
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                <label htmlFor="instock">In stock</label>
                            </div>
                            <div className="stype">
                                <input
                                    type="radio"
                                    id="lowstock"
                                    name="stock"
                                    value="low"
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                <label htmlFor="lowstock">Low in stock</label>
                            </div>
                            <div className="stype">
                                <input
                                    type="radio"
                                    id="outstock"
                                    name="stock"
                                    value="out"
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                <label htmlFor="outstock">Out of stock</label>
                            </div>
                        </div>
                    </div>
                    <div className="categoryfilter">
                        <div className="chead">
                            <h5>Category</h5>
                        </div>
                        <div className="copt">
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="1"
                                    name="ctg"
                                    value="Pain Relief"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="1">Pain relief</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="2"
                                    name="ctg"
                                    value="Antibiotics"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="2">Antibiotics</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="3"
                                    name="ctg"
                                    value="Allergy"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="3">Allergy</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="4"
                                    name="ctg"
                                    value="Digestive Health"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="4">Digestive Health</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="5"
                                    name="ctg"
                                    value="Vitamins"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="5">Vitamins</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="6"
                                    name="ctg"
                                    value="Diabetes"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="6">Diabetes</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="7"
                                    name="ctg"
                                    value="Cardiovascular"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="7">Cardiovascular</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="8"
                                    name="ctg"
                                    value="Sleep Aid"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="8">Sleep Aid</label>
                            </div>
                            <div className="ctg">
                                <input
                                    type="radio"
                                    id="9"
                                    name="ctg"
                                    value="Mental Health"
                                    onChange={(e) => setCtg(e.target.value)}
                                />
                                <label htmlFor="9">Mental Health</label>
                            </div>
                        </div>
                    </div>
                    <div className="filterbuttons">
                        <button
                            style={{ backgroundColor: "#1DBFC6" }}
                            onClick={handleapply}
                        >
                            Apply
                        </button>
                        <button
                            style={{ backgroundColor: "#EC6869" }}
                            onClick={() => setFilter(0)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
