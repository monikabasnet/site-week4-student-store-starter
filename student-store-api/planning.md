## Data Models

### Product Model
- `id`: Int, primary key, auto-increment
- `name`: String, required
- `description`: String, required
- `price`: Decimal, required
- `image_url`: String, required
- `category`: String, required

**Relationships:**
- One Product can appear in many OrderItems

**Cascade Behavior:**
- When a Product is deleted, all OrderItems referencing it are also deleted

---

### Order Model
- `order_id`: Int, primary key, auto-increment
- `customer_id`: Int, required
- `total_price`: Decimal, required
- `status`: String, required (e.g., "pending", "completed", "shipped")
- `created_at`: DateTime, default: current timestamp (auto-populated)

**Relationships:**
- One Order can have many OrderItems

**Cascade Behavior:**
- When an Order is deleted, all OrderItems belonging to it are also deleted

---

### OrderItem Model
- `order_item_id`: Int, primary key, auto-increment
- `order_id`: Int, foreign key (references Order model)
- `product_id`: Int, foreign key (references Product model)
- `quantity`: Int, required
- `price`: Decimal, required (price at time of purchase)

**Relationships:**
- Each OrderItem belongs to one Order
- Each OrderItem references one Product

**Cascade Behavior:**
- Automatically deleted when its parent Order is deleted
- Automatically deleted when its referenced Product is deleted



---

## Section 2: API Contract

**Standard Error Format:** All errors return `{ "error": "message" }`

**Architecture:** Client → Route → Controller → Model → Database

---

## Product Endpoints

### 1. GET /products/:id
**Fetch a specific product by ID**

**Flow:** `productRoutes.js` → `productController.getProductById()` → `Product.findById()`

**Request:**
- Params: `id` (integer)
- Body: None

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "image_url": "https://example.com/laptop.jpg",
  "category": "Electronics"
}
```

**Errors:**
- `404` - Product not found
- `400` - Invalid ID format

---

### 2. GET /products
**Fetch all products with optional filtering and sorting**

**Request:**
- Params: None
- Body: None

**Query Parameters:**
- `category` (string, optional): Filter products by category (e.g., `?category=Apparel`)
  - If provided, only products matching the exact category name are returned
  - Case-sensitive match
  - If the category doesn't exist, returns an empty array
- `sort` (string, optional): Sort products by field (e.g., `?sort=price` or `?sort=name`)
  - Valid values: `price`, `name`
  - Default sort order: ascending (lowest to highest for price, A-Z for name)
  - If invalid sort value is provided, returns unsorted results
- **Default Behavior (no parameters):** Returns all products in database order (no specific sorting)

**Example Requests:**
- `GET /products` - Returns all products, unsorted
- `GET /products?category=Apparel` - Returns only Apparel products
- `GET /products?sort=price` - Returns all products sorted by price (ascending)
- `GET /products?sort=name` - Returns all products sorted by name (A-Z)
- `GET /products?category=Snacks&sort=price` - Returns Snacks sorted by price

**Response (200 OK):**
```json
[
  { "id": 1, "name": "Laptop", "description": "...", "price": 999.99, "image_url": "...", "category": "Electronics" },
  { "id": 2, "name": "T-Shirt", "description": "...", "price": 19.99, "image_url": "...", "category": "Clothing" }
]
```

**Errors:**
- `500` - Failed to fetch products

---

### 3. POST /products
**Create a new product**

**Request:**
- Params: None
- Body:
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "price": "number (required)",
  "image_url": "string (required)",
  "category": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Notebook",
  "description": "...",
  "price": 5.99,
  "image_url": "...",
  "category": "Stationery"
}
```

**Errors:**
- `400` - Missing required field or invalid data

---

### 4. PUT /products/:id
**Update an existing product**

