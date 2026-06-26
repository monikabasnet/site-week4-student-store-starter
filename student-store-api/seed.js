const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

async function seed() {
  try {
    console.log('🌱 Seeding database...\n')

    // Clear existing data (in order due to relations)
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    // Load JSON data
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8')
    )

    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf8')
    )

    // Seed products and map JSON IDs to DB IDs
    const productIdMap = {}
    for (const product of productsData.products) {
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          category: product.category,
        },
      })
      productIdMap[product.id] = createdProduct.id
      console.log(`✅ Created product: ${product.name} (JSON ID: ${product.id} -> DB ID: ${createdProduct.id})`)
    }

    // Seed orders and items
    for (const order of ordersData.orders) {
      const createdOrder = await prisma.order.create({
        data: {
          customer_id: order.customer_id,
          total_price: order.total_price,
          status: order.status,
          created_at: new Date(order.created_at),
          order_items: {
            create: order.items.map((item) => ({
              product_id: productIdMap[item.product_id], // Use mapped DB ID
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      console.log(`✅ Created order #${createdOrder.order_id}`)
    }

    console.log('\n🎉 Seeding complete!')
  } catch (err) {
    console.error('❌ Error seeding:', err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
