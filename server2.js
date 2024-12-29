// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

// Import chalk dynamically since it's an ESM-only module
(async () => {
  const chalk = (await import("chalk")).default;

  // Configure Cloudinary with your credentials
  cloudinary.config({
    cloud_name: "dci8ztpsm",
    api_key: "824353511833739",
    api_secret: "n0PMDK06iVYvzokvnErtfu4It7I",
  });

  // Connect to MongoDB
  mongoose
    .connect(
      "mongodb+srv://test123:testing2003@cluster0.abeugnm.mongodb.net/E-commerce-cloths-Backend"
    )
    .then(() => {
      console.log(chalk.green("Connected to MongoDB"));
    })
    .catch((err) => {
      console.error(chalk.red("Error connecting to MongoDB:", err));
    });

  // Initialize the Express app
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Middleware for logging API requests with colors
  app.use((req, res, next) => {
    // Skip logging for GET requests
    if (req.method === "GET") {
      return next();
    }

    console.log(
      chalk.blue(`Incoming Request: ${req.method} ${req.originalUrl}`)
    );

    // Capture response status and action
    const oldSend = res.send;
    res.send = function (data) {
      let action;
      let color = chalk.white;

      if (req.originalUrl.includes("/add-products") && req.method === "POST") {
        action = "Added a product";
        color = chalk.green;
      } else if (
        req.originalUrl.includes("/update-product") &&
        req.method === "PUT"
      ) {
        action = "Updated a product";
        color = chalk.yellow;
      } else if (
        req.originalUrl.includes("/delete-product") &&
        req.method === "DELETE"
      ) {
        action = "Deleted a product";
        color = chalk.red;
      } else {
        action = "Performed an action";
      }

      console.log(color(`Action: ${action} | Status Code: ${res.statusCode}`));
      res.send = oldSend;
      return res.send(data);
    };

    next();
  });

  const productSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    originalPrice: Number,
    salePrice: Number,
    onSale: {
      type: Boolean,
      default: false,
    },
    isOutOfStock: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sizes: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 0 },
        disabled: { type: Boolean, default: false }
      },
    ],
  });

  const Product = mongoose.model("Product", productSchema);

  

  // Get sizes for a specific product
  app.get("/api/shop/products/:id/sizes", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product.sizes || []);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching sizes", error: error.message });
    }
  });


  //update quantity

  app.put("/api/shop/products/:id/sizes", async (req, res) => {
    try {
      const { sizeName, quantity } = req.body; // Accept size name and quantity from the request body
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Find the size object by name
      const size = product.sizes.find((size) => size.name === sizeName);
  
      if (!size) {
        return res.status(404).json({ message: "Size not found" });
      }
  
      // Update the quantity for the found size
      size.quantity = quantity;
  
      // If quantity is 0, mark the size as disabled or out of stock
      if (quantity === 0) {
        size.disabled = true; // Mark as disabled (you could also set isOutOfStock to true depending on your schema)
      } else {
        size.disabled = false; // Enable the size if quantity is greater than 0
      }
  
      await product.save(); // Save the updated product document
  
      // Send a success response with updated size and quantity
      res.status(200).json({
        message: "Quantity and size updated successfully",
        updatedSize: { name: sizeName, quantity }
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating size quantity", error: error.message });
    }
  });
  
  
// API endpoint to add products
app.post("/api/shop/api/admin/add-products", async (req, res) => {
  try {
    const newProduct = req.body;

    // Set default values for onSale and isOutOfStock
    newProduct.onSale = newProduct.onSale || false;
    newProduct.isOutOfStock = false;

    // Set default sizes if not provided
    newProduct.sizes = newProduct.sizes || [
      { name: "S", quantity: 10, disabled: false },
      { name: "M", quantity: 10, disabled: false },
      { name: "L", quantity: 10, disabled: false },
      { name: "XL", quantity: 10, disabled: false },
    ];

    // Validate sizes
    if (!Array.isArray(newProduct.sizes)) {
      return res.status(400).json({ error: "Sizes must be an array" });
    }

    // Validate each size object
    const isValidSizes = newProduct.sizes.every(
      (size) =>
        size.name &&
        typeof size.name === "string" &&
        typeof size.quantity === "number" &&
        typeof size.disabled === "boolean"
    );

    if (!isValidSizes) {
      return res.status(400).json({
        error:
          "Each size must have a name (string), quantity (number), and disabled (boolean) property",
      });
    }

    // Check for duplicate product title
    const existingProduct = await Product.findOne({
      title: newProduct.title,
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this title already exists" });
    }

    // Check for image
    if (!newProduct.image) {
      return res.status(400).json({ error: "Image field is required" });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(newProduct.image, {
      folder: "products",
    });

    // Set the uploaded image URL
    newProduct.image = uploadResponse.secure_url;

    // Determine if the product is out of stock
    const totalQuantity = newProduct.sizes.reduce(
      (sum, size) => sum + size.quantity,
      0
    );
    newProduct.isOutOfStock = totalQuantity === 0;

    // Create and save the product
    const product = new Product(newProduct);
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error(chalk.red("Error adding product:", err));
    res.status(500).json({ error: "Failed to add product" });
  }
});

  // API endpoint to update a product
  app.put("/api/admin/update-product/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProductData = req.body;

      updatedProductData.isOutOfStock = updatedProductData.onSale
        ? false
        : true;

      if (updatedProductData.image) {
        const uploadResponse = await cloudinary.uploader.upload(
          updatedProductData.image,
          {
            folder: "products",
          }
        );
        updatedProductData.image = uploadResponse.secure_url;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedProductData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res
        .status(200)
        .json({
          message: "Product updated successfully",
          product: updatedProduct,
        });
    } catch (err) {
      console.error(chalk.red("Error updating product:", err));
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // API endpoint to delete a product
  app.delete("/api/admin/delete-product/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(chalk.red("Error deleting product:", err));
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // API endpoint to get all products
  app.get("/api/shop/products/get", async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      console.error(chalk.red("Error fetching products:", err));
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });



  
//purchase
app.post("/api/shop/products/:id/purchase", async (req, res) => {
  try {
    const { id } = req.params;
    const { size, quantity } = req.body; // Example: { size: "M", quantity: 1 }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the size to update
    const sizeIndex = product.sizes.findIndex((s) => s.name === size);
    if (sizeIndex === -1) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    const selectedSize = product.sizes[sizeIndex];

    // Check if there's enough quantity
    if (selectedSize.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock for the selected size" });
    }

    // Reduce quantity and disable size if quantity is 0
    selectedSize.quantity -= quantity;
    if (selectedSize.quantity === 0) {
      selectedSize.disabled = true;
    }

    // Save the updated product
    product.sizes[sizeIndex] = selectedSize;
    await product.save();

    res.status(200).json({ message: "Purchase successful", product });
  } catch (err) {
    console.error("Error processing purchase:", err);
    res.status(500).json({ error: "Failed to process purchase" });
  }
});





  // Start the server
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(chalk.green(`Server is running on http://localhost:${PORT}`));
  });
})();
