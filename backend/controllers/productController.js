import { Product } from "../models/productModel.js";

// ✅ Get all products for the logged-in user
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }); // Fetch only this user's products

    // Calculate total quantity and total price
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    // Count products with quantity < 10
    const lowStockCount = products.filter(product => product.quantity < 10 && product.quantity > 0).length;
    // Count products with quantity === 0
    const outOfStockCount = products.filter(product => Number(product.quantity) === 0).length;

    res.status(200).json({ products, totalQuantity, totalPrice, lowStockCount, outOfStockCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a single product (Only if the user owns it)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create a new product (Automatically assigns the user as the owner)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category, expDate, mfgDate } = req.body;
    console.log("Received Data:", req.body);
    // Ensure required fields are provided
    if (!name || !price || !quantity || !expDate) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    //console.log(req.user.id);

    const pdct = await Product.findOne({name});
       if(pdct) {
        return res.status(400).json({
            message: " Product already exists try Updating or Create Another product"
        })
       }
    // Create a new product associated with the logged-in user
    const product = await Product.create({
      user: req.user.id,  // Assign the logged-in user as the product owner
      name,
      description,
      price,
      quantity,
      category,
      expDate,
      mfgDate
    });
    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400).json({ message: "Failed to create product" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update a product (Only if the user owns it)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

// ✅ Delete a product (Only if the user owns it)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