**Request:**
- Params: `id` (integer)
- Body: (at least one field required)
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "image_url": "string (optional)",
  "category": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Updated Laptop",
  "description": "...",
  "price": 899.99,
  "image_url": "...",
  "category": "Electronics"
}
```

**Errors:**
- `404` - Product not found
- `400` - No fields provided or invalid data

---

### 5. DELETE /products/:id
**Delete a product**

**Request:**
- Params: `id` (integer)
- Body: None

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

**Errors:**
- `404` - Product not found

---

## Order Endpoints

### 6. GET /orders
**Fetch all orders**

**Request:**
- Params: None
- Body: None

**Response (200 OK):**
```json
[
  {
    "order_id": 1,
    "customer_id": 101,
    "total_price": 1025.97,
    "status": "completed",
    "created_at": "2026-06-22T10:30:00.000Z"
  }
]
```

**Errors:**
- `500` - Failed to fetch orders

---

### 7. GET /orders/:order_id
**Fetch order with items**

**Request:**
- Params: `order_id` (integer)
- Body: None

**Response (200 OK):**
```json
{
  "order_id": 1,
  "customer_id": 101,
  "total_price": 1025.97,
  "status": "completed",
  "created_at": "2026-06-22T10:30:00.000Z",
  "order_items": [
    { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 999.99 },
    { "order_item_id": 2, "order_id": 1, "product_id": 3, "quantity": 5, "price": 5.99 }
  ]
}
```

**Errors:**
- `404` - Order not found
- `400` - Invalid order ID

---

### 8. POST /orders
**Create order with items (transactional)**

**Request:**
- Params: None
- Body:
```json
{
  "customer_id": "integer (required)",
  "status": "string (optional, default: 'pending')",
  "items": [
    { "product_id": "integer", "quantity": "integer" }
  ]
}
```

**Response (201 Created):**
```json
{
  "order_id": 1,
  "customer_id": 101,
  "total_price": 1025.97,
  "status": "pending",
  "created_at": "2026-06-22T10:30:00.000Z",
  "order_items": [...]
}
```

**Errors:**
- `400` - Missing fields, empty items array, or invalid quantity
- `404` - Invalid product_id in items

---

### 9. PUT /orders/:order_id
**Update order status/price**

**Request:**
- Params: `order_id` (integer)
- Body: (at least one required)
```json
{
  "status": "string (optional)",
  "total_price": "number (optional)"
}
```

**Response (200 OK):**
```json
{
  "order_id": 1,
  "customer_id": 101,
  "total_price": 1025.97,
  "status": "completed",
  "created_at": "2026-06-22T10:30:00.000Z"
}
```

**Errors:**
- `404` - Order not found
- `400` - No fields provided

---

### 10. DELETE /orders/:order_id
**Delete an order**

**Request:**
- Params: `order_id` (integer)
- Body: None

**Response (200 OK):**
```json
{
  "message": "Order deleted successfully"
}
```

**Errors:**
- `404` - Order not found

---

## OrderItem Endpoints (Stretch)

### 11. GET /order-items
**Fetch all order items**

**Request:**
- Params: None
- Body: None

**Response (200 OK):**
```json
[
  { "order_item_id": 1, "order_id": 1, "product_id": 1, "quantity": 1, "price": 999.99 }
]
```

**Errors:**
- `500` - Failed to fetch order items

---

### 12. POST /orders/:order_id/items
**Add item to existing order**

**Request:**
- Params: `order_id` (integer)
- Body:
```json
{
  "product_id": "integer (required)",
  "quantity": "integer (required)"
}
```

**Response (201 Created):**
```json
{
  "order_item_id": 3,
  "order_id": 1,
  "product_id": 2,
  "quantity": 3,
  "price": 19.99
}
```

**Errors:**
- `404` - Order or product not found
- `400` - Invalid quantity

---

## Section 3: Transactional Flow

### POST /orders - Order Creation Transaction

The `POST /orders` endpoint is the most complex operation in the system as it involves creating multiple related records atomically.

#### Request Body Shape
```json
{
  "customer_id": 101,
  "status": "pending",  // optional, defaults to "pending"
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

#### Step-by-Step Data Layer Operations

1. **Validation Phase**
   - Validate that `customer_id` is provided and is a valid integer
   - Validate that `items` array exists and is not empty
   - Validate that each item has `product_id` and `quantity`

2. **Price Calculation Phase**
   - For each item in the `items` array:
     - Query the `Product` table to fetch the current price for `product_id`
     - If product doesn't exist, transaction should fail with 404 error
     - Calculate item subtotal: `price * quantity`
   - Calculate total order price by summing all item subtotals

3. **Transaction Execution (Using Prisma $transaction)**
   - **Step 3a**: Create the Order record
     ```javascript
     const order = await prisma.order.create({
       data: {
         customer_id: req.body.customer_id,
         total_price: calculatedTotal,
         status: req.body.status || 'pending',
         created_at: new Date()
       }
     })
     ```
   
   - **Step 3b**: Create all OrderItem records
     - For each item in the request:
       ```javascript
       await prisma.orderItem.create({
         data: {
           order_id: order.order_id,
           product_id: item.product_id,
           quantity: item.quantity,
           price: productPrice  // Price at time of purchase
         }
       })
       ```

4. **Response Formation**
   - Fetch the created order with all its order items included
   - Return status 201 with the complete order object

#### Atomicity and Error Handling

**If any step fails, the entire operation rolls back:**

- **Invalid product_id**: If any product in the items array doesn't exist in the database
  - Error: `404 - Product with id X not found`
  - Result: No order created, no order items created

- **Empty items array**: If no items are provided
  - Error: `400 - Order must contain at least one item`
  - Result: No database operations performed

- **Invalid quantity**: If quantity is 0 or negative
  - Error: `400 - Invalid quantity for product`
  - Result: No database operations performed

- **Database constraint violation**: If foreign key constraints fail
  - Error: `500 - Failed to create order`
  - Result: Transaction rolls back, no partial order

#### Why Prisma $transaction is Critical

Without a transaction wrapper, if:
1. The Order is created successfully (order_id = 5)
2. First OrderItem is created successfully
3. Second OrderItem fails (invalid product_id)

Result would be: **Orphaned order with incomplete items** - This violates data integrity.

With `prisma.$transaction()`, all operations succeed together or all fail together, ensuring the database never contains partial orders.

---

## Decisions Log

### Decisions Log — Product Model

- **Schema translation that went smoothly**: 
  - `price` as Decimal — Prisma's Decimal type maps cleanly to PostgreSQL NUMERIC, which is ideal for currency values as it avoids floating-point precision issues
  - All required fields translated directly from the spec with no modifications needed

- **Field decision made during implementation**: 
  - Used `@default(autoincrement())` for the `id` field as specified in the data model
  - All fields marked as required (no optional modifiers) matching the spec exactly

- **Route behavior that matched spec**: 
  - `PUT /products/:id` returns 200 with the updated product as documented
  - `DELETE /products/:id` successfully cascades to delete related OrderItems
  - All CRUD operations tested and confirmed working as specified

### Decisions Log — Order Creation Transaction

- **What my Transactional Flow spec got right**: 
  - The step-by-step order of operations was accurate — fetch product prices first, then create Order, then create OrderItems
  - The error handling for invalid product_id was well-defined and implemented as specified
  - Using `prisma.$transaction()` ensured atomicity as planned

- **What the spec missed that I discovered during implementation**: 
  - Spec didn't explicitly address handling of empty items array — added validation to return 400 error
  - Need to convert customer_id to integer and handle string inputs from frontend
  - Total price calculation needed to handle Decimal type conversion properly

- **How the transaction error handling works**: 
  - `prisma.$transaction()` wraps all database operations in a single transaction
  - If any operation within the transaction fails (throws an error), Prisma automatically rolls back all changes
  - This ensures that either a complete order with all items is created, or nothing is created at all
  - The transaction prevents partial orders from existing in the database

- **One thing I'd design differently if starting over**: 
  - Would consider adding a `customer` table instead of just storing `customer_id` as an integer
  - Could add validation to check if the customer exists before creating orders
  - Might add an `updated_at` timestamp to track when orders are modified

---

## Spec Reconciliation — Milestone 4 (Schema Audit)

### Schema vs. spec gaps found
- **No gaps found** — schema matched spec exactly
- All three models (Product, Order, OrderItem) implemented with correct field names and types
- Relationships between models correctly defined with `@relation` decorators
- Primary keys and foreign keys match the data model specification

### Cascade delete verification
- **Deleting a Product removes associated OrderItems**: ✅ Tested in Prisma Studio
  - Created test order with order items
  - Deleted a product referenced in order items
  - Verified order items were automatically deleted due to `onDelete: Cascade`

- **Deleting an Order removes associated OrderItems**: ✅ Tested in Prisma Studio
  - Created test order with multiple order items
  - Deleted the order
  - Verified all associated order items were automatically deleted

---

## Final Spec Reconciliation: Project Complete

### Full-system audit result
- **All 12 endpoints match the API contract** (10 core + 2 stretch endpoints)
- **Frontend integration successful** — all routes working as expected
- **CORS configuration added** — enabled `cors` middleware in server.js to allow frontend-backend communication
- **Data flow verified** — products display on home page, cart management works, orders create successfully

### Gaps resolved during frontend integration
- **Customer ID handling**: Frontend sends `customer_id` as a string; added `parseInt()` in controller to handle type conversion
- **Image URL format**: Frontend expects `image_url` field name (not `imageUrl`); schema already uses snake_case as specified
- **Order items response format**: Frontend expects order items nested in the order response for GET /orders/:order_id; implemented using Prisma's `include` option
- **Price format**: Frontend expects price as a number; Prisma Decimal type converts correctly in JSON responses

### What the spec enabled during this project
- **Clear implementation path**: Having the API contract written before coding meant each endpoint had a clear target to implement
- **Easier debugging**: When frontend integration issues arose, the spec made it easy to identify whether the problem was in the API or frontend
- **Consistent error handling**: Defining the error format upfront (`{ "error": "message" }`) meant all endpoints returned errors in the same shape
- **Transaction design confidence**: Writing out the transactional flow before implementation helped avoid the complexity of debugging partial order creation

---
