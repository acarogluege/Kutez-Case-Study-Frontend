import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const API_URL = "https://backend-production-c4f6.up.railway.app/"; // This assumes FastAPI server is running locally at port 8000

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= products.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0 ? Math.max(0, products.length - itemsPerPage) : prevIndex - itemsPerPage
    );
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  return (
    <div>
      <div style={styles.sliderContainer}>
        <button
          onClick={prevSlide}
          style={styles.navButton}
          disabled={currentIndex === 0}
        >
          ←
        </button>

        <div style={styles.gridContainer}>
          {products
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
        </div>

        <button
          onClick={nextSlide}
          style={styles.navButton}
          disabled={currentIndex + itemsPerPage >= products.length}
        >
          →
        </button>
      </div>

      <div style={styles.pagination}>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerPage)}
            style={{
              ...styles.paginationDot,
              backgroundColor: currentPage === index + 1 ? '#333' : '#ddd'
            }}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const colors = [
    { label: "Yellow Gold", value: "yellow", hex: "#E6CA97" },
    { label: "White Gold", value: "white", hex: "#D9D9D9" },
    { label: "Rose Gold", value: "rose", hex: "#E1A4A9" }
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(score);

    return (
      <div style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <img
            key={`full-${i}`}
            src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/star.svg"
            alt="full star"
            style={styles.star}
          />
        ))}
        {hasHalfStar && (
          <img
            src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/solid/star-half.svg"
            alt="half star"
            style={styles.star}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <img
            key={`empty-${i}`}
            src="https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/regular/star.svg"
            alt="empty star"
            style={styles.star}
          />
        ))}
      </div>
    );
  };

  const productImage = product.images?.[selectedColor.value]
    || Object.values(product.images || {})[0]; // fallback if color key not found
    

  return (
    <div style={styles.card}>
      <img
        src={productImage || "https://via.placeholder.com/200"}
        alt={product.name}
        style={styles.image}
      />

      <div style={styles.info}>
        <h2 className="avenir-book" style={styles.title}>{product.name || "Product Title"}</h2>

        {/* Price */}
        <p style={styles.price}>
          {product.price
            ? `$${product.price.toFixed(2)} USD`
            : "$0.00 USD"}
        </p>

        {/* Color Picker Dots */}
        <div style={styles.colorContainer}>
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color)}
              aria-label={color.label}
              style={{
                ...styles.colorDot,
                backgroundColor: color.hex,
                border: color.value === selectedColor.value 
                  ? "2px solid #333" 
                  : "1px solid #ccc"
              }}
            />
          ))}
        </div>
        <div style={styles.selectedColorLabel}>
          {selectedColor.label}
        </div>

        {/* Popularity Score */}
        <div className="montserrat-medium" style={styles.popularity}>
          {product.popularityScoreFormatted
            ? renderStars(parseFloat(product.popularityScoreFormatted))
            : renderStars(0)}
          <div style={styles.starCount}>
            {product.popularityScoreFormatted ? `${product.popularityScoreFormatted}/5` : "0/5"}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0 1rem',
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1.5rem",
    flex: 1,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1rem",
    textAlign: "center",
    fontFamily: "Avenir, sans-serif"
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    marginBottom: "1rem"
  },
  info: {
    fontFamily: "Montserrat-Medium",
    marginTop: "0.5rem"
  },
  title: {
    fontSize: 18,
    marginBottom: 4
  },
  price: {
    fontFamily: "Montserrat-Regular",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8
  },
  colorContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "0.75rem",
    marginBottom: 8
  },
  colorDot: {
    cursor: "pointer",
    width: "20px",
    height: "20px",
    borderRadius: "75%",
    padding: 0,
    border: "1px solid #ccc",

  },
  selectedColorLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Avenir-Book',
  },
  popularity: {
    fontSize: 14,
    marginTop: 8
  },
  starsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    marginTop: 8
  },
  star: {
    width: '20px',
    height: '20px',
    filter: 'invert(70%) sepia(85%) saturate(1000%) hue-rotate(359deg) brightness(105%)', // Makes stars gold colored
  },
  starCount: {
    fontFamily: 'Avenir-Book',
    marginTop: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  navButton: {
    padding: '1rem',
    fontSize: '1.5rem',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: '#e0e0e0',
    },
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  paginationDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default ProductList;
