# ShopSphere API 🛒

[](https://github.com/Rjesh-Kumar/shopsphere-api#shopsphere-api)
Full-featured e-commerce backend with products, categories, cart, wishlist, addresses, and orders management. MongoDB + Express + Node.js API.

## Tech Stack
[](https://github.com/Rjesh-Kumar/shopsphere-api#tech-stack)
**Runtime:** Node.js  
**Framework:** Express  
**Database:** MongoDB with Mongoose ODM  
**Other:** CORS, dotenv  

## Features
[](https://github.com/Rjesh-Kumar/shopsphere-api#features)
- Browse products with category population  
- Create products with category validation  
- Shopping cart (add/remove/update quantity/size)  
- Wishlist management (add/remove products)  
- User address CRUD operations  
- Order creation and history  
- Dynamic categories (create/list)  

## Live Deployment
Hosted on **Vercel** as a backend API. (https://e-commerce-be-wheat.vercel.app/)

## Getting Started

### Prerequisites
- Node.js (LTS recommended)  
- MongoDB database (local or MongoDB Atlas)  

### Installation 
git clone https://github.com/Rjesh-Kumar/Shopper-BE.git

cd shopsphere-api

npm install


### Environment Variables
Create `.env` file:

MONGODB_URI=your-mongodb-connection-string

PORT=5000


### Running the Server

npm run dev

**Base URL:** `http://localhost:5000`

## API Endpoints
[](https://github.com/Rjesh-Kumar/shopsphere-api#api-endpoints)

**Base URL (local):** `http://localhost:5000`  
**Base URL (production):** `https://your-shopsphere-backend.vercel.app/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/products` | All products |
| `GET` | `/api/products/:id` | Single product |
| `POST` | `/api/products/create` | Create product |
| `GET` | `/api/categories` | All categories |
| `POST` | `/api/cart/:userId/add` | Add to cart |
| `POST` | `/api/wishlist/:userId/add` | Add to wishlist |
| `POST` | `/api/orders/:userId/create` | Create order |

## Contact
For bugs or feature requests: rajeshkumarrour40@gmail.com
