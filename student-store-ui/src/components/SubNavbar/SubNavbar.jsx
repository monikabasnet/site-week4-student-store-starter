import { useNavigate } from "react-router-dom";
import "./SubNavbar.css"

function SubNavbar({ activeCategory, setActiveCategory, searchInputValue, handleOnSearchInputChange }) {
  const navigate = useNavigate();


  const categories = ["All Categories", "Accessories", "Apparel", "Books", "Snacks", "Supplies"];

  return (
    <nav className="SubNavbar">

      <div className="content">

        <div className="row">
          <div className="search-bar">
            <input
              type="text"
              name="search"
              placeholder="Search products by name..."
              value={searchInputValue}
              onChange={handleOnSearchInputChange}
            />
            {searchInputValue && (
              <i
                className="material-icons"
                style={{ cursor: 'pointer', color: '#999' }}
                onClick={() => handleOnSearchInputChange({ target: { value: '' } })}
              >
                clear
              </i>
            )}
            <i className="material-icons">search</i>
          </div>
        </div>

        <div className="row">
          <ul className={`category-menu`}>
            {categories.map((cat) => (
              <li className={activeCategory === cat ? "is-active" : ""} key={cat}>
                <button onClick={() => {
                  setActiveCategory(cat);
                  navigate('/');
                }}>{cat}</button>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </nav>
  )
}

export default SubNavbar;