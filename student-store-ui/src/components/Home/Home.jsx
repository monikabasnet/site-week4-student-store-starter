import ProductGrid from "../ProductGrid/ProductGrid"
import "./Home.css"

function Home({isFetching, products, addToCart, removeFromCart, searchInputValue, getQuantityOfItemInCart, activeCategory, }) {

  // Filters products by the active category if it is not 'All Categories'.
  const productsByCategory =
    Boolean(activeCategory) && activeCategory !== "All Categories"
      ? products.filter((p) => p.category === activeCategory)
      : products

  // Filters products by the active category if it is not 'All Categories',
  // then further filters the result by the search input value if it is not empty.
  const productsToShow = searchInputValue && searchInputValue.trim() !== ""
    ? productsByCategory.filter((p) => p.name.toLowerCase().includes(searchInputValue.toLowerCase()))
    : productsByCategory


  return (
    <div className="Home">
      {searchInputValue && productsToShow.length === 0 && !isFetching && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <p>No products found for "{searchInputValue}"</p>
        </div>
      )}
      <ProductGrid
        products={productsToShow}
        isFetching={isFetching}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        getQuantityOfItemInCart={getQuantityOfItemInCart}
      />
    </div>
  )
}

export default Home;
